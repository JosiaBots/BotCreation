const Discord = require('discord.js');
const express = require('express');
const config = require("./config.json");
const client = new Discord.Client();

client.on("ready", () => {
    console.log('')
})

client.login(config.token);
