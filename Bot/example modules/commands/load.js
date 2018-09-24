const Discord = require('discord.js');
const express = require('express');
const config = require("./config.json");
const client = new Discord.Client();

const help = require("./help.js");
const minecraft = require("./minecraft.js");
const reverse = require("./reverse.js")

client.login(process.env.TOKEN);