import type * as LINETypes from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
import type { SyncData } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/polling/mod.ts";
import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
type LogType = "login" | "request" | "response" | (string & {});
export interface Log {
    type: LogType;
    data: LooseType;
}
export type ClientEvents = {
    pincall: (pincode: string) => void;
    qrcall: (loginUrl: string) => void;
    ready: (user: LINETypes.Profile) => void;
    end: (user: LINETypes.Profile) => void;
    "update:authtoken": (authToken: string) => void;
    "update:profile": (profile: LINETypes.Profile) => void;
    "update:cert": (cert: string) => void;
    "update:qrcert": (qrCert: string) => void;
    "update:syncdata": (sync: SyncData) => void;
    log: (data: Log) => void;
};
export {};
//# sourceMappingURL=events.d.ts.map