# youtube-chat-api

## license

AGPL-3.0-or-later

## API

```typescript
import YoutubeChatAPI from 'youtube-chat-api'

const YoutubeChat = new YoutubeChatAPI(liveChatId: string, interval: number, APIKey: string, UserToken: string)

YoutubeChat.run()

YoutubeChat.on('message', (value) => {
    if (value.snippet.type === 'textMessageEvent') {
        console.log(value.snippet.textMessageDetails.messageText)
    }
})

YoutubeChat.send('Hello!')
```

this library can use Node.js, with ES5 or TypeScript