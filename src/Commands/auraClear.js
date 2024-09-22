import { ThrowError } from "../Modules/throwError.js";
import { ReplyEmbeds } from "../Modules/embeds.js";
import { Scouter } from "../index.js";
import fs from "fs";
const scores = fs;

export async function auraClear(interaction){
  try{
    if (interaction.user.id !== process.env.OWNER_ID) {
      await interaction.reply({ embeds: [ReplyEmbeds.errorEmbed("You do not have permission to clear the scores", interaction)], ephemeral: true });
    } 
    else {
      scores.writeFile("aura-scores.json", "{}", (err) => {
        if (err) throw err;
        console.log("Aura scores reset successfully.");
    
        interaction.reply({ embeds: [ReplyEmbeds.successEmbed("The auras have been reset", interaction)] });
      });
    }
  } catch (error){
    ThrowError({string:"Error clearing auras:", err: error, client: Scouter});
  }
}