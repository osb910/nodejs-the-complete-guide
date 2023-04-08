import {promises as fs} from 'fs';

const deleteFile = async filePath => {
  const err = await fs.unlink(filePath);
  if (err) throw err;
};

export {deleteFile};
