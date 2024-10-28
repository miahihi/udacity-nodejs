import express, { Request, Response } from 'express';
import { productStore } from '../models/product';
const jwt = require('jsonwebtoken');

const store = new productStore();

export const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

export const show = async (req: Request, res: Response) => {
  const product = await store.show(parseInt(req.params.id));
  res.json(product);
};

export const create = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const newproduct = await store.create(req.params.name, Number(req.params.price), parseInt(req.params.category));
    res.json(newproduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

export const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

export const update = async (req: Request, res: Response) => {
  try {
    try {
      jwt.verify(req.body.token, process.env.TOKEN_SECRET);
    } catch (error) {
      res.status(401);
      res.json(`Invalid token ${error}`);
    }
    const id = parseInt(req.params.id);
    const { name, price, category } = req.body;
    const updatedProduct = await store.update(id, name, price, category);
    res.json(updatedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products/create', create);
  app.put('/products/:id', update);
  app.delete('/products/:id', destroy);
};

export default productRoutes;
