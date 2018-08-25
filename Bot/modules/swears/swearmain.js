const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const config = require("./config.json")

//Require Modules
const antiswear = require("./antiswear.js");
const classes = require("./classes.js");

//Prepare modules
var modules = {
    [antiswear.id] : {"status":function() { return antiswear.status() }, "toggle":function() { antiswear.toggle(); console.log("Toggle called") } },
    [classes.id] : {"status":function() { return classes.status() }, "toggle":function() { classes.toggle(); console.log("Toggle called") } },
}

{
//Initialize Modules
antiswear.initialize();
classes.initialize();
}

client.login(process.env.TOKEN);