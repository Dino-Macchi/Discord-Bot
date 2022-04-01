const {
    SlashCommandBuilder,
    time
} = require('@discordjs/builders')
const {
    MessageEmbed,
    VoiceChannel
} = require('discord.js')
const config = require('../../config.json')
const fetch = require('node-fetch')
const {
    create
} = require('../../models/guild')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('pone youtube')
        .addBooleanOption(option => option.setName('ilimitado').setDescription('Activar para que la invitación no expire.')),
    async execute(client, interaction, idioma) {
        await interaction.reply({
            content: client.languages.__({
                phrase: 'youtube.loading',
                locale: idioma
            }),
            ephemeral: true
        })
        if (!interaction.member.voice.channel) return interaction.editReply({
            content: client.languages.__({
                phrase: 'youtube.noChannel',
                locale: idioma
            }),
            ephemeral: true
        })
        if (interaction.options._hoistedOptions[0]?.value) {
            // crear la invitación
            createTogetherCode(client, interaction.member.voice.channel.id, '755600276941176913', 0).then(invite => {
                const embed = new MessageEmbed()
                .setColor(config.defaultSuccesColor)
                .setDescription(`**[Haz click aquí](${invite.code} 'Enlace de Youtube')**`)
                return interaction.editReply({ content: ' ', embeds: [embed]})
            }).catch(e => {
                if (e == "Ha ocurrido un error al obtener los datos.") {
                    const errorembed = new MessageEmbed()
                        .setColor(config.defaultErrorColor)
                        .setTitle(client.languages.__({
                            phrase: "utilities.errorEmbed",
                            locale: idioma
                        }))
                        .setDescription(client.languages.__({
                            phrase: 'utilities.unexpectedError',
                            locale: idioma
                        }))
                        .setFooter(interaction.member.user.username, interaction.member.user.avatarURL())
                    return interaction.editReply({
                        content: ' ',
                        embeds: [errorembed]
                    })
                } else if (e == "El bot no tiene los permisos necesarios.") {
                    const errorembed = new MessageEmbed()
                        .setColor(config.defaultErrorColor)
                        .setTitle(client.languages.__({
                            phrase: "utilities.noInvitePerms",
                            locale: idioma
                        }))
                        .setDescription(client.languages.__({
                            phrase: 'utilities.unexpectedError',
                            locale: idioma
                        }))
                        .setFooter(interaction.member.user.username, interaction.member.user.avatarURL())
                    return interaction.editReply({
                        content: ' ',
                        embeds: [errorembed]
                    })
                }
            })
        } else {
            createTogetherCode(client, interaction.member.voice.channel.id, '755600276941176913', 900).then(invite => {
                const embed = new MessageEmbed()
                .setColor(config.defaultSuccesColor)
                .setDescription(`**[Haz click aquí](${invite.code} 'Enlace de Youtube')**`)
                return interaction.editReply({ content: ' ', embeds: [embed]})
            }).catch(e => {
                if (e == "Ha ocurrido un error al obtener los datos.") {
                    const errorembed = new MessageEmbed()
                        .setColor(config.defaultErrorColor)
                        .setTitle(client.languages.__({
                            phrase: "utilities.errorEmbed",
                            locale: idioma
                        }))
                        .setDescription(client.languages.__({
                            phrase: 'utilities.unexpectedError',
                            locale: idioma
                        }))
                        .setFooter(interaction.member.user.username, interaction.member.user.avatarURL())
                    return interaction.editReply({
                        content: ' ',
                        embeds: [errorembed]
                    })
                } else if (e == "Tu bot no tiene los permisos necesarios.") {
                    const errorembed = new MessageEmbed()
                        .setColor(config.defaultErrorColor)
                        .setTitle(client.languages.__({
                            phrase: "utilities.noInvitePerms",
                            locale: idioma
                        }))
                        .setDescription(client.languages.__({
                            phrase: 'utilities.unexpectedError',
                            locale: idioma
                        }))
                        .setFooter(interaction.member.user.username, interaction.member.user.avatarURL())
                    return interaction.editReply({
                        content: ' ',
                        embeds: [errorembed]
                    })
                }
            })
        }
    }
}

async function createTogetherCode(client, voiceChannelId, applicationID, time) {
    let returnData = {}
    return new Promise((resolve, reject) => {

        fetch(`https://discord.com/api/v8/channels/${voiceChannelId}/invites`, {
                method: 'POST',
                body: JSON.stringify({
                    max_age: time,
                    max_uses: 0,
                    target_application_id: applicationID,
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    'Authorization': `Bot ${client.token}`,
                    'Content-Type': 'aplication/json'
                }
            }).then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) reject("Ha ocurrido un error al obtener los datos.")
                if (invite.code === 50013 || invite.code === '50013') reject("Tu bot no tiene los permisos necesarios.")
                returnData.code = `https://discord.com/invite/${invite.code}`
                resolve(returnData)
            }).catch(e => {
                console.log(e)
            })
    })
}