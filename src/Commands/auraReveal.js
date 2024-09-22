import { ThrowError } from "../Modules/throwError.js";
import { EmbedBuilder } from "discord.js";
import { Scouter } from "../index.js";
import fs from "fs";
const scores = fs;

export function auraReveal(interaction){
  try {
    scores.readFile("aura-scores.json", (err, data) => {
        if (err) throw err;

        const auraData = JSON.parse(data) || {};
        const fields = [];

        for (const [userId, auraCount] of Object.entries(auraData)) {
          const user = Scouter.users.cache.get(userId);
          if (user) {
            fields.push({
              name: user.tag,
              value: `Aura count: ${auraCount}`,
              inline: true,
            });
          }
        }

        const auraEmbed = new EmbedBuilder()
          .setTitle("Aura Reveal")
          .setDescription("Aura counts for users:")
          .setColor("#DC143C")
          .addFields(fields);

        interaction.reply({ embeds: [auraEmbed] });
    });
  } catch(err) {
    ThrowError({string:"Error showing aura counts:", error: err, client: Scouter})
  }
}