const { RTMClient, WebClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;

class Client {
  constructor() {
    this.web = new WebClient(token);
    this.rtm = new RTMClient(token);
    this.activeUsers = new Set();

    this.subscribePresence();

    this.rtm.on('authenticated', event => {
      console.info(`Logged in as ${event.self.name} of team ${event.team.name}`);
    });

    this.rtm.on('presence_change', event => {
      if (event.presence === 'active') {
        this.activeUsers.add(event.user);
      } else if (event.presence === 'away') {
        this.activeUsers.delete(event.user);
      }
    });

    this.rtm.on('team_join', event => {
      console.log(event);
    });

    this.rtm.on('message', (event) => {
      // Skip messages that are from a bot or my own user ID
      if ((event.subtype && event.subtype === 'bot_message') ||
        (!event.subtype && event.user === this.rtm.activeUserId)) {
        return;
      }
    });


    this.rtm.start({ batch_presence_aware: true });
  }

  sendMessage(text, channelId) {
    this.rtm.sendMessage(text, channelId).then(msg => console.log(msg));
  }

  subscribePresence() {
    this.web.users.list()
      .then(res => {
        let userIds = [];
        if (res.ok) {
          res.members.forEach(member => {
            if (member.id !== 'USLACKBOT' && !member.is_bot) {
              userIds.push(member.id);
            }
          });
        }
        return userIds;
      })
      .then(userIds => this.rtm.subscribePresence(userIds))
      .catch(err => console.error(err));
  }
}

module.exports = new Client();
