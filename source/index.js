require("dotenv").config();
const scores = require("fs");
const { createCanvas } = require("canvas");

const {
  GatewayIntentBits,
  EmbedBuilder,
  AttachmentBuilder,
  Client,
} = require("discord.js");

const Scouter = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

Scouter.login(process.env.TOKEN);

Scouter.on("ready", () => {
  console.log(`Ready`);
});

async function createProgressBar(currentAura, maxAura) {
  const width = 400;
  const height = 100;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#2F3136";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#23272A";
  ctx.fillRect(20, 40, 360, 20);

  const progress = (currentAura / maxAura) * 360;
  ctx.fillStyle = "#ED4245";
  ctx.fillRect(20, 40, progress, 20);

  return canvas.toBuffer();
}

Scouter.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    if (interaction.commandName === "aura-count") {
      const user = interaction.options.get("username").user;
      const userId = user.id;
      const auraChange = interaction.options.get("number").value;

      scores.readFile("aura-scores.json", async (err, data) => {
        if (err) throw err;

        let auraData = JSON.parse(data) || {};

        let auraCount = auraData[userId] || 0;
        auraCount += auraChange;
        auraData[userId] = auraCount;

        const level = Math.floor(auraCount / 100);
        const currentAura = auraCount % 100;
        let maxAura;
        if (level == 0) {
          maxAura = 100;
        } else {
          maxAura = 100 * level;
        }

        const progressBarBuffer = await createProgressBar(currentAura, maxAura);
        const attachment = new AttachmentBuilder(progressBarBuffer, {
          name: "progress-bar.png",
        });

        scores.writeFile(
          "aura-scores.json",
          JSON.stringify(auraData, null, 2),
          async (err) => {
            if (err) throw err;

            console.log("Aura count updated successfully");

            const auraEmbed = new EmbedBuilder()
              .setColor("#ED4245")
              .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(`${user}'s aura was updated by ${auraChange}`)
              .addFields(
                { name: "Level", value: `${level}`, inline: true },
                {
                  name: "Aura",
                  value: `${currentAura} / ${maxAura}`,
                  inline: true,
                }
              )
              .setImage("attachment://progress-bar.png")
              .setTimestamp();

            await interaction.reply({
              embeds: [auraEmbed],
              files: [attachment],
            });
          }
        );
      });
    } else if (interaction.commandName === "aura-reveal") {
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
          .setColor("#ED4245")
          .addFields(fields);

        interaction.reply({ embeds: [auraEmbed] });
      });
    } else if (interaction.commandName === "aura-clear") {
      scores.writeFile("aura-scores.json", "{}", (err) => {
        if (err) throw err;
        console.log("Aura scores reset successfully.");

        const auraEmbed = new EmbedBuilder()
          .setColor("#ED4245")
          .setDescription("Everything Nulled");
        interaction.reply({ embeds: [auraEmbed] });
      });
    }
  } catch (error) {
    console.error("Error processing interaction:", error);
    await interaction.reply({
      content: "An error occurred while processing your command.",
      ephemeral: true,
    });
  }
});
