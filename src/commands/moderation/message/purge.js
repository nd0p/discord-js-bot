const { purgeMessages } = require("@helpers/ModUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "purge",
  description: "deletes the specified amount of messages",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  botPermissions: ["ManageMessages", "ReadMessageHistory"],
  command: {
    enabled: true,
    usage: "<amount>",
    minArgsCount: 1,
  },

  async messageRun(message, args) {
    const amount = args[0];

    if (isNaN(amount)) return message.safeReply("Numbers are only allowed");
    if (parseInt(amount) > 99) return message.safeReply("The max amount of messages that I can delete is 99");

    const { channel } = message;
    const response = await purgeMessages(message.member, channel, "ALL", amount + 1);

    if (typeof response === "number") {
      return channel.safeSend(`Successfully deleted ${response} messages`, 5);
    } else if (response === "BOT_PERM") {
      return message.safeReply("I don't have `Read Message History` & `Manage Messages` to delete messages", 5);
    } else if (response === "MEMBER_PERM") {
      return message.safeReply("You don't have `Read Message History` & `Manage Messages` to delete messages", 5);
    } else if (response === "NO_MESSAGES") {
      return channel.safeSend("No messages found that can be cleaned", 5);
    } else {
      return message.safeReply(`Error occurred! Failed to delete messages`);
    }
  },
};
