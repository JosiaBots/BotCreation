const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const config = require("./config.json")

 client.on('message', message => {
    // So the bot doesn't reply to iteself
    if (message.author.bot) return;
    
    // Check if the message starts with the `!` trigger
    if (message.content.indexOf('$') === 0) {
        // Get the user's message excluding the `!`
        var text = message.content.substring(1);
        
        // Reverse the message
        var reversed = '';
        var i = text.length;
        
        while (i > 0) {
            reversed += text.substring(i - 1, i);
            i--;
        }
        
        // Reply to the user's message
        message.channel.sendMessage(reversed);
    }
  });

  client.login(process.env.TOKEN);