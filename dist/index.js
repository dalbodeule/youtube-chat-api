"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const events_1 = require("events");
class YoutubeLiveChat extends events_1.EventEmitter {
    constructor(liveChatId, interval, APIKey, UserToken) {
        super();
        this.liveChatId = liveChatId;
        this.interval = interval;
        this.APIKey = APIKey;
        this.nextPage = '';
        this.UserToken = UserToken;
        this.loop = null;
    }
    run() {
        this.loop = setInterval(() => this.getChatMessages(), this.interval);
    }
    stop() {
        if (this.loop) {
            clearInterval(this.loop);
        }
    }
    send(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default({
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
                });
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getChatMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default({
                    url: 'https://www.googleapis.com/youtube/v3/liveChat/meessages?' +
                        `liveChatId=${this.liveChatId}&part=snippet&key=${this.APIKey}&` +
                        (this.nextPage !== '' ? `pageToken=${this.nextPage}` : ''),
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.UserToken}`,
                        Accept: 'application/json',
                    },
                });
                const data = response.data;
                if (data.kind === 'youtube#liveChatMessageListResponse') {
                    data.items.forEach((value, index, array) => {
                        this.emit('message', value);
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = YoutubeLiveChat;
