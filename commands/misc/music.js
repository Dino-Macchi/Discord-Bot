const { SlashCommandBuilder } = require('@discordjs/builders')
var sodium = require('sodium').api;
const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('musica')
        .setDescription('pone musica')
        .addStringOption(option => option.setName('song').setDescription('canción')),
    async execute(client, interaction, idioma) {
        await interaction.reply({ content: client.languages.__({ phrase: 'music.play', locale: idioma}), ephemeral: true})
        const song = interaction.options.getString('song')
        console.log(song)
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.member.guild.id,
            adapterCreator: interaction.member.guild.voiceAdapterCreator,
        });
        
        const stream = ytdl(song, { filter: 'audioonly' });
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        const player = createAudioPlayer();
        
        player.play(resource);
        connection.subscribe(player);
        
        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
    }
}