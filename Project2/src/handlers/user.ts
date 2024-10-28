import express, { Request, Response } from 'express';
import { User, userStore } from '../models/user';
const jwt = require('jsonwebtoken');

const store = new userStore();

export const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

export const show = async (req: Request, res: Response) => {
  const user = await store.show(parseInt(req.params.id));
  res.json(user);
};

export const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      user_id: 0,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };

    const newuser = await store.create(user);
    const token = jwt.sign({ user: newuser }, process.env.TOKEN_SECRET);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

export const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

export const authenticateUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await store.authenticate(username, password);

  if (user) {
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
    res.json(token);
  } else {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/user/create', create);
  app.delete('/users/:id', destroy);
  app.post('/user/auth', authenticateUser);
};

export default userRoutes;
