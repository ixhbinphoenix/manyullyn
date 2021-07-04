# manyullyn
Manyullyn is a Twitch chatbot for moderation and fun

## Setup
First, clone the git repository using `git clone https://github.com/ixhbinphoenix/manyullyn.git`
Configure all files ending with .example.json (except tokens and the app part of config.json, we will get to that later) and remove the .example from their name.
To start the bot, run `npm run start`. For the bot to work, you'll have to setup Authentication first.

## Authentication
Now, we'll have to setup authentication for the Twitch API.

Create a Twitch application with your main Twitch account in your [Twitch developer Console](https://dev.twitch.tv/console/apps). Set the Redirect URI to `http://localhost`. Save the Client ID and Client Secret into your config.json

### Tokens
The bot uses a two Token Setup, to seperate the account making API request and the account sending messages in your chat.

You'll have to repeat the following steps with your main account for the API and your bot account for the Chat.

For API access tokens, we'll need to specify scopes we need. The Chat Tokens require `chat:edit` and `chat:read`. The API tokens require almost all scopes, so I would just use most things from [here](https://dev.twitch.tv/docs/authentication#scopes).

To obtain a authorization token form Twitch, you'll have to open this page in your browser, with the Placeholders changed
```url
https://id.twitch.tv/oauth2/authorize?client_id=YOUR_CLIENT_ID
    &redirect_uri=http://localhost
    &response_type=token
    &scope=scopes:seperated by:spaces
```
It will redirect you to localhost, which will result in an error page. Copy the &code= from the URL in your browser and save it for later.

For the next step, it is advised to use a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) to make POST requests to a URL, but you can also use curl instead.

Send a POST request with no Body and the Placeholders changed to this URL
```url
https://id.twitch.tv/oauth2/token?client_id=YOUR_CLIENT_ID
    &client_secret=YOUR_CLIENT_SECRET
    &code=CODE_FROM_LAST_REQUEST
    &grant_type=authorization_code
    &redirect_uri=http://localhost
```
The respone body should look like this:
```json
{
    "access_token": "adiasinbfuioafbioafbafujbaufba",
    "refresh_token": "gvifrdhnaiojdnfaikofgnaujfdbnauoijd",
    "expires_in": 3600,
    "scope": ["provided:scopes"],
    "token_type": "bearer"
}
```
You can copy this into either APItokens.json or TMItokens.json with a small change. You have to change `access_token` to `accessToken` and `refresh_token` to `refreshToken`.

And now you're finished! You can now launch the bot using `npm run start`