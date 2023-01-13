/**
 * I need to be able to get all users in a certain help role. Just need to store their ID.
 * I need to be able to get a user's help roles.
 * I need to be able to add a user to a help role and subsequently remove them from it.
 * 
 * e.g. database.getUserHelpRoles(userId) => ["JavaScript", "Python"]
 * e.g. database.addUserToHelpRole(userId, ["JavaScript", "Python"]) => ["JavaScript", "Python"]
 * e.g. database.removeUserFromHelpRole(userId, ["JavaScript", "Python"]) => []
 * e.g. database.getUserInHelpRole("JavaScript") => ["123456789", "987654321"]
 */