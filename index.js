import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
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

const prefix = "!"; 

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  console.log("args: ", args);

  const command = args.shift().toLowerCase();
  console.log("command: ", command);

  if (command === "weather") {
    const city = args.join(" ");
    if (!city) {
      return message.reply("you forgot the city name! 🫤");
    }
    const weatherInfo = await getWeather(city);
    if (weatherInfo) {
      message.channel.send(weatherInfo);
    } else {
      message.channel.send(
        "Oops! Looks like the weather took a break today 🌥️. Can't fetch the forecast right now—try again later ⚠️!"
      );
    }
  }
});

async function getWeather(city) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    const weatherData = `### ${getWeatherMessage(data.main.temp)}
      - 🌡️ Temperature: **${data.main.temp}**°C
      - 🌤️ Weather: **${data.weather[0].description}**
      - 💧 Humidity: **${data.main.humidity}**%
      - 🍃 Wind Speed: **${data.wind.speed}** m/s`;

    return weatherData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getWeatherMessage(temp) {
  if (temp < 0) {
    return "Brrr! It's freezing out there! ❄️ Stay warm and cozy inside!";
  } else if (temp >= 0 && temp < 5) {
    return "Bundle up! It's quite cold outside. 🧥 Maybe grab a hot drink?";
  } else if (temp >= 5 && temp < 15) {
    return "It's a bit chilly, but a jacket should do! 🧣 Keep warm.";
  } else if (temp >= 15 && temp < 20) {
    return "Cool weather today! 🍂 A light jacket should keep you comfy.";
  } else if (temp >= 20 && temp < 25) {
    return "Perfect weather! 🌤️ Enjoy the mild day without worrying about layers.";
  } else if (temp >= 25 && temp < 30) {
    return "It's getting warm out there! ☀️ Stay hydrated and grab some shade.";
  } else if (temp >= 30 && temp < 35) {
    return "It's heating up! 🔥 Time for sunscreen, sunglasses, and plenty of water.";
  } else if (temp >= 35 && temp < 40) {
    return "Scorching hot! 🥵 Stay indoors if you can, and drink lots of water!";
  } else if (temp >= 40) {
    return "It's dangerously hot! 🌡️ Avoid going outside unless absolutely necessary.";
  } else {
    return "Unable to determine the weather!";
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
