import { EmbedBuilder } from "discord.js"

export class ReplyEmbeds {
    static successEmbed(string, interaction){
        return(
            new EmbedBuilder().setColor("#DC143C")
            .setAuthor({ name: `${interaction.user.tag} has:`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`✅  ${string}`)
        )
    }

    static errorEmbed(string, interaction){
        return new EmbedBuilder().setColor("#DC143C")
        .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`❌ ${string}`)
    }
}
