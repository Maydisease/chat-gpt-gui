/// <reference lib="webworker" />
import {init, format} from '../libs/cmark';

let isLoad = false;

let requestController: ReadableStreamController<any> | undefined;

type handleErrorReturn = Promise<[boolean, {
    msg: string
    code: string
} | null]>

const handleError = (reader: ReadableStreamDefaultReader<Uint8Array>, response: Response): handleErrorReturn => {
    return new Promise(async (resolve, reject) => {
        if (
            response.headers.get('content-type') &&
            response.headers.get('content-type')!.indexOf('application/json') === 0
        ) {
            const {value} = await reader.read();
            let chunkString = new TextDecoder().decode(value);
            let jsonObject: any = {};
            try {
                jsonObject = JSON.parse(chunkString);
                console.log('jsonObject::', jsonObject)
                if (jsonObject.error && jsonObject.error.code) {
                    resolve([true, {
                        msg: jsonObject.error.message || jsonObject.error.type,
                        code: jsonObject.error.code
                    }])
                    return;
                }
            } catch (err: any) {
                resolve([true, {code: '', msg: err.toString()}])
                return;
            }
        }
        resolve([false, null])
    })

}

interface XReadableStreamEvent {
    doneEvent: () => void;
    errEvent: (err: string) => void;
    chunkEvent: (chunk: string) => void;
}

const handleReadableStream = (reader: ReadableStreamDefaultReader<Uint8Array>, event: XReadableStreamEvent) => {
    new ReadableStream({
        start: (controller) => {

            requestController = controller;

            const push = async () => {
                const readerReadPromise = reader.read();

                readerReadPromise.catch((err) => {
                    event.errEvent(err.toString());
                    controller.close();
                    return;
                })

                const {done, value} = await readerReadPromise;

                if (done) {
                    event.doneEvent();
                    controller.close();
                    return;
                }

                try {
                    controller.enqueue(value);
                } catch (err: any) {
                    event.errEvent('本次请求被取消了...');
                    return;
                }

                let chunkString = new TextDecoder().decode(value);
                event.chunkEvent(chunkString);
                push();
            }
            push();
        },
    });
}

addEventListener('message', async ({data}) => {

    if (!isLoad) {
        await init();
        isLoad = true;
    }

    if (data.eventName === 'request') {

        const {address, key, questionContent, body} = data.message;

        postMessage({
            eventName: 'requestStart',
            message: {
                questionContent
            }
        });

        fetch(address, {
            method: 'POST',
            // body: JSON.stringify({
            //     content: undefined,
            //     appKey: appKey,
            //     context: askContext,
            // }),
            body,
            headers: {
                'content-type': 'application/json'
            },
        })
            .then((response) => {
                console.log('response:::', response)
                return {body: response.body, response};
            })
            .then(async ({body, response}) => {

                console.time('PUSH-ASK')

                let rawChunk = '';
                let mdChunk = '';
                let sn = '';
                let chunkCount = 0;
                let firstChunk = true;
                const reader = body!.getReader();

                const [err, errInfo] = await handleError(reader, response);

                if (err) {
                    postMessage({
                        eventName: 'responseError',
                        message: {
                            key,
                            questionContent,
                            errorContent: errInfo?.msg,
                            errorCode: errInfo?.code
                        }
                    });
                    return;
                }

                handleReadableStream(reader, {
                    // chunk完成事件
                    doneEvent() {
                        postMessage({
                            eventName: 'responseChunkEnd',
                            message: {key, sn, answerMarkdown: mdChunk, questionContent}
                        });
                    },
                    errEvent(err) {
                        postMessage({
                            eventName: 'responseError',
                            message: {
                                key,
                                questionContent,
                                errorContent: err.toString(),
                            }
                        });
                    },
                    // chunk事件
                    async chunkEvent(chunk) {
                        chunkCount++;
                        rawChunk += chunk;
                        if (firstChunk) {
                            postMessage({
                                eventName: 'responseChunkStart'
                            });
                            firstChunk = false;
                        }

                        const dataList = rawChunk.split('\n');
                        mdChunk = '';
                        for (let i = 0; i < dataList.length; i++) {
                            let item = dataList[i];
                            if (item.indexOf('data: ') === 0 && item.indexOf('data: [DONE]') !== 0) {
                                item = item.replace('data: ', '');
                                const result = JSON.parse(item);
                                if (result.choices[0].delta.content) {
                                    mdChunk += result.choices[0].delta.content;
                                }
                            }
                        }

                        let html = format(mdChunk);

                        postMessage({
                            eventName: 'responseChunk',
                            message: {
                                htmlChunk: html
                            }
                        });

                    }
                })

                console.timeEnd('PUSH-ASK')

            })
            .catch((err) => {
                postMessage({
                    eventName: 'responseError',
                    message: {
                        key,
                        questionContent,
                        errorContent: err.toString(),
                    }
                });
            })
    }

    if (data.eventName === 'requestStop') {
        if (requestController) {
            requestController.close();
        }
    }
});
