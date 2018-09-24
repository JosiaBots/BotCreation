const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const config = require("./config.json");

client.on('ready', () => {
    console.log('Commands are ready');
})

client.on('message', (message) => {
   if (message.author === client.user) return;
  
var messageText = message.content.toUpperCase(); 

if (messageText == "+AVATAR") {
    message.channel.sendFile(message.author.avatarURL,'Avatar.png')
}

if (messageText == "+BOTAVATAR") {
    message.channel.sendFile(client.user.avatarURL,'BotAvatar.png')
}

if (messageText == "+SERVERICON") {
message.channel.sendFile(message.guild.iconURL,'ServerAvatar.png')
}
})



client.login(config.token);