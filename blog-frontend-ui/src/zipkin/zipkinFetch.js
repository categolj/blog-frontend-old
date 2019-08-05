/* eslint-env browser */
/* eslint-disable import/newline-after-import */
// https://github.com/openzipkin/zipkin-js-example/blob/master/web/browser.js

// setup tracer
import recorder from "./recorder";
import {ExplicitContext, Tracer} from "zipkin";

const ctxImpl = new ExplicitContext();
const localServiceName = 'blog-frontend-ui';
const tracer = new Tracer({ctxImpl, recorder: recorder(localServiceName), localServiceName});

// instrument fetch
const wrapFetch = require('zipkin-instrumentation-fetch');
const zipkinFetch = wrapFetch(fetch, {tracer});

export default zipkinFetch;