import express, { Request, Response } from 'express';
import { orderStore } from '../models/order';
const jwt = require('jsonwebtoken');

const store = new orderStore();

export const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

export const show = async (req: Request, res: Response) => {
  const order = await store.show(parseInt(req.params.id));
  res.json(order);
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
    const order = {
      user_id: parseInt(req.body.user_id),
      status: req.body.status,
      create_time: new Date().toISOString(),
    };
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

export const destroy = async (req: Request, res: Response) => {
  const deletedOrder = await store.delete(parseInt(req.params.id));
  res.json(deletedOrder);
};

export const update = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
    return;
  }

  try {
    const updatedOrder = await store.update(parseInt(req.params.id), req.body.status);
    res.json(updatedOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders/create', create);
  app.put('/orders/:id', update);
  app.delete('/orders/:id', destroy);
};

export default orderRoutes;
