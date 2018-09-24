const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');

client.on("message", (message) => {
    if(message.content.startsWith("//inrole")){
        let roleName = message.content.split(" ").slice(1).join(" ");
    
        //Filtering the guild members only keeping those with the role
        //Then mapping the filtered array to their usernames
        let membersWithRole = message.guild.members.filter(member => { 
            return member.roles.find("name", roleName);
        }).map(member => {
            return member.user.username;
        })
    
        let embed = new discord.RichEmbed({
            "title": `Users with the ${roleName} role`,
            "description": membersWithRole.join("\n"),
            "color": 0xFFFF
        });
    
        return message.channel.send({embed});
    }
        });

        client.login(process.env.TOKEN);
