const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const config = require("./config.json")

const Cleverbot = require("cleverbot-node");
const clbot = new Cleverbot;

client.login("ready", () => {
  console.log('DM Respond')
})

client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") {
      message.channel.startTyping();
      setTimeout(() => {
        message.reply("Don't send me messages!").catch(console.error);
        message.channel.stopTyping();
        
  
      
        
});  
    
  }
    });

    client.login(process.env.TOKEN);