const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')
const { setInterval } = require('timers')
const fetch = require('node-fetch')
const { create } = require('../../models/guild')
const { channel } = require('diagnostics_channel')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('devuelve el avatar de cierto usuario que elijas')
        .addUserOption(option => option.setName('cuenta').setDescription('usuario objetivo')),
    async execute(client, interaction, idioma) {
        const user = interaction.options.getUser('cuenta')
        if (user) {
            const embed = new MessageEmbed()
            .setColor(config.defaultSuccesColor)
            .setDescription(client.languages.__mf( {phrase: 'avatar.objective', locale: idioma}, { username: user.username }))
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096}))
            return interaction.reply({ embeds: [embed]})
        } else {
            const embed = new MessageEmbed()
            .setColor(config.defaultSuccesColor)
            .setDescription(client.languages.__( {phrase: 'avatar.self', locale: idioma}))
            .setImage(interaction.user.displayAvatarURL({ dynamic: true, size: 4096}))
            return interaction.reply({ embeds: [embed]})
        }
    }
}