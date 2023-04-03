import path from 'path';
import {spawn} from 'child_process';
import rootDir from '../path.js';

const regexPath = path.join(rootDir(), 'utils', 'py-regex', 'regex.py');
const runRegex = (method, pattern, str, flags = '') => {
  const args = [method, str, pattern];
  flags && args.push('--flags', flags);
  try {
    const pyRegex = spawn('python', [regexPath, ...args]);
    return new Promise((resolve, reject) => {
      pyRegex.stdout.on('data', data => {
        resolve(data.toString().trim());
      });
      pyRegex.stderr.on('data', data => {
        reject(data.toString());
      });
      pyRegex.on('close', code => console.log(`Process exited with code ${code}`));
    }).catch((err) => {
      console.error('Error occurred during Python script execution:', err);
    });
  } catch (err) {
    console.log(err);
  }
};

export {runRegex};