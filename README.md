# Giveaway Bot

🎁 Giveway Bot with slash commands made using the [vante-giveaways](https://npmjs.com/vante-giveaways) package!

## Features

* `/start-giveaway` command
* `/end-giveaway` command
* `/reroll-giveaway` command
* `/pause-giveaway` command
* `/unpause-giveaway` command
* `/drop-giveaway` command

<div style="display: flex;">
    <div style="flex: 50%; padding: 10px;">
        <a href="http://zupimages.net/viewer.php?id=23/41/9fe2.png">
            <img src="https://zupimages.net/up/23/41/9fe2.png" style="width: 100%; height: auto;"/>
        </a>
    </div>
    <div style="flex: 50%; padding: 10px;">
        <a href="http://zupimages.net/viewer.php?id=23/41/8po1.png">
            <img src="https://zupimages.net/up/23/41/8po1.png" style="width: 100%; height: auto;"/>
        </a>
    </div>
</div>

## Installation tutorial

* Clone the repository (Or download it manually):
```sh
git clone https://github.com/vante-dev/vante-giveaways-bot
```

* Fill the configuration file (./config.json):
```js
module.exports = {
  prefix: "", // bot prefix
  owner: "", // bot owner id
  token: "", // client token (bot token)
}

```

* Install required dependencies (Execute below command in bot's root directory):
```sh
npm install
```

* Run the bot:
```sh
node index.js
```