require('dotenv').config();
const MonitorController = require('./controllers/MonitorController');
const Logger = require('./utils/Logger');

async function run() {
  while (true) {
    try {
      await MonitorController.monitorContainers();
    } catch (error) {
      Logger.error(`Error in monitoring cycle: ${error}`);
    }
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute
  }
}

run();
