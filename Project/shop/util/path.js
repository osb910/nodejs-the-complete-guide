import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = () => {
    const __filename = fileURLToPath(import.meta.url);
    return path.join(path.dirname(__filename), '..');
}
export default __dirname;
