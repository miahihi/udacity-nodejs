import express, { Request, Response } from 'express';
import { categoryStore } from '../models/category';
const jwt = require('jsonwebtoken');

const store = new categoryStore();

export const index = async (_req: Request, res: Response) => {
  const categories = await store.index();
  res.json(categories);
};

export const show = async (req: Request, res: Response) => {
  const category = await store.show(parseInt(req.params.id));
  res.json(category);
};

export const create = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
    return;
  }
  try {
    const newcategory = await store.create(req.body.name);
    res.json(newcategory);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

export const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(parseInt(req.params.id));
  res.json(deleted);
};

const categoryRoutes = (app: express.Application) => {
  app.get('/categories', index);
  app.get('/categories/:id', show);
  app.post('/categories', create);
  app.delete('/categories/:id', destroy);
};

export default categoryRoutes;
