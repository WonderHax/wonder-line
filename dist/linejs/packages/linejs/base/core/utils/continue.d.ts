import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
export type Continuable = {
    continuationToken?: string;
    [k: string]: LooseType;
};
export declare function continueRequest<P extends Continuable, R extends Continuable, H extends (param: P) => Promise<R>>(options: {
    handler: H;
    arg: P;
}): Promise<ReturnType<H>>;
//# sourceMappingURL=continue.d.ts.map