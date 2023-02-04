import {
	ApplicationCommandType,
	ComponentType,
	Interaction,
	InteractionType
} from "discord.js"
import { v4 as uuidv4 } from "uuid"
import { log } from "../services/logger"
module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction: Interaction) {
		switch (interaction.type) {
			case InteractionType.ApplicationCommand:
				switch (interaction.commandType) {
					case ApplicationCommandType.ChatInput:
						const command = interaction.client.commands.get(
							interaction.commandName
						)

						if (!command) return

						await command.execute(interaction).catch((error: unknown) => {
							const errorId = uuidv4()
							log.error(error, errorId)
							interaction.deferred
								? interaction.editReply({
										content: `There was an error while executing this command. Error ID: ${errorId}`,
										embeds: [],
										files: []
								  })
								: interaction.reply({
										content: `There was an error while executing this command. Error ID: ${errorId}`,
										embeds: [],
										files: []
								  })
						})
						break
				}
				break
			case InteractionType.ModalSubmit: {
				const prefix = interaction.customId.split("-")[0]
				let modal = interaction.client.modals.get(`${prefix}`)
				if (!modal) return
				await modal.execute(interaction).catch((error: unknown) => {
					const errorId = uuidv4()
					log.error(error, errorId)
					interaction.deferred
						? interaction.editReply({
								content: `There was an error while executing this command. Error ID: ${errorId}`,
								embeds: [],
								files: []
						  })
						: interaction.reply({
								content: `There was an error while executing this command. Error ID: ${errorId}`,
								embeds: [],
								files: []
						  })
				})
				break
			}
			case InteractionType.ApplicationCommandAutocomplete:
				const command = interaction.client.commands.get(interaction.commandName)

				if (!command) return

				try {
					await command.autocomplete(interaction)
				} catch (error) {
					log.error(error)
				}
				break

			case InteractionType.MessageComponent:
				const prefix = interaction.customId.split("-")[0]
				switch (interaction.componentType) {
					case ComponentType.Button: {
						let btn = interaction.client.buttons.get(`${prefix}`)
						if (!btn) return
						await btn.execute(interaction).catch((error: unknown) => {
							const errorId = uuidv4()
							log.error(error, errorId)
							interaction.deferred
								? interaction.editReply({
										content: `There was an error while executing this command. Error ID: ${errorId}`,
										embeds: [],
										files: []
								  })
								: interaction.reply({
										content: `There was an error while executing this command. Error ID: ${errorId}`,
										embeds: [],
										files: []
								  })
						})
						break
					}
					case ComponentType.StringSelect || ComponentType.SelectMenu: {
						let menu = interaction.client.menus.get(`${prefix}`)
						if (!menu) return
						await menu.execute(interaction).catch((error: unknown) => {
							const errorId = uuidv4()
							log.error(error, errorId)
							interaction.deferred
								? interaction.editReply({
										content: `There was an error while executing this command. Error ID: ${errorId}`,
										embeds: [],
										files: []
								  })
								: interaction.reply({
										content: `There was an error while executing this command. Error ID: ${errorId}`,
										embeds: [],
										files: []
								  })
						})
						break
					}
				}
				break
		}
	}
}
