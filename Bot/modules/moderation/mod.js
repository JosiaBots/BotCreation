  // Say if it's online (Mute not given) (-)

  const Discord = require('discord.js');
  const client = new Discord.Client();
  const express = require('express');
  const config = require("./config.json")
  
  client.login("ready", () => {
  console.log('mod ready')
})

  const { handleReport } = require('./report.js');
  const { handleImage } = require('./images.js');
  const { handleMute } = require('./mute.js');
  const { handleAnnounce } = require('./announcement.js');
  const { handleDump } = require('./dump.js');
  
  
  const configw = {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX || '-',
    opRole: process.env.OP_ROLE,
    logChannel: process.env.LOG_CHANNEL,
    reportChannel: process.env.REPORT_CHANNEL || process.env.LOG_CHANNEL,
    announcement: {
      webhook: {
        id: process.env.ANNOUNCEMENT_WEBHOOK_ID,
        token: process.env.ANNOUNCEMENT_WEBHOOK_TOKEN,
      },
      color: parseInt(process.env.ANNOUNCMENT_EMBED_COLOR || '0', 10),
      title: process.env.ANNOUNCMENT_EMBED_TITLE,
    },
    guildId: process.env.GUILD_ID,
    deletePics: 100000,
    pingOp: process.env.PING_FOR_REPORT === 'false',
    muteds: {},
    username: process.env.USERNAME,
  };
  
  const imgRegex = new RegExp(`^${configw.prefix}(bi2|bi|rtp|wc|vaubanned|mi|rule1)$`);
  const muteRegex = new RegExp(`^${configw.prefix}(um|qm)$`);
  
  function log(message, type, color) {
    const now = new Date();
    let eColor;
    if (type === 'error') {
      eColor = 0xff0000;
    } else if (color) {
      eColor = color;
    } else {
      eColor = 0x7289DA;
    }
    const embed = {
      color: eColor,
      fields: [{
        name: '_ _',
        value: message,
      }],
      timestamp: new Date(now.getTime() + (now.getTimezoneOffset() * 60000)),
    };
    if (configw.logChannel) {
      configw.logChannel.send('', {
        embed,
      // eslint-disable-next-line no-console
      }).catch(console.error);
    } else if (type !== 'error') {
      // eslint-disable-next-line no-console
      console.info(message);
    } else {
      // eslint-disable-next-line no-console
      console.error(message);
    }
  }
  // still mute command but now the logger
  
  client.on('message', async (message) => {
    // don't call if the caller is a bot  or it's not in the designated guild
    if (message.author.bot || !message.member || (message.channel.type !== 'text' && message.guild.id !== configw.guildId)) return;
  
    if (message.member.roles.get(configw.opRole)) {
      if (imgRegex.test(message.content)) {
        await handleImage(message, configw, imgRegex.exec(message.content));
      }
  
      if (muteRegex.test(message.content)) {
        await handleMute(message, configw, muteRegex.exec(message.content), log);
      }
    }
  
    if(message.member.roles.get(configw.superOp)) {
      if (message.content.startsWith(`${configw.prefix}dump`)) {
        if (message.attachments.first()) {
          await handleDump(message, configw);
        } else {
          log('no attachment', 'error');
        }
      }
  
      if (message.content.startsWith(`${configw.prefix}announce`)) {
        await handleAnnounce(message, configw, configw.announcement.webhook.object);
      }
    }
    
  
    if (message.content.startsWith(`${configw.prefix}report`)) {
      await handleReport(message, configw);
    }
  });

  client.login(process.env.TOKEN);