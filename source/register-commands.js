require("dotenv").config();
const { ApplicationCommandOptionType, REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const commands = [
  {
    name: "aura-count",
    description: "Add or remove aura to a user",
    options: [
      {
        name: "number",
        description: "How much do you want to add or remove",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "username",
        description: "The username of the person you want to mute",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  {
    name: "aura-reveal",
    description: "Shows everyones aura",
  },
  {
    name: "aura-clear",
    description: "Clears everyones aura to zero",
  },
];

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID,
      ),
      { body: commands }
    );

    console.log("Slash commands were registered successfully!");
  } catch (error) {
    console.error(`There was an error: ${error.message}`);
  }
})();
