import type {
    ApiPluginPlugin,
    OpenMapOptions
} from '../../src/definitions';
import { WebPlugin } from '@capacitor/core';
import { uuid4 } from './utils';

let ws:any = null;
let i:number = 0;

export class ApiPluginElectronWeb extends WebPlugin implements ApiPluginPlugin {

    async getId(): Promise<string> {
        return uuid4();
    }

    async echo(options: { value: string }): Promise<{ value: string }> {
        console.log('ECHO ELECTRON', options);
        return options;
    }

    async openMap(location: OpenMapOptions): Promise<OpenMapOptions> {
        return location;
    }

    async handleSocketConnect(): Promise<void> {
        console.log('handleSocketConnect');
        let serverAddress = 'ws:' + '127.0.0.1' + ':' + '3030';
        ws = new WebSocket(serverAddress);
        ws.onmessage = (message: any) => {
            console.log('WebSocket: Message recieved: ' + message.data);
        };
        ws.onerror = (event: any) => {
            console.log('Websocket: Error ' + event);
        };
        ws.onopen = () => {
            console.log('Websocket: Connected to Server');
        };
        ws.onclose = () => {
            console.log('WebSocket: Closing');
        };
        console.log('WebSocket: ready ');
    }

    async handleSocketSend(): Promise<void> {
        if (ws !== null) {
            ws.send(`This is a test message ${i++}`);
            console.log('handleSocketSend: message sent ');
        }
    }

    async handleSocketClose(): Promise<void> {
        if (ws !== null) {
            ws.close();
            console.log('handleSocketClose');
        }
    }
}

import { registerPlugin } from '@capacitor/core';
const ApiPlugin = registerPlugin<ApiPluginPlugin>('ApiPlugin', {
    electron: new ApiPluginElectronWeb()
  });
export { ApiPlugin };