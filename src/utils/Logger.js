const getCurrentTime = () => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const log = (level, message) => {
  console.log(`[${getCurrentTime()}] [${level}] ${message}`);
};

module.exports = {
  info: message => log('INFO', message),
  error: message => log('ERROR', message),
};
