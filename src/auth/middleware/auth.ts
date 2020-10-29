import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
import { jwtConstants } from '../constants';

export const authMiddleware = (req: Request, res: Response, next: Function) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({message: 'authorization required'})
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, jwtConstants.secret);
  } catch (err) {
    return res
        .status(401)
        .send({message: 'authorization required'});
  }

  req.user = payload;

  next();
};

