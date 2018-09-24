const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const config = require("./config.json");

client.on('ready', () => {
    console.log('Answers are ready');
})

client.on('message', (message) => {
   if (message.author === client.user) return;
  
var messageText = message.content.toUpperCase(); 
  
  if (messageText == "EXAMPLE") {
      message.reply(" here have a coke!");
  }
})


client.login(config.token);
  


