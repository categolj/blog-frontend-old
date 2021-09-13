import {IdentitySerializer, JsonSerializer, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import urlProvider from "./urlProvider";

class RSocketFactory {
    constructor() {
        this._initClient();
    }

    _initClient() {
        this.client = new RSocketClient({
            transport: new RSocketWebSocketClient({url: `${urlProvider.BLOG_UI.replace('http', 'ws').replace("-frontend", "-api")}/rsocket`}),
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer
            },
            setup: {
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
                keepAlive: 10000,
                lifetime: 20000
            }
        })
    }

    routingMetadata(route) {
        return String.fromCharCode(route.length) + route;
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