const Discord = require('discord.js');
const express = require('express');
const config = require("./config.json");
const client = new Discord.Client();

client.on("ready", () => {
    console.log('Help Command')
})

client.on('message', (message) =>{
    if(message.content.indexOf('-help') !== 0) return;
    if(message.content.startsWith('-help'));
    message.delete();
    message.author.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      }, 
      title: "Help Command",
              description: "***Simple Commands!***",
              fields: [{
                  name: "***ping***",
                  value: "When you type `ping` the bot will answer `pong!`"
                },
                {
                  name: "***-owner***",
                  value: "Gives information about the owner!"
                },
                {
                  name: "***-giphy***",
                  value: "This command will send a giphy into the chat!"
                },
                {
                  name: "***-ping***",
                  value: "Gives the latency and API ping"
                },
                {
                  name: "***-t help****",
                  value: "Translator help"
                }
              ],
              timestamp: new Date(),
              footer: {
                text: "© BOTNAME 2018"
              }
    }
  
    })
  })

  client.login(process.env.TOKEN);

