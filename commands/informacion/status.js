const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require('../../config.json')
const Discord = require('discord.js')
const moment = require('moment')
const osu = require('node-os-utils')
const os = require('os')
require('moment-duration-format')
const diagramMaker = require('../../functions/diagramMaker.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('devuelve el estado del bot'),
     async execute(client, interaction, idioma) {
         interaction.reply({ content: 'obteniendo estado...', ephemeral: true})
         const totalGuild = client.guilds.cache.size
         const totalMembers = await client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)

         var mem = osu.mem
         let freeRAM, usedRAM, cpuUsage

         mem.info().then(info => {
             freeRAM = info['freeMemMb']
             usedRAM = info['totalMemMb'] - freeRAM
         })
         const avatar = (client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096}))
         const link = ('https://www.youtube.com/watch?v=9HDAkjLCyAw')
         const cpu = osu.cpu
         const p1 = cpu.usage().then(cpuPercentage => {
             cpuUsage = cpuPercentage
         })

         await Promise.all([p1])
         
         const embed = new Discord.MessageEmbed()
             .setColor(config.defaultSuccesColor)
             .setAuthor(`Estado de ${client.user.username}`, avatar, link)
             .setThumbnail(avatar)
             .addField('Rendimiento', "```" + (`RAM: ${diagramMaker(usedRAM, freeRAM)} [${Math.round((100* usedRAM)/(usedRAM + freeRAM))}%]\nCPU: ${diagramMaker(cpuUsage, 100 - cpuUsage)} [${Math.round(cpuUsage)}%]`) + "```", false)
             .addField('Sistema', "```" + `Procesador\nIntel i3 9100 ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB RAM` + "```", false)
             .addField('Sistema Operativo', "```" + `${os.type} ${os.release} ${os.arch}` + "```", false)
             .addField('Total de Usuarios', "```" + `${totalMembers}` + "```", false)
            //  .addField('Total de Emoticonos', "```" + `${client.emojis.cache.size}` + "```", true)
             .addField('Total de Servidores', "```" + `${totalGuild}` + "```", false) 
             .addField('Tiempo de actividad del bot', "```" + `${moment.duration(client.uptime).format(`D [Días], H [Horas], m [Minutos], s [Segundos]`)}` + "```", true)
             .addField('Tiempo de actividad del host', "```" + `${moment.duration(os.uptime * 1000).format(`D [Días], H [Horas], m [Minutos], s [Segundos]`)}` + "```", true)
             .addField('Ultimo Inicio', "```" + `${moment(client.readyAt).format("DD MMM YYYY HH:mm")}` + "```", true)
             interaction.editReply({ content: ' ', embeds: [embed], ephemeral: true})
     }
}