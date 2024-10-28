import express, { Request, Response } from 'express';
import { orderDetailStore } from '../models/order_detail';
const jwt = require('jsonwebtoken');

const store = new orderDetailStore();

export const index = async (_req: Request, res: Response) => {
  const orderDetails = await store.index();
  res.json(orderDetails);
};

export const show = async (req: Request, res: Response) => {
  const orderDetails = await store.show(parseInt(req.params.order_id));
  res.json(orderDetails);
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
    const orderDetail = {
      order_id: parseInt(req.body.order_id),
      product_id: parseInt(req.body.product_id),
      quantity: parseInt(req.body.quantity),
    };
    const newOrderDetail = await store.create(orderDetail);
    res.json(newOrderDetail);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

export const destroy = async (req: Request, res: Response) => {
  const deletedOrderDetail = await store.delete(
    parseInt(req.params.order_id),
    parseInt(req.params.product_id)
  );
  res.json(deletedOrderDetail);
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
      const orderDetail = {
        order_id: parseInt(req.params.order_id),
        product_id: parseInt(req.params.product_id),
        quantity: parseInt(req.body.quantity)
      };
      
      const updatedOrderDetail = await store.update(orderDetail);
      res.json(updatedOrderDetail);
    } catch (err) {
      res.status(400);
      res.json(err);
    }
  };

const orderDetailRoutes = (app: express.Application) => {
  app.get('/order-details', index);
  app.get('/order-details/:order_id', show);
  app.post('/order-details/create', create);
  app.put('/order-details/:order_id/:product_id', update);
  app.delete('/order-details/:order_id/:product_id', destroy);
};

export default orderDetailRoutes;
