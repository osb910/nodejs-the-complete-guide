import crypto from 'crypto';

const generateUniqueID = () => {
  return crypto.randomUUID();
};

const getIdString = mongoDBId => {
  const [symbolId] = Object.getOwnPropertySymbols(mongoDBId);
  const idString = mongoDBId[symbolId].toString('hex');
  return idString;
};

const goldenSecond = 1618;
const piSecond = 3141;

export {generateUniqueID, getIdString, goldenSecond, piSecond};
