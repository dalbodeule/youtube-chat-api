import { EventEmitter } from 'events';
interface YoutubeLiveChat extends EventEmitter {
    on(event: 'message', listener: (value: ILiveChatMessage) => void): this;
}
declare class YoutubeLiveChat extends EventEmitter {
    private liveChatId;
    private nextPage;
    private interval;
    private APIKey;
    private UserToken;
    private loop;
    constructor(liveChatId: string, interval: number, APIKey: string, UserToken: string);
    run(): void;
    stop(): void;
    send(msg: string): Promise<boolean>;
    private getChatMessages;
}
export default YoutubeLiveChat;
export interface IYoutubeLiveChatResponse {
    kind: 'youtube#liveChatMessageListResponse';
    etag: string;
    nextPageToken: string;
    pollingIntervalMillis: number;
    offlineAt: Date;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: ILiveChatMessage[];
}
export interface ILiveChatMessage {
    kind: 'youtube#liveChatMessage';
    etag: string;
    id: string;
    snippet: IChatEndedEvent | IMessageDeletedEvent | INewSponsorEvent | ISponsorOnlyModeEndedEvnet | ISponsorOnlyModeStartedEvent | ISuperChatEvent | ISuperStickerEvent | ITextMessageEvent | ITombstone | IUserBannedEvent;
    authorDetails: {
        channelId: string;
        channelUrl: string;
        displayName: string;
        profileImageUrl: string;
        isVerified: boolean;
        isChatOwner: boolean;
        isChatSponsor: boolean;
        isChatModerator: boolean;
    };
}
export interface IChatEndedEvent {
    type: 'chatEndedEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: boolean;
}
export interface IMessageDeletedEvent {
    type: 'messageDeletedEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: boolean;
    displayMessage: string;
    messageDeletedDetails: {
        deletedMessageId: string;
    };
}
export interface INewSponsorEvent {
    type: 'newSponsorEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: boolean;
    displayMessage: string;
}
export interface ISponsorOnlyModeEndedEvnet {
    type: 'sponsorOnlyModeEndedEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: false;
    displayMessage: string;
}
export interface ISponsorOnlyModeStartedEvent {
    type: 'sponsorOnlyModeStartedEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: false;
    displayMessage: string;
}
export interface ISuperChatEvent {
    type: 'superChatEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: boolean;
    displayMessage: string;
    superChatDetails: {
        amountMicros: number;
        currency: string;
        amountDisplayString: string;
        userComment: string;
        tier: number;
    };
}
export interface ISuperStickerEvent {
    type: 'superStickerEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: boolean;
    displayMessage: string;
    superStickerDetails: {
        superStickerMetadata: {
            stickerId: string;
            altText: string;
            language: string;
        };
        amountMicros: number;
        currency: string;
        amountDisplayString: string;
        tier: number;
    };
}
export interface ITextMessageEvent {
    type: 'textMessageEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: boolean;
    displayMessage: string;
    textMessageDetails: {
        messageText: string;
    };
}
export interface ITombstone {
    type: 'tombstone';
    liveChatId: string;
    publishedAt: Date;
}
export interface IUserBannedEvent {
    type: 'userBannedEvent';
    liveChatId: string;
    authorChannelId: string;
    publishedAt: Date;
    hasDisplayContent: boolean;
    displayMessage: string;
    userBannedDetails: {
        bannedUserDetails: {
            channelId: string;
            channelUrl: string;
            displayName: string;
            profileImageUrl: string;
        };
        banType: string;
        banDurationSeconds: number;
    };
}
