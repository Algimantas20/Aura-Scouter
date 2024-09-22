import { GatewayIntentBits, Client, EmbedBuilder, } from "discord.js";
import { auraReveal } from "./Commands/auraReveal.js";
import { auraCount } from "./Commands/auraCount.js";
import { auraClear } from "./Commands/auraClear.js";
import { BotLogOut } from "./Modules/throwError.js";
import dotenv from 'dotenv';
import { ReplyEmbeds } from "./Modules/embeds.js";

dotenv.config();

export const Scouter = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

Scouter.login(process.env.TOKEN);

Scouter.on("ready", () => {
  console.log(`✅ Ready`);
});


Scouter.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

    switch (interaction.commandName) {
      case("aura-count"):
        await auraCount(interaction);
        break;
      case("aura-reveal"):
        auraReveal(interaction);
        break;
      case("aura-clear"):
        auraClear(interaction);
        break;
      case("shutdown"):
        await shutdown(interaction)
        break;
    }
});

async function shutdown(interaction) {
  if (interaction.user.id !== process.env.OWNER_ID) {
    await interaction.reply({ embeds: [ReplyEmbeds.errorEmbed("You do not have permission to shut down the bot.", interaction)], ephemeral: true });
  } else {
    await interaction.reply({ embeds: [ReplyEmbeds.successEmbed("Bot is shutting down.", interaction)] });
    await BotLogOut(Scouter);
  }
}
