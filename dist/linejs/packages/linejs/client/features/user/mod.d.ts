import type { GetContactV3Response } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
export interface UserInit {
    raw: GetContactV3Response;
}
export declare class User {
    readonly mid: string;
    readonly raw: GetContactV3Response;
    constructor(init: UserInit);
}
//# sourceMappingURL=mod.d.ts.map