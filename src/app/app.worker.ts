/// <reference lib="webworker" />
import {init, format} from '../libs/cmark';

let isLoad = false;
addEventListener('message', async ({data}) => {

    if (!isLoad) {
        await init();
        isLoad = true;
    }

    if (data.eventName === 'request') {
        const {address, appKey, askContext, key, questionContent} = data.message;

        fetch(address, {
            method: 'POST',
            body: JSON.stringify({
                content: undefined,
                appKey: appKey,
                context: askContext,
            }),
            headers: {
                'accept': 'text/event-stream',
                'content-type': 'application/json'
            },
        })
            .then((response) => {
                return response.body;
            })
            .then((rb) => {
                let mdChunk = '';
                let sn = '';
                let firstChunk = true;

                const reader = rb!.getReader();
                return new ReadableStream({
                    start: (controller) => {
                        const push = () => {
                            // "done" is a Boolean and value a "Uint8Array"
                            reader.read().then(({done, value}) => {
                                // If there is no more data to read
                                if (done) {
                                    console.log('done', done);
                                    controller.close();
                                    return;
                                }
                                // Get the data and send it to the browser via the controller
                                controller.enqueue(value);
                                // Check chunks by logging to the console
                                let chunkString = new TextDecoder().decode(value);

                                const dataList = chunkString.split('\n');
                                dataList.map((data) => {
                                    if (data && data.indexOf('data:') === 0) {

                                        if (data.indexOf('data: [DONE]') === 0) {
                                            postMessage({
                                                eventName: 'responseChunkEnd',
                                                message: {key, sn, mdChunk, questionContent}
                                            })
                                            return;
                                        }

                                        let chunkObject: any = {};

                                        try {
                                            chunkObject = JSON.parse(data.replace('data: ', ''));
                                        } catch (err) {

                                        }

                                        if (chunkObject.choices[0].delta.content) {
                                            const markdown = chunkObject.choices[0].delta.content;
                                            sn = chunkObject.id;
                                            mdChunk += markdown;
                                            const htmlChunk = format(mdChunk);

                                            if (firstChunk) {
                                                postMessage({
                                                    eventName: 'responseChunkStart'
                                                });
                                                firstChunk = false;
                                            }
                                            postMessage({
                                                eventName: 'responseChunk',
                                                message: {
                                                    htmlChunk,
                                                    firstChunk
                                                }
                                            });
                                        }
                                    }
                                })
                                push();
                            });
                        }
                        push();
                    },
                });
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
