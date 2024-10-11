import { Options, REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = "1294041467534311464";
const GUILD_ID = "469189848935432213";

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "forecast",
    description: "Get a 3-day weather forecast for a specific city.",
    options: [
      {
        name: "city",
        type: 3,
        description: "Enter the city name",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
