import {BufferEncoders, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";

class RSocketFactory {
    constructor() {
        this._initClient();
    }

    _initClient() {
        this.client = new RSocketClient({
            transport: new RSocketWebSocketClient({url: `${process.env.REACT_APP_BLOG_API.replace('http', 'ws')}/rsocket`}, BufferEncoders),
            setup: {
                dataMimeType: 'application/cbor',
                metadataMimeType: 'message/x.rsocket.routing.v0',
                keepAlive: 10000,
                lifetime: 20000
            }
        })
    }

    routingMetadata(route) {
        return Buffer.from(String.fromCharCode(route.length) + route);
    };

    async getRSocket() {
        try {
            if (this.rsocket) {
                if (this.rsocket.availability() !== 0) {
                    return this.rsocket;
                }
                this.rsocket.close();
                this.client.close();
                this._initClient();
            }
            this.rsocket = await this.client.connect();
            return this.rsocket;
        } catch (error) {
            throw error;
        }
    }
}

export default new RSocketFactory();