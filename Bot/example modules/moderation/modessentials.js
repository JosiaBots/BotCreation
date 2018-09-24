const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const config = require("./config.json")

client.login("ready", () => {
  console.log('mod commands')
})

client.on("message", async message => {

    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if(command === "ping") {
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    
    if(command === "say") {
      const sayMessage = args.join(" ");
      message.delete().catch(O_o=>{});  
      message.channel.send(sayMessage);
    }
    
    if(command === "kick") {
       if(!message.member.permissions.has('KICK_MEMBERS') )    
        return message.reply("Sorry, you don't have permissions to use this!");
      
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.kickable) 
        return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
      
        let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
      
      // Now, time for a swift kick in the nuts!
      await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
      message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  
    }
    
    if(command === "ban") {

      if(!message.member.permissions.has('BAN_MEMBERS'))
        return message.reply("Sorry, you don't have permissions to use this!");
      
      let member = message.mentions.members.first();
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.bannable) 
        return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
  
      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
      
      await member.ban(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    }
    
    if(command === "purge") {
      // This command removes all messages from all users in the channel, up to 100.
      
      // get the delete count, as an actual number.
      const deleteCount = parseInt(args[0], 10);
      if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply("Sorry, you don't have permissions to use this!");
      if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        await message.delete();
      
      // So we get our messages, and delete them. 
      const fetched = await message.channel.fetchMessages({limit: deleteCount});
      message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
  });

  client.login(process.env.TOKEN);