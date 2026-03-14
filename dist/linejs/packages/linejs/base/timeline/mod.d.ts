import type { BaseClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/mod.ts";
import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
export type TimelineResponse<T = LooseType> = {
    code: number;
    message: string;
    result: T;
};
export declare class Timeline {
    protected timelineToken: string | undefined;
    timelineHeaders: Record<string, string | undefined>;
    client: BaseClient;
    constructor(client: BaseClient);
    initTimeline(): Promise<void>;
    createPost(options: {
        homeId: string;
        text?: string;
        sharedPostId?: string;
        textSizeMode?: "AUTO" | "NORMAL";
        backgroundColor?: string;
        textAnimation?: "NONE" | "SLIDE" | "ZOOM" | "BUZZ" | "BOUNCE" | "BLINK";
        readPermissionType?: "ALL" | "FRIEND" | "GROUP" | "EVENT" | "NONE";
        readPermissionGids?: string[];
        holdingTime?: number;
        stickerIds?: string[];
        stickerPackageIds?: string[];
        locationLatitudes?: number[];
        locationLongitudes?: number[];
        locationNames?: string[];
        mediaObjectIds?: string[];
        mediaObjectTypes?: string[];
        sourceType?: string;
    }): Promise<TimelineResponse>;
    deletePost(options: {
        homeId: string;
        postId: string;
    }): Promise<TimelineResponse>;
    getPost(options: {
        homeId: string;
        postId: string;
    }): Promise<TimelineResponse>;
    listPost(options: {
        homeId: string;
        postId?: string;
        updatedTime?: number;
        sourceType?: string;
    }): Promise<TimelineResponse>;
    updatePost(options: {
        homeId: string;
        postId: string;
        text?: string;
        sharedPostId?: string;
        textSizeMode?: "AUTO" | "NORMAL";
        backgroundColor?: string;
        textAnimation?: "NONE" | "SLIDE" | "ZOOM" | "BUZZ" | "BOUNCE" | "BLINK";
        holdingTime?: number;
        stickerIds?: string[];
        stickerPackageIds?: string[];
        locationLatitudes?: number[];
        locationLongitudes?: number[];
        locationNames?: string[];
        mediaObjectIds?: string[];
        mediaObjectTypes?: string[];
    }): Promise<TimelineResponse>;
    likePost(options: {
        contentId: string;
        homeId: string;
        likeType?: "1003" | "1001" | "1002" | "1004" | "1006" | "1005";
        sourceType?: string;
    }): Promise<TimelineResponse>;
    createComment(options: {
        contentId: string;
        commentText: string;
        homeId: string;
        sourceType?: string;
        contentsList?: LooseType[];
    }): Promise<TimelineResponse>;
    sharePost(options: {
        postId: string;
        chatMid: string;
        homeId: string;
    }): Promise<TimelineResponse>;
}
//# sourceMappingURL=mod.d.ts.map