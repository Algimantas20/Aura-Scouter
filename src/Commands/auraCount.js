import { createProgressBar } from "../Modules/progressBar.js";
import { AttachmentBuilder } from "discord.js";
import { Scouter } from "../index.js";
import fs from "fs/promises";
import { ThrowError } from "../Modules/throwError.js";
import { ReplyEmbeds } from "../Modules/embeds.js";

export async function auraCount(interaction) {
    try {
        await interaction.deferReply();  

        const userOption = interaction.options.get("username");
        if (!userOption) {
            console.error('Username option is missing.');
            await interaction.editReply({embeds: [ReplyEmbeds.errorEmbed("Username option is missing.", interaction)] });
            return;
        }
        const user = userOption.user;
        const userId = user.id;
        const auraChange = interaction.options.get("number").value;

        let data;
        try {
            data = await fs.readFile("aura-scores.json", "utf-8");
        } catch (err) {
            console.error("Error reading file:", err);
            await interaction.editReply({embeds: [ReplyEmbeds.errorEmbed("Error reading aura scores file.", interaction)] });
            throw err;
        }

        const auraData = JSON.parse(data) || {};
        let auraCount = auraData[userId] || 0;
        auraCount += auraChange;
        auraData[userId] = auraCount;

        const level = Math.floor(auraCount / 100);
        const currentAura = auraCount % 100;
        const maxAura = 100 * Math.max(level, 1);

        const progressBarBuffer = await createProgressBar(currentAura, maxAura, user, level);
        if (!progressBarBuffer) {
            console.error('Failed to generate progress bar.');
            await interaction.editReply({embeds: [ReplyEmbeds.errorEmbed("Failed to generate progress bar.", interaction)] });
            return;
        }

        const attachment = new AttachmentBuilder(progressBarBuffer, { name: "progress-bar.png" });

        try {
            await fs.writeFile("aura-scores.json", JSON.stringify(auraData, null, 2));
            console.log("✅ Aura count updated successfully");
        } catch (err) {
            console.error("Error writing file:", err);
            await interaction.editReply({embeds: [ReplyEmbeds.errorEmbed("Error writing updated aura scores.", interaction)] });
            throw err;
        }
        
        await interaction.editReply({
            content: '',
            files: [attachment],
        }).catch(err => console.error('Failed to send reply:', err));

    } catch (err) {
        console.error('Error managing aura:', err);
        ThrowError({ string: "Error managing aura", error: err, client: Scouter });
    }
}
