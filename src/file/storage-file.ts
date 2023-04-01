import { diskStorage } from 'multer';
import * as path from 'path';
import { editFileName } from './config-name.file';

export const storageFile = {
  storage: diskStorage({
    destination: path.join(__dirname, '../..', 'static'),
    filename: editFileName,
  }),
};
