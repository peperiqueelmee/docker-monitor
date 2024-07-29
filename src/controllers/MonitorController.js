const DockerService = require('../services/DockerService');
const EmailService = require('../services/EmailService');
const FileUtils = require('../utils/FileUtils');
const Logger = require('../utils/Logger');
const _ = require('lodash');
const { EMAIL_CONFIG } = require('../config/emailConfig');

class MonitorController {
  async monitorContainers() {
    await FileUtils.ensureStateDir();

    const currentState = await DockerService.getContainersState();
    await FileUtils.writeJsonFile(FileUtils.TEMP_FILE, currentState);

    let previousState = await FileUtils.readJsonFile(FileUtils.STATE_FILE);
    let isFirstRun = false;

    if (previousState.length === 0) {
      Logger.info('No previous state file found. Creating new state file.');
      isFirstRun = true;
    }

    const addedOrModifiedContainers = _.differenceWith(currentState, previousState, _.isEqual);
    const removedContainers = _.differenceWith(previousState, currentState, (prev, curr) => prev.id === curr.id);

    let plainTextChanges = '';

    const tableRows = [];

    addedOrModifiedContainers.forEach(diff => {
      const prev = previousState.find(container => container.id === diff.id);
      if (prev) {
        if (prev.state !== diff.state) {
          const row = `<tr>
              <td>${diff.name}</td>
              <td>${diff.image}</td>
              <td>${prev.state}</td>
              <td>${diff.state}</td>
            </tr>`;
          tableRows.push(row);

          plainTextChanges += `The container '${diff.name}' with the image '${diff.image}' has changed from state '${prev.state}' to state '${diff.state}'.\n`;
        }
      } else {
        const row = `<tr>
            <td>${diff.name}</td>
            <td>${diff.image}</td>
            <td>-</td>
            <td>${diff.state}</td>
          </tr>`;
        tableRows.push(row);

        plainTextChanges += `The container '${diff.name}' with the image '${diff.image}' has been added.\n`;
      }
    });

    removedContainers.forEach(container => {
      const row = `<tr>
          <td>${container.name}</td>
          <td>${container.image}</td>
          <td>${container.state}</td>
          <td>removed</td>
        </tr>`;
      tableRows.push(row);

      plainTextChanges += `The container '${container.name}' with the image '${container.image}' has been removed.\n`;
    });

    if (!isFirstRun && tableRows.length > 0) {
      Logger.info('Changes detected in the container state:');
      Logger.info(plainTextChanges);

      const table = `
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Previous State</th>
              <th>Current State</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.join('')}
          </tbody>
        </table>`;

      const emailBody = `
        <div>
          <img src="cid:docker-banner" alt="Docker-banner" style="width: 100%; max-width: 600px;">
        </div>
        <p>Dear User,</p>
        <p>The following containers have changed state:</p>
        ${table}
        <p>Best regards,<br>Your DevOps Monitoring Team.</p>`;

      let subject = `Changes in the container state on host: ${process.env.HOSTNAME}`;

      Logger.info(`Sending email to ${EMAIL_CONFIG.recipient}`);
      await EmailService.sendEmail(EMAIL_CONFIG.recipient, subject, emailBody)
        .then(info => Logger.info(`Email sent to ${EMAIL_CONFIG.recipient}:`, info.response))
        .catch(error => Logger.error('Error sending email:', error));
    } else if (isFirstRun) {
      // No additional log needed here
    } else {
      Logger.info('No changes detected in the container state.');
    }

    await FileUtils.moveFile(FileUtils.TEMP_FILE, FileUtils.STATE_FILE);
  }
}

module.exports = new MonitorController();
