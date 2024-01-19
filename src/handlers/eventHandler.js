const path = require("path");
const fs = require("fs");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
  const eventsPath = path.join(__dirname, "../events");

  // Check if the 'events' directory exists
  if (!fs.existsSync(eventsPath)) {
    console.error(`The directory ${eventsPath} does not exist.`);
    return;
  }

  const eventFolders = getAllFiles(eventsPath, true);

  for (const eventFolder of eventFolders) {
    // Check if the event folder exists
    if (!fs.existsSync(eventFolder)) {
      console.error(`The directory ${eventFolder} does not exist.`);
      continue;
    }

    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);

        await eventFunction(client, arg);
      }
    });
  }
};
