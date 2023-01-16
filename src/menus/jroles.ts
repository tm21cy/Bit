import { SelectMenuInteraction, StringSelectMenuInteraction } from "discord.js";
import Query from "../routes/Query";
import { HelperData } from "../types/Interfaces";

module.exports = {
  name: "jroles",
  async execute(
    interaction: StringSelectMenuInteraction | SelectMenuInteraction
  ) {
    const uid = interaction.customId.split("-")[1];
    await Query.helpers.addRoles(uid, ...interaction.values).then((data) => {
      let ret = data.data as HelperData;
      return interaction.reply({
        content: `**Added roles:** ${
          ret.langs?.length && ret.langs.length > 0
            ? ret.langs?.join(", ")
            : "None"
        }`,
        ephemeral: true,
      });
    });
  },
};
