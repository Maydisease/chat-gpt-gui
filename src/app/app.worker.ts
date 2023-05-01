/// <reference lib="webworker" />
import {init, format} from '../libs/cmark';

let isLoad = false;

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
                //context_length_exceeded
                if (jsonObject.error && jsonObject.error.message) {
                    resolve([true, {msg: jsonObject.error.message, code: jsonObject.error.code}])
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
    chunkEvent: (chunk: string) => void;
}

const handleReadableStream = (reader: ReadableStreamDefaultReader<Uint8Array>, event: XReadableStreamEvent) => {
    new ReadableStream({
        start: (controller) => {
            const push = async () => {
                // "done" is a Boolean and value a "Uint8Array"
                const {done, value} = await reader.read();
                // If there is no more data to read
                if (done) {
                    event.doneEvent();
                    controller.close();
                    return;
                }
                controller.enqueue(value);
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

        const {address, appKey, askContext, key, questionContent} = data.message;

        postMessage({
            eventName: 'requestStart',
            message: {
                questionContent
            }
        });

        fetch(address, {
            method: 'POST',
            body: JSON.stringify({
                content: undefined,
                appKey: appKey,
                context: askContext
            }),
            headers: {
                'accept': 'text/event-stream',
                'content-type': 'application/json'
            },
        })
            .then((response) => {
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
});
