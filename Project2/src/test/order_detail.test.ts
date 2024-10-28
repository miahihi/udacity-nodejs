import { Request, Response } from 'express';
import { orderDetailStore } from '../models/order_detail';
import { create, destroy, index, show, update } from '../handlers/order_detail';
const jwt = require('jsonwebtoken');

jest.mock('../models/order_detail');
jest.mock('jsonwebtoken');

describe('Order Detail Routes', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  it('index - should return all order details', async () => {
    const mockOrderDetails = [{ order_id: 1, product_id: 1, quantity: 2 }];
    (orderDetailStore.prototype.index as jest.Mock).mockResolvedValue(mockOrderDetails);

    await index(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockOrderDetails);
    expect(orderDetailStore.prototype.index).toHaveBeenCalled();
  });

  it('show - should return order detail by order_id', async () => {
    const mockOrderDetail = { order_id: 1, product_id: 1, quantity: 2 };
    req = { params: { order_id: '1' } };
    (orderDetailStore.prototype.show as jest.Mock).mockResolvedValue(mockOrderDetail);

    await show(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockOrderDetail);
    expect(orderDetailStore.prototype.show).toHaveBeenCalledWith(1);
  });

  it('create - should create a new order detail and return it', async () => {
    const mockOrderDetail = { order_id: 1, product_id: 1, quantity: 2 };
    req = {
      body: {
        token: 'valid-token',
        order_id: '1',
        product_id: '1',
        quantity: '2',
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (orderDetailStore.prototype.create as jest.Mock).mockResolvedValue(mockOrderDetail);

    await create(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockOrderDetail);
    expect(orderDetailStore.prototype.create).toHaveBeenCalledWith({
      order_id: 1,
      product_id: 1,
      quantity: 2,
    });
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('destroy - should delete an order detail', async () => {
    const mockDeleteResponse = { message: 'Order detail deleted' };
    req = { params: { order_id: '1', product_id: '1' } };
    (orderDetailStore.prototype.delete as jest.Mock).mockResolvedValue(mockDeleteResponse);

    await destroy(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockDeleteResponse);
    expect(orderDetailStore.prototype.delete).toHaveBeenCalledWith(1, 1);
  });

  it('update - should update an order detail and return the updated order detail', async () => {
    const mockUpdatedOrderDetail = { order_id: 1, product_id: 1, quantity: 3 };
    req = {
      body: {
        token: 'valid-token',
        quantity: '3',
      },
      params: { order_id: '1', product_id: '1' },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (orderDetailStore.prototype.update as jest.Mock).mockResolvedValue(mockUpdatedOrderDetail);

    await update(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockUpdatedOrderDetail);
    expect(orderDetailStore.prototype.update).toHaveBeenCalledWith({
      order_id: 1,
      product_id: 1,
      quantity: 3,
    });
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('should return 401 if token is invalid in create route', async () => {
    req = {
      body: {
        token: 'invalid-token',
        order_id: '1',
        product_id: '1',
        quantity: '2',
      },
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(`Invalid token Error: Invalid token`);
  });
});
