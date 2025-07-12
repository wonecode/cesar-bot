import { Client, Message } from 'discord.js';

export function registerMessageResponder(client: Client) {
  client.on('messageCreate', handleMessage);
}

const QUI_VARIANTS = ['quette', 'quette 😹', 'quette ^^'];
const QUOI_VARIANTS = ['feur', 'feur 😹', 'feur ^^'];

const BODYCOUNT_MESSAGES = {
  zero: [
    '<@{id}> **{n}**… on commence quand ? 😹',
    `<@{id}> **{n}**… Puceau moi ? Sérieusement ? Hahahahahah… on me l’avait pas sortie celle-là depuis longtemps !

    Demande à mes potes si je suis puceau ; tu vas voir les réponses que tu vas te prendre !

Rien que la semaine passée j’ai niqué, donc chut. Ferme-la puceau de merde, parce que toi tu m’as tout l’air d’un bon puceau de merde (souvent vous êtes frustrés de ne pas BAISER) ! C’est agréable de se faire un missionnaire ou un amazone avec une meuf, hein ?

Tu peux pas répondre car tu sais même pas ce que c’est, ou alors tu as dû taper dans ta barre de recherche « missionnaire sexe » ou « amazone sexe » pour comprendre, MDR !

Pour revenir à moi : je suis clairement le moins puceau de ma bande de 11 potes. Pas parce que j’ai le plus de rapports, mais parce que j’ai les plus jolies femmes.

C’est pas moi qui le dis ; c’est eux qui commentent sous mes photos Insta : « trop belle la fille que t’as couchée hier en boîte ! » Donc après, si tu veux…`,
  ],
  low: ['<@{id}> **{n}**, petit joueur'],
  mid: ['<@{id}> **{n}**, belle bête mon cochon'],
  high: ['<@{id}> **{n}**, ça vit hein'],
  prock: ['<@{id}> **{n}**, ok Ruwin'],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function handleMessage(message: Message) {
  if (message.author.bot) return;

  const text = message.content.toLowerCase();

  const hasBodycount = /\bbodycount\b/.test(text);
  const mentions = message.mentions.users;

  if (hasBodycount && mentions.size > 0) {
    const target = mentions.first()!;

    const isProck = Math.random() < 0.1;
    const value = isProck ? randInt(100, 500) : randInt(0, 20);

    let category: keyof typeof BODYCOUNT_MESSAGES;
    if (isProck) category = 'prock';
    else if (value === 0) category = 'zero';
    else if (value <= 4) category = 'low';
    else if (value <= 10) category = 'mid';
    else category = 'high';

    const template = pickRandom(BODYCOUNT_MESSAGES[category]);
    const reply = template
      .replace('{id}', target.id)
      .replace('{n}', String(value));

    await message.reply(reply);
    return;
  }

  if (/\bquoi\b/.test(text)) {
    await message.reply(pickRandom(QUOI_VARIANTS));
    return;
  }

  if (/\bqui\b/.test(text)) {
    await message.reply(pickRandom(QUI_VARIANTS));
  }
}
