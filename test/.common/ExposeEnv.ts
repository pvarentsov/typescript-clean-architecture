import * as  dotenv from 'dotenv';
import * as path from 'path';

const envPath: string = path.resolve(__dirname, '../../env/local.app.env');

dotenv.config({path: envPath});
