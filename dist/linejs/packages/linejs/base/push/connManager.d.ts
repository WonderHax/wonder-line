import type { LegyH2PushFrame } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/push/connData.ts";
import { Conn } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/push/conn.ts";
import type { BaseClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/mod.ts";
import type { Operation, SquareEvent } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
export interface ReadableStreamWriter<T> {
    stream: ReadableStream<T>;
    enqueue(chunk: T): void;
    close(): void;
    error(err: LooseType): void;
    renew(): void;
}
export declare class ConnManager {
    client: BaseClient;
    conns: Conn[];
    currPingId: number;
    subscriptionIds: Record<number, number>;
    signOnRequests: Record<number, LooseType[]>;
    onPingCallback: (id: number) => void;
    onSignReqResp: Record<number, LooseType>;
    onSignOnResponse: (reqId: number, isFin: boolean, data: Uint8Array) => void;
    onPushResponse: (frame: LegyH2PushFrame) => void;
    _eventSynced: boolean;
    _pingInterval: number;
    authToken: string | null;
    subscriptionId: number;
    opStream: ReadableStreamWriter<Operation>;
    sqStream: ReadableStreamWriter<SquareEvent>;
    constructor(base: BaseClient);
    log(text: string, data?: LooseType): void;
    createAsyncReadableStream<T>(): ReadableStreamWriter<T>;
    initializeConn(state?: number, initServices?: number[]): Promise<Conn>;
    buildRequest(service: number, data: Uint8Array): Uint8Array;
    buildAndSendSignOnRequest(conn: Conn, serviceType: number, kwargs?: Record<string, LooseType>): Promise<{
        payload: Uint8Array<ArrayBuffer>;
        id: number;
    }>;
    _OnSignOnResponse(reqId: number, isFin: boolean, data: Uint8Array): Promise<false | undefined>;
    _OnPushResponse(pushFrame: LegyH2PushFrame): Promise<void>;
    _OnPingCallback(pingId: number): void;
    InitAndRead(initServices?: number[]): Promise<void>;
}
//# sourceMappingURL=connManager.d.ts.map