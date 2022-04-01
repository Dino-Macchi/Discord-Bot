const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')
const guildModel = require('../../models/guild.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('idioma')
        .setDescription('Cambia el idioma del servidor')
        .addStringOption(option => 
            option.setName('lang')
            .setDescription('Idioma del servidor')
            .setRequired(true)
            .addChoice('Español', 'es')
            .addChoice('English', 'en')
            ),
    async execute(client, interaction) {
        const idioma = interaction.options._hoistedOptions[0].value
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply ({ content: client.languages.__({phrase: 'lang.noAdministrator', locale: idioma}), ephemeral: true})
        await guildModel.findOne({ guildId: interaction.guildId.toString()}).then((s, err) => {
            if (err) return console.log(err)
            if (s) {
                s.lang = idioma
                s.save().catch(e => console.log(e))
            } else {
                const newGuild = new guildModel({
                    guildId: interaction.guildId.toString(),
                    lang: idioma
                })
                newGuild.save().catch(e => console.log(e))
            }
        })
        return interaction.reply({ content: client.languages.__({phrase: 'lang.newLanguage', locale: idioma}), ephemeral: true})
    }
}