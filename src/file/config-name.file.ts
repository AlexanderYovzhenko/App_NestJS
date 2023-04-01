import { Request } from 'express';
import { extname } from 'path';
import { AnyFunction } from 'sequelize/types/utils';

export const editFileName = (
  _: Request,
  file: { originalname: string },
  callback: AnyFunction,
) => {
  const name = file.originalname.split('.').slice(0, -1).join('_');
  const fileExtName = extname(file.originalname);

  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  callback(null, `${name}-${randomName}${fileExtName}`);
};
