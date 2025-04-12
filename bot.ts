import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const TOKEN = process.env.BOT_TOKEN!;
const REPORT_INTERVAL_MS = 60 * 60 * 1000;

async function getPublicIP(): Promise<string> {
  const response = await axios.get("https://api.ipify.org");
  return response.data;
}

async function reportIP() {
  try {
    const ip = await getPublicIP();
    console.log(`Reporting IP: ${ip}`);
    const channel = await client.channels.fetch(process.env.CHANNEL_ID!);
    if (channel && channel instanceof TextChannel) {
      await channel.send(`📡 Server Public IP: \`${ip}\``);
    } else {
      console.error("Invalid channel ID or channel is not text-based.");
    }
    await axios.post("https://your-server.com/report-ip", { ip });
  } catch (err) {
    console.error("Failed to report IP:", err);
  }
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
  reportIP(); // run once on startup
  setInterval(reportIP, REPORT_INTERVAL_MS); // repeat every hour
});

client.login(TOKEN);
