import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = "!"; // Command prefix

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  console.log("args: ", args);

  const command = args.shift().toLowerCase();
  console.log("command: ", command);

  if (command === "weather") {
    const city = args.join(" ");
    if (!city) {
      return message.reply("Please provide a city name!");
    }
    const weatherInfo = await getWeather(city);
    if (weatherInfo) {
      message.channel.send(weatherInfo);
    } else {
      message.channel.send("Could not retrieve weather data.");
    }
  }
});

async function getWeather(city) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    const weatherData = `Weather in **${data.name}**: 
      - **Temperature**: ${data.main.temp}°C
      - **Weather**: ${data.weather[0].description}
      - **Humidity**: ${data.main.humidity}%
      - **Wind Speed**: ${data.wind.speed} m/s`;

    return weatherData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// message
// client.on("messageCreate", (message) => {
//   if (message.author.bot) {
//     return;
//   }
//   message.reply({
//     content: "Weather is too cold!",
//   });
// });

// command reply
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.DISCORD_TOKEN);
