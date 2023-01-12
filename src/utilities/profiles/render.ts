import { ProfileData } from "../../types/Interfaces";
import { EmbedBuilder } from "discord.js";
import Badges from "./badges";
import badges from "./badges";
import Query from "../../routes/Query";

export default async function render(profile: ProfileData) {
  console.log(profile);

  // Profile data destructure
  let display_name = profile.display_name;
  let badge_flags = profile.badge_flags;
  let user_id = profile.user_id;
  let bio = profile.bio;
  let display_picture = profile.display_picture ?? process.env.CLIENT_PFP;
  let hits = profile.hits;
  let likes = profile.likes;
  let id = profile.id;
  let muted = profile.muted;

  // Preliminary data parsing
  let embedColor = "Blurple";
  let badges = Badges.getBadgeEmojis(badge_flags);
  let comments = await Query.comments.retrieveComments(user_id);
  let chunks: string[] = [];

  for (let i = 0; i < badges.length; i += 5) {
    chunks.push(
      badges
        .slice(i, i + 5)
        .toString()
        .replaceAll(",", " ")
    );
  }

  const embed = new EmbedBuilder().setColor("Blurple");
  embed.setTitle(`${profile.display_name}`);
  embed.setThumbnail(display_picture);
  embed.addFields([
    {
      name: " ",
      value: `${bio}`,
    },
    {
      name: " ",
      value: `<:thumbs_up:1062436702444081234> ${likes}\t<:views:1062436699889737819> ${hits}`,
      inline: true,
    },
  ]);
  embed.setDescription(`${chunks[0] == "" ? " " : chunks.join("\n")}`);

  return embed;
}
