import { Client, Message } from 'discord.js';

export function registerMessageResponder(client: Client) {
  client.on('messageCreate', handleMessage);
}

const QUI_VARIANTS = ['quette', 'quette 😹', 'quette ^^'];

const QUOI_VARIANTS = ['feur', 'feur 😹', 'feur ^^'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function handleMessage(message: Message) {
  if (message.author.bot) return;

  const text = message.content.toLowerCase();

  if (/\bquoi\b/.test(text)) {
    await message.reply(pickRandom(QUOI_VARIANTS));
    return;
  }

  if (/\bqui\b/.test(text)) {
    await message.reply(pickRandom(QUI_VARIANTS));
  }
}
