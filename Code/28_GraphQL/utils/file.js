import {promises as fs} from 'fs';
import path from 'path';
import rootDir from './path.js';

const deleteFile = async filePath => {
  const err = await fs.unlink(filePath);
  if (err) throw err;
};

const clearImage = async filePath => {
  filePath = path.join(rootDir(), filePath);
  const err = await fs.unlink(filePath);
  if (err) throw err;
};

export {deleteFile, clearImage};
