import { LINEStruct, type ProtocolKey } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/thrift/mod.ts";
import type * as LINETypes from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
import type { BaseClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/core/mod.ts";
import type { BaseService } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/service/types.ts";
import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
export declare class RelationService implements BaseService {
    client: BaseClient;
    protocolType: ProtocolKey;
    requestPath: string;
    errorName: string;
    constructor(client: BaseClient);
    getTargetProfiles(...param: Parameters<typeof LINEStruct.getTargetProfiles_args>): Promise<LINETypes.getTargetProfiles_result["success"]>;
    getRecommendationDetails(...param: Parameters<typeof LINEStruct.getRecommendationDetails_args>): Promise<LINETypes.getRecommendationDetails_result["success"]>;
    getContactCalendarEvents(...param: Parameters<typeof LINEStruct.getContactCalendarEvents_args>): Promise<LINETypes.getContactCalendarEvents_result["success"]>;
    getContactsV3(options: {
        mids: string[];
        checkUserStatusStrictly?: boolean;
    }): Promise<LINETypes.getContactsV3_result["success"]>;
    getFriendDetails(...param: Parameters<typeof LINEStruct.getFriendDetails_args>): Promise<LINETypes.getFriendDetails_result["success"]>;
    getUserFriendIds(...param: Parameters<typeof LINEStruct.getUserFriendIds_args>): Promise<LINETypes.getUserFriendIds_result["success"]>;
    /**
     * @description Add friend by mid.
     */
    addFriendByMid(options: {
        mid: string;
        reference?: string;
        trackingMetaType?: number;
        trackingMetaHint?: string;
    }): Promise<LooseType>;
}
//# sourceMappingURL=mod.d.ts.map