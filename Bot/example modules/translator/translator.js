const Discord = require('discord.js');
const client = new Discord.Client();

client.login("ready", () => {
  console.log('Translator ready')
})

const tlcfg = require("./config.json")
const config = require("./config.json")
const fs = require("fs")
const Eris = require("eris")
const OS = require("os")
const translate = require("google-translate-api")
const lang = require("./langs.json")
const bot = new Eris((process.env.TOKEN), { maxShard: "auto", getAllUsers: true })
const prefixt = ('-t')
const G = require("gizoogle")
const zalgo = require("to-zalgo")
const flip = require("flipout")
const kpop = require("kpop")
const japanese = require("japanese")
const devs = tlcfg.owner
const ostb = require("os-toolbox");
const langs = require("./langmap.json")
let guildSize = null, shardSize = null, botInit = new Date();
bot.on("ready", () => {
  let readyTime = new Date(), startTime = Math.floor( (readyTime - botInit) / 1000), userCount = bot.users.size
  console.log(`Bot ONLINE. ${bot.guilds.size} guilds, serving ${userCount} users.`)
  console.log(`Took ${startTime} seconds to start.`)
  console.log(`Owners: ${devs}`)
  tlcfg.tsChannelsEnabled ? console.log("ts-channels are enabled") : console.log("ts-channels are disabled")
  guildSize = bot.guilds.size
  shardSize = bot.shards.size
  let playStatus = tlcfg.playingStatus
  bot.editStatus("online", {
    name: playStatus,
    type: 0
  })
})
bot.on("messageCreate", async msg => {
  if(msg.author.bot) return
  const tsChannelsEnabled = tlcfg.tsChannelsEnabled
  const args = msg.content.slice(prefixt.length).trim().split(/ +/g);
  const command = args.shift().toString().toLowerCase();
  if(tsChannelsEnabled) tsChannels()
  if(msg.content.toLowerCase().indexOf(prefixt) !== 0) return;
  if(command.toLowerCase() === "help") return helpenglish()
  if(command.toLowerCase() === "disabledeval") return evalcmd()
  if(command.toLowerCase() === "connectivecheck") return shards()
  if(command.toLowerCase() === "invite") return invite()
  if(command.toLowerCase() === "mscheck") return ping()
  if(command.toLowerCase() === "statsadmin") return stats()
  if(command.toLowerCase() === "guilds") return guilds()
  if(command.toLowerCase() === "exec") return exec()
  if(command.toLowerCase() === "patreonades") return patreon()
  if(command.toLowerCase() === "ayuda") return helpspanish()
  if(command.toLowerCase() === "aider") return helpfrench()
  if(command.toLowerCase() === "hulp") return helpdutch()
  if(msg.content.toLowerCase().indexOf(prefixt + " ") == 0) { 
    let langs = require("./langmap.json")
    let LangMap = new Map()
    let thingToTranslate = args.join(" ");
    if (command === "lang") return languageDetection(thingToTranslate)
    for (let l in langs) {
      for (let a in langs[l].alias) {
        LangMap.set(langs[l].alias[a], (args) => {
          return translateFunction(l, args.join(" "), `:flag_${langs[l].flag}:`)
        })
      }
    }
    let toT = LangMap.get(command)
    if (toT) {
      return toT(args)
    }
    switch(command) {
      case "romanized-korean": return funTranslation(kpop.romanize(thingToTranslate), ":flag_kr:");
      case "hangulified-korean": return funTranslation(kpop.hangulify(thingToTranslate), ":flag_kr:");
      case "romanized-japanese": return funTranslation(japanese.romanize(thingToTranslate), ":flag_jp:");
      case "katakanized-japanese": return funTranslation(japanese.katakanize(thingToTranslate), ":flag_jp:");
      case "hiraganized-japanese": return funTranslation(japanese.hiraganize(thingToTranslate), ":flag_jp:");
      case "flip": case "flipped": return funTranslation(flip(thingToTranslate), ":upside_down:");
      case "zalgo": return funTranslation(zalgo(thingToTranslate), ":upside_down:");
      case "gang": case "gangsta": G.string(thingToTranslate, (err, result)=>{ if(err){ return msg.channel.createMessage("Oops, there was an error!\nDid you forget to enter something to translate?") } return funTranslation(result, ":gun:") }); break;
    }
    function translateFunction(lang, string, flag){
      if(string == "" || string == null || string == undefined) return msg.channel.createMessage("Nothing to translate!");
      translate(string, { to: lang }).then((res)=>{
        if (res.text.length > 200) {
          return msg.channel.createMessage(`${flag}\n${res.text}`);
        }
        msg.channel.createMessage({ embed: {
          color: 0xFFFFFF, description: `${flag} ${res.text}`
        }});
      }).catch(err => { console.error(err) });
    }
    function funTranslation(text, emoji){
      if(text == "" || text == null || text == undefined || text.includes("<!DOCTYPE")) return msg.channel.createMessage("Translation failed.");
      if (text.length > 200) { return msg.channel.createMessage(text); }
      msg.channel.createMessage({ embed: {
        color: 0xFFFFFF,
        description: emoji+" "+text
      }});
    }
    function languageDetection(string) {
      if(string == "" || string == null || string == undefined) return msg.channel.createMessage("Nothing to analyze!");
      translate(string).then((res)=>{
        return msg.channel.createMessage({embed: {color:0xFFFFFF, fields: [{ name: "Detected Language", value: lang[res.from.language.iso] }] } })
      }).catch(err => { console.error(err) });
    }
  }
  async function tsChannels() {
    if(!msg.channel.topic) return
    if(!msg.channel.topic.toLowerCase().startsWith("ts-")) return
    let tsChannels = []
    msg.channel.guild.channels.map(c => {
      if(c.topic) {
        if(c.topic.toLowerCase().startsWith("ts-")) tsChannels.push({topic: c.topic, id: c.id})
      }
    })
    for(i = 0; i < tsChannels.length; i++) {
      let channelLangReg = /(?<=ts\-)\S+/i;
      let channelLang = channelLangReg.exec(tsChannels[i].topic.toLowerCase());
      channelLang = channelLang[channelLang.length - 1]
      for (let l in langs) {
        for (let a in langs[l].alias) {
          if(langs[l].alias[a] === channelLang) {
            tsChannelTranslate(l, msg.content, `:flag_${langs[l].flag}:`, msg.channel.id, tsChannels[i].id)
          }
        }
      }
    }
    function tsChannelTranslate(lang, string, flag, sourceChannel, targetChannel) {
      if(string == "" || string == null || string == undefined) return;
      if(targetChannel !== sourceChannel) {
        translate(string, { to: lang }).then(res => {
          if (res.text.length > 200) {
            bot.createMessage(targetChannel, `**${msg.author.username}#${msg.author.discriminator}**: ${res.text}`);
          } else {
            bot.createMessage(targetChannel, { embed: {
              color: 0xFFFFFF, description: `${flag} ${res.text}`, author: {name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL ? msg.author.avatarURL : msg.author.defaultAvatarURL}
            }});
          }
        }).catch(err => console.error(err) );
      }
    }
  }

  /*

  Command Functions

  */
  async function evalcmd() {
    let result
    let input = args.join(" ")
    if (!devs.includes(msg.author.id)) return
    try {
      result = eval(`((m, a) => { ${(args[0] === "return") ? input : "return " + input} })(msg, args)`)
      if (typeof result !== "string") {
        result = inspect(result)
      }
    } catch (err) {
      result = err.message;
    }
    return await msg.channel.createMessage({embed:{
      color: 0x7188d9,
      fields: [
        {
          name: "ðŸ“¥ Input",
          value: "```JS\n" + input + "\n```"
        },
        {
          name: "ðŸ“¤ Result",
          value: "```JS\n" + result.substr(0, 1000) + "\n```"
        }
      ]
    }})
  }

  async function invite() {
    msg.channel.createMessage(`https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=2146958591`)
  }

  async function ping() {
    let botPing = Math.floor(msg.channel.guild.shard.latency);
    msg.channel.createMessage({embed: {
      color:0xFFFFFF, description: `:satellite_orbital: ${botPing}ms`
    }})
  }

  async function stats() {
    await msg.channel.createMessage("Getting Stats...")
    .then(message => {
      let servers = bot.guilds.size,
          mintime = ostb.uptime() / 60,
          uptime = Math.floor(mintime / 60),
          serversLarge = bot.guilds.filter(m => m.large).size,
          botPing = Math.floor(msg.channel.guild.shard.latency),
          regionInfo;
      regionsUsed().then(r => {
        regionInfo = r;
      })
      ostb.cpuLoad().then(cpuusage=>{ ostb.memoryUsage().then(memusage=>{ ostb.currentProcesses().then(processes=>{
        const curpro = processes;
        const meuse = memusage;
        const acusage = cpuusage;
        message.delete()
        msg.channel.createMessage({ embed: {
          color: 0x36393E,
          author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL },
          title: "Statistics",
          footer: { text: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
          fields: [
            { name: "Server Memory Usage", value: `${meuse}%` },
            { name: "Nodejs Memory Usage", value: `${processMemoryMB().toString()} MB` },
            { name: "Nodejs Version", value: process.version },
            { name: "Shard Count", value: bot.shards.size },
            { name: "Guild Count", value: bot.guilds.size },
            { name: "Member Count", value: bot.users.size },
            { name: "Guild Region Information", value: regionInfo},
            { name: "Client Uptime", value: `${Math.floor(((bot.uptime / (1000*60*60)) % 24))} hours` },
            { name: "Server Uptime", value: `${JSON.stringify(uptime)} hours` }
          ]
        }});
      });});});});
    async function regionsUsed() {
      let usa = [];
      let europe = [];
      let russia = [];
      let china = [];
      let brazil = [];
      let japan = [];
      let au = [];
      let sig = [];
      let gC = bot.guilds.size;
      await bot.guilds.map(g => {
        if(g.region === "us-central" || g.region === "us-west" || g.region === "us-south" || g.region === "us-east") {
          usa.push(g.id);
        } else if(g.region === "eu-central" || g.region === "eu-west") {
          europe.push(g.id);
        } else if(g.region === "russia") {
          russia.push(g.id);
        } else if(g.region === "hongkong") {
          china.push(g.id);
        } else if(g.region === "brazil") {
          brazil.push(g.id);
        } else if(g.region === "japan") {
          japan.push(g.id);
        } else if(g.region === "sydney") {
          au.push(g.id);
        } else if(g.region === "signapore") {
          sig.push(g.id)
        }
      })
      usa.length >= 1 ? usa = usa.length : usa = 0;
      europe.length >= 1 ? europe = europe.length : europe = 0;
      russia.length >= 1 ? russia = russia.length : russia = 0;
      china.length >= 1 ? china = china.length : china = 0;
      brazil.length >= 1 ? brazil = brazil.length : brazil = 0;
      japan.length >= 1 ? japan = japan.length : japan = 0;
      au.length >= 1 ? au = au.length : au = 0;
      sig.length >= 1 ? sig = sig.length : sig = 0;
      function prec(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
      }
      let percentages = `\`${prec((usa / gC) * 100, 2)}%\` of servers are **American**\n\`${prec(((europe + russia) / gC) * 100, 2)}%\` of servers are **European** (\`${prec((russia / gC) * 100, 2)}%\` => **Russia**)\n\`${prec(((china + japan + sig) / gC) * 100, 2)}%\` of servers are **Asian** (\`${prec((china / gC) * 100, 2)}%\` => **China**, \`${prec((japan / gC) * 100, 2)}%\` => **Japan**, \`${prec((sig / gC) * 100, 2)}%\` => **Signapore**)\n\`${prec((brazil / gC) * 100, 2)}%\` of servers are **South American**\n\`${prec((au / gC) * 100, 2)}%\` of servers are **Australian**`
      let regInfo = `**:flag_us: America**: \`${usa}\`\n**:flag_eu: Europe**: \`${europe + russia}\` (**Russia**: \`${russia}\`)\n**:flag_cn: Asia**: \`${china + japan + sig}\` (**China**: \`${china}\`, **Japan**: \`${japan}\`, **Signapore**: \`${sig}\`)\n**:flag_br: South America**: \`${brazil}\`\n**:flag_au: Australia**: \`${au}\`\n**----- Percentages -----**\n${percentages}`
      return regInfo;
    }
    function processMemoryMB() {
      let heap = process.memoryUsage().heapUsed
      let MB = heap / 1048576;
      return Math.floor(MB)
    }
  }

  async function helpenglish() {
    return await msg.channel.createMessage({embed: {
      color: 0x7188d9,
      author: {
        name: "Learning How To Use Your Translator",
        icon_url: msg.author.avatarURL
      },
      fields: [
        {
          name: "Translating your messages",
          value: "Type `-t (language) (text to be translated)`"
        },
        {
          name: "Finding out what language people are speaking in",
          value: "Type `-t lang (text to analyze)`\ "
        },
        {
          name: "Translating Messages Automatically",
          value: "To set up a channel to allow automatic translations between two languages, simply make a channel with a topic saying `[LANGUAGE]` and another channel with a topic saying `[OTHER LANGUAGE]`"
        },
        {
          name: "Other commands available",
          value: "[invite] Sends an invite link in the chat."
        },
        {
          name: "More Information",
          value: "Created By `Josia50`"

        }
      ]
    }})
  }
    async function helpfrench() {
    return await msg.channel.createMessage({embed: {
      color: 0x7188d9,
      author: {
        name: "Apprendre à utiliser votre traducteur",
        icon_url: msg.author.avatarURL
      },
      fields: [
        {
          name: "Traduire vos messages",
          value: "Tapez `-t (langue) (texte à traduire)`"
        },
        {
          name: "Découvrir quelle langue parlent les gens",
          value: "Tapez `-t lang (texte à analyser)` \ "
        },
        {
          name: "Traduction automatique des messages",
          value: "Pour configurer une chaîne pour permettre des traductions automatiques entre deux langues, créez simplement une chaîne avec un sujet indiquant `[LANGUAGE]` et un autre canal avec un sujet indiquant `[OTHER LANGUAGE]`"
        },
        {
          name: "Autres commandes disponibles",
          value: "[invite] Envoie un lien d'invitation dans le chat."
        },
        {
          name: "Plus d'information",
          value: "Créé par `Josia50`"

        }
      ]
    }})
  }
  
  async function helpdutch() {
    return await msg.channel.createMessage({embed: {
      color: 0x7188d9,
      author: {
        name: "Leer hoe je de vertaler moet gebruiken",
        icon_url: msg.author.avatarURL
      },
      fields: [
        {
          name: "Vertaal je berichten",
          value: "Typ `-t (Taal) (tekst om te vertalen)`"
        },
        {
          name: "Zoek uit welke taal het is.",
          value: "Typ `-t lang (text om te analyseren)`\ "
        },
        {
          name: "Berichting automatisch vertalen",
          value: "Om een kanaal te maken voor automatisch vertalen, Maak een kanaal met Titel `[Taal]` met een ander kanaal met beschrijving `[Andere Taal]`"
        },
        {
          name: "Andere commando's",
          value: "[invite] Stuurt een invitatie link in de chat."
        },
        {
          name: "Meer informatie",
          value: "Gemaakt door `Josia50`"

        }
      ]
    }})
  }
        
  async function helpspanish() {
    return await msg.channel.createMessage({embed: {
      color: 0x7188d9,
      author: {
        name: "Learning How To Use Your Translator",
        icon_url: msg.author.avatarURL
      },
      fields: [
        {
                 name: "Traduciendo tus mensajes",
          value: "Escriba `-t (idioma) (texto a traducir)`"
        },
        {
          name: "Averiguar en qué idioma está hablando la gente",
          value: "Escriba: `-t lang (texto para analizar)`\ "
        },
        {
          name: "Traducir mensajes automáticamente",
          value: "Para configurar un canal para permitir traducciones automáticas entre dos idiomas, simplemente haga un canal con un tema que diga `[IDIOMA]` y otro canal con un tema que diga `[OTRO IDIOMA] `"
        },
        {
          name: "Otros comandos disponibles",
          value: "`[invite]` Envía un enlace de invitación en el chat."
        },
        {
          name: "Más información",
          value: "Creado por`Josia50`"
        }
      ]
    }})
  }
   
  async function shards() {
    return await msg.channel.createMessage("Getting Shards...")
    .then(async message => {
      let shards = ""
      bot.shards.map((s) => {
        if (msg.channel.guild.shard === s) shards += `= [ID]: ${((s.id.length === 1) ? s.id + " " : s.id)} | CURRENT SHARD | =\n`
        else shards += `= [ID]: ${((s.id.length === 1) ? s.id + " " : s.id)} | [Ping]: ${((s.latency.length === 2) ? s.latency + " " : s.latency)}ms | [Status]: ${s.status} =\n`
      }).join("\n");
      let s = msg.channel.guild.shard;
      return await message.edit(`\`\`\`asciidoc\n[Current Shard]\n= [ID]: ${((s.id.length === 1) ? s.id + " " : s.id)} | [Ping]: ${((s.latency.length === 2) ? s.latency + " " : s.latency)}ms | [Status]: ${s.status} =\n\n[Other Shards]\n${shards}\n\`\`\``);
    })
  }

  async function guilds() {
    if (!devs.includes(msg.author.id)) return
    let translateGuilds = bot.guilds.map(g => `"${g.name}": {
        "MEMBER COUNT": "${g.memberCount}",
        "GUILD ID": "${g.id}",
        "OWNER ID": "${g.ownerID}",
        "LARGE GUILD": "${g.large}",
        "HAS ADMIN": "${g.members.get(bot.user.id).permission.allow === 2146958591}",
        "REGION": "${g.region}"
    },`).join("\n")
    return await fs.writeFile(`${msg.id}_${bot.uptime}GUILDINFO.json`, JSON.stringify(translateGuilds), async (err) => {
      if (err){
        console.log(err)
        return await msg.channel.createMessage("Error while processing guild information.")
      } else {
        return await msg.channel.createMessage(`Guild Info file made! Reporting info on ${bot.guilds.size} guilds!`)
        .then(async () => {
          let fileContent = `{\n${translateGuilds}\n}`.replace("\\", "/")
          return await msg.channel.createMessage("", {name: "GuildInfo.json", file: fileContent})
        })
      }
    })
  }

  async function exec() {
    if (!devs.includes(msg.author.id)) return
    if (!args.join(" ")) return await msg.channel.createMessage("No arguments were given")
    return await msg.channel.createMessage(`\`INPUT\`\n\`\`\`ini\n${args.join(" ")}\n\`\`\``)
    .then(async () => {
      return await shell.exec(args.join(" "), async (code, stdout, stderr) => {
        return await msg.channel.createMessage(`\`OUTPUT\`\n\`\`\`ini\n${stdout}\n\`\`\``)
      })
    })
  }

  async function patreon() {
    msg.channel.createMessage("We don't have patreon. Please contact Josia50 when you want to donate.")
  }
  
})

bot.connect();

client.login(process.env.TOKEN);
