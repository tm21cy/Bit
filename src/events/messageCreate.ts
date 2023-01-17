import { bgMagentaBright } from "colorette";
import { Message } from "discord.js";
import { log } from "../services/logger";
import axios from "axios";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message: Message) {
    if (message.author.bot) return;
    if (message.guildId !== "924767148738486332") return;
    if (!process.env.MICROSOFT_TRANSLATE_API_KEY) return;
	if (message.content.length < 20) return;

    // If a message repeats a word 5 times, return
	const words = message.content.split(" ");
	const wordCount = words.reduce((acc: any, word: any) => {
		acc[word] = (acc[word] || 0) + 1;
		return acc;
	}, {});
	const repeatedWords = Object.keys(wordCount).filter((word) => wordCount[word] > 4);
	if (repeatedWords.length > 0) return;

    const endpoint = "https://api.cognitive.microsofttranslator.com";

    await axios
      .post(
        `${endpoint}/detect?api-version=3.0`,
        [
          {
            Text: message.content,
          },
        ],
        {
          headers: {
            "Ocp-Apim-Subscription-Key":
              process.env.MICROSOFT_TRANSLATE_API_KEY,
            // Region is North Central US
            "Ocp-Apim-Subscription-Region": "northcentralus",
            "Content-type": "application/json",
          },
        }
      )
      .then(async (response) => {
        const language = response.data[0].language;
        if (language !== "en") {
          await axios
            .post(
              `${endpoint}/translate?api-version=3.0&to=${language}`,
              [
                {
                  Text: "Please only speak English in this server.",
                },
              ],
              {
                headers: {
                  "Ocp-Apim-Subscription-Key":
                    process.env.MICROSOFT_TRANSLATE_API_KEY,
                  // Region is North Central US
                  "Ocp-Apim-Subscription-Region": "northcentralus",
                  "Content-type": "application/json",
                },
              }
            )
            .then((response) => {
              const translatedMessage = response.data[0].translations[0].text;
              message.reply(`${translatedMessage}`);
              log.info(
                `Translated message from ${message.author.username}#${message.author.discriminator} (${message.author.id}) from ${language} to English. Detected language: ${language}`
              );
            })
            .catch((error) => {
              log.error(error);
            });
        }
      })
      .catch((error) => {
        log.error(error);
      });
  },
};
