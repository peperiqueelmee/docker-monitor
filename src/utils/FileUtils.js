const fs = require('fs').promises;
const path = require('path');

class FileUtils {
  static STATE_DIR = path.join(__dirname, '../../state');
  static STATE_FILE = path.join(FileUtils.STATE_DIR, 'containers_state.json');
  static TEMP_FILE = path.join(FileUtils.STATE_DIR, 'temp_state.json');

  static async ensureStateDir() {
    try {
      await fs.mkdir(FileUtils.STATE_DIR, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  static async readJsonFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async writeJsonFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  static async moveFile(src, dest) {
    await fs.rename(src, dest);
  }
}

module.exports = FileUtils;
