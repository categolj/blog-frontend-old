import {HttpLogger} from 'zipkin-transport-http';
import {BatchRecorder, ExplicitContext, jsonEncoder, Tracer} from 'zipkin';
import wrapFetch from 'zipkin-instrumentation-fetch';

class ZipkinFetch {
    constructor() {
        const httpLogger = new HttpLogger({
            endpoint: `${process.env.REACT_APP_ZIPKIN}/api/v2/spans`,
            jsonEncoder: jsonEncoder.JSON_V2,
            fetchImplementation: window.fetch.bind(window)
        });
        this.tracer = new Tracer({
            ctxImpl: new ExplicitContext(),
            recorder: new BatchRecorder({
                logger: httpLogger
            }),
            localServiceName: 'blog:ui'
        });
    }

    wrap(removeServiceName) {
        return wrapFetch(fetch, {tracer: this.tracer, removeServiceName})
    }
}


export default new ZipkinFetch();