const crypto = require('crypto');

const generateUniqueID = () => {
  return crypto.randomUUID();
};

module.exports = {generateUniqueID};
