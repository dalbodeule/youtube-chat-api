import axios, { AxiosResponse } from 'axios'
import { EventEmitter } from 'events'

interface YoutubeLiveChat extends EventEmitter {
  on(event: 'message', listener: (value: ILiveChatMessage) => void): this
}

class YoutubeLiveChat extends EventEmitter {
  private liveChatId: string
  private nextPage: string
  private interval: number
  private APIKey: string
  private UserToken: string
  private loop: NodeJS.Timer | null

  constructor(liveChatId: string, interval: number, APIKey: string, UserToken: string) {
    super()

    this.liveChatId = liveChatId
    this.interval = interval
    this.APIKey = APIKey
    this.nextPage = ''
    this.UserToken = UserToken
    this.loop = null
  }

  public run() {
    this.loop = setInterval(
      () => this.getChatMessages(),
      this.interval
    )
  }

  public stop() {
    if (this.loop) {
      clearInterval(this.loop)
    }
  }

  public async send(msg: string): Promise<boolean> {
    try {
      await axios({
        url: 'https://www.googleapis.com/youtube/v3/liveChat/messages?' +
          `part=snippet&key=${this.APIKey}`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.UserToken}`,
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        data: {
          snippet: {
            liveChatId: this.liveChatId,
            type: 'textMessageEvent',
            textMessageDetails: {
              messageText: msg,
            },
          },
        },
      })

      return true
    } catch (error) {
      throw error
    }
  }

  private async getChatMessages(): Promise<void> {
    try {
      const response: AxiosResponse<IYoutubeLiveChatResponse|any> = await axios({
        url: 'https://www.googleapis.com/youtube/v3/liveChat/meessages?' +
        `liveChatId=${this.liveChatId}&part=snippet,authorDetails&key=${this.APIKey}&` +
        (this.nextPage !== '' ? `pageToken=${this.nextPage}` : ''),
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.UserToken}`,
          Accept: 'application/json',
        },
      })

      const data = response.data

      if (data.kind === 'youtube#liveChatMessageListResponse') {
        (data as IYoutubeLiveChatResponse).items.forEach((value, index, array) => {
          this.emit('message', value)
        })
      }
    } catch (error) {
      throw error
    }
  }
}

export default YoutubeLiveChat

export interface IYoutubeLiveChatResponse {
  kind: 'youtube#liveChatMessageListResponse',
  etag: string,
  nextPageToken: string,
  pollingIntervalMillis: number,
  offlineAt: Date,
  pageInfo: {
    totalResults: number,
    resultsPerPage: number
  },
  items: ILiveChatMessage[]
}

export interface ILiveChatMessage {
  kind: 'youtube#liveChatMessage',
  etag: string,
  id: string,
  snippet:
    IChatEndedEvent |
    IMessageDeletedEvent |
    INewSponsorEvent |
    ISponsorOnlyModeEndedEvnet |
    ISponsorOnlyModeStartedEvent |
    ISuperChatEvent |
    ISuperStickerEvent |
    ITextMessageEvent |
    ITombstone |
    IUserBannedEvent,
  authorDetails: {
    channelId: string,
    channelUrl: string,
    displayName: string,
    profileImageUrl: string,
    isVerified: boolean,
    isChatOwner: boolean,
    isChatSponsor: boolean,
    isChatModerator: boolean
  }
}

export interface IChatEndedEvent {
  type: 'chatEndedEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: boolean
}

export interface IMessageDeletedEvent {
  type: 'messageDeletedEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: boolean,
  displayMessage: string,
  messageDeletedDetails: {
    deletedMessageId: string
  },
}

export interface INewSponsorEvent {
  type: 'newSponsorEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: boolean,
  displayMessage: string
}

export interface ISponsorOnlyModeEndedEvnet {
  type: 'sponsorOnlyModeEndedEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: false,
  displayMessage: string
}

export interface ISponsorOnlyModeStartedEvent {
  type: 'sponsorOnlyModeStartedEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: false,
  displayMessage: string
}

export interface ISuperChatEvent {
  type: 'superChatEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: boolean,
  displayMessage: string,
  superChatDetails: {
    amountMicros: number,
    currency: string,
    amountDisplayString: string,
    userComment: string,
    tier: number
  },
}

export interface ISuperStickerEvent {
  type: 'superStickerEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: boolean,
  displayMessage: string,
  superStickerDetails: {
    superStickerMetadata: {
      stickerId: string,
      altText: string,
      language: string
    },
    amountMicros: number,
    currency: string,
    amountDisplayString: string,
    tier: number
  }
}

export interface ITextMessageEvent {
  type: 'textMessageEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: boolean,
  displayMessage: string,
  textMessageDetails: {
    messageText: string
  }
}

export interface ITombstone {
  type: 'tombstone',
  liveChatId: string,
  publishedAt: Date,
}

export interface IUserBannedEvent {
  type: 'userBannedEvent',
  liveChatId: string,
  authorChannelId: string,
  publishedAt: Date,
  hasDisplayContent: boolean,
  displayMessage: string,
  userBannedDetails: {
    bannedUserDetails: {
      channelId: string,
      channelUrl: string,
      displayName: string,
      profileImageUrl: string
    },
    banType: string,
    banDurationSeconds: number
  }
}
