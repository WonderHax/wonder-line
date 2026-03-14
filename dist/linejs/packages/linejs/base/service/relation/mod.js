// For Relation (find user, etc)
import { LINEStruct } from "../../thrift/mod.ts";
export class RelationService {
    constructor(client) {
        this.protocolType = 4;
        this.requestPath = "/RE4";
        this.errorName = "RelationServiceError";
        this.client = client;
    }
    async getTargetProfiles(...param) {
        return await this.client.request.request(LINEStruct.getTargetProfiles_args(...param), "getTargetProfiles", this.protocolType, true, this.requestPath);
    }
    async getRecommendationDetails(...param) {
        return await this.client.request.request(LINEStruct.getRecommendationDetails_args(...param), "getRecommendationDetails", this.protocolType, true, this.requestPath);
    }
    async getContactCalendarEvents(...param) {
        return await this.client.request.request(LINEStruct.getContactCalendarEvents_args(...param), "getContactCalendarEvents", this.protocolType, true, this.requestPath);
    }
    async getContactsV3(options) {
        return await this.client.request.request(LINEStruct.getContactsV3_args({
            request: {
                targetUsers: options.mids.map((m) => ({
                    targetUserMid: m,
                })),
                syncReason: "AUTO_REPAIR",
                checkUserStatusStrictly: options.checkUserStatusStrictly,
            },
        }), "getContactsV3", this.protocolType, true, this.requestPath);
    }
    async getFriendDetails(...param) {
        return await this.client.request.request(LINEStruct.getFriendDetails_args(...param), "getFriendDetails", this.protocolType, true, this.requestPath);
    }
    async getUserFriendIds(...param) {
        return await this.client.request.request(LINEStruct.getUserFriendIds_args(...param), "getUserFriendIds", this.protocolType, true, this.requestPath);
    }
    /**
     * @description Add friend by mid.
     */
    async addFriendByMid(options) {
        const { mid, reference, trackingMetaType, trackingMetaHint } = {
            trackingMetaType: 5,
            ...options,
        };
        return await this.client.request.request([
            [8, 1, await this.client.getReqseq()], // seq
            [11, 2, mid],
            [
                12,
                3,
                [
                    [11, 1, reference],
                    [12, 3, [[12, trackingMetaType, [[
                                        11,
                                        1,
                                        trackingMetaHint,
                                    ]]]]],
                ],
            ],
        ], "addFriendByMid", this.protocolType, false, this.requestPath);
    }
}
//# sourceMappingURL=mod.js.map