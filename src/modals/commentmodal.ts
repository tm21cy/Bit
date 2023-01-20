import { ModalSubmitInteraction } from "discord.js";
import Query from "../routes/Query";
import actionLog from "../utilities/profiles/actionlogger";

module.exports = {
  name: "commentmodal",
  async execute(interaction: ModalSubmitInteraction) {
    let uid = interaction.customId.split("-")[1];
    let text = interaction.fields.getTextInputValue(`commentin1`);

    await Query.comments
      .postComment(uid, interaction.user.id, interaction.user.tag, text)
      .then((ret) => {
        actionLog("Comments", "POST", ret.data, interaction.user.id);
        return interaction.reply({
          content: "Comment posted!",
          ephemeral: true,
        });
      });
  },
};
