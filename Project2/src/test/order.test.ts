import { Request, Response } from 'express';
import { orderStore } from '../models/order';
const jwt = require('jsonwebtoken');
import { index, show, create, destroy, update } from '../handlers/order';

jest.mock('../models/order');
jest.mock('jsonwebtoken');

describe('Order Routes', () => {
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

  it('index - should return all orders', async () => {
    const mockOrders = [{ id: 1, user_id: 1, status: 'active', create_time: '2024-10-07T00:00:00.000Z' }];
    (orderStore.prototype.index as jest.Mock).mockResolvedValue(mockOrders);

    await index(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockOrders);
    expect(orderStore.prototype.index).toHaveBeenCalled();
  });

  it('show - should return an order by id', async () => {
    const mockOrder = { id: 1, user_id: 1, status: 'active', create_time: '2024-10-07T00:00:00.000Z' };
    req = { params: { id: '1' } };
    (orderStore.prototype.show as jest.Mock).mockResolvedValue(mockOrder);

    await show(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockOrder);
    expect(orderStore.prototype.show).toHaveBeenCalledWith(1);
  });

  it('create - should create a new order and return the order', async () => {
    const mockOrder = { id: 1, user_id: 1, status: 'active', create_time: '2024-10-07T00:00:00.000Z' };
    req = {
      body: {
        token: 'valid-token',
        user_id: '1',
        status: 'active',
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (orderStore.prototype.create as jest.Mock).mockResolvedValue(mockOrder);

    await create(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockOrder);
    expect(orderStore.prototype.create).toHaveBeenCalledWith({
      user_id: 1,
      status: 'active',
      create_time: expect.any(String), // as it's a generated timestamp
    });
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('destroy - should delete an order', async () => {
    const mockDeleteResponse = { message: 'Order deleted' };
    req = { params: { id: '1' } };
    (orderStore.prototype.delete as jest.Mock).mockResolvedValue(mockDeleteResponse);

    await destroy(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockDeleteResponse);
    expect(orderStore.prototype.delete).toHaveBeenCalledWith(1);
  });

  it('update - should update an order and return the updated order', async () => {
    const mockUpdatedOrder = { id: 1, user_id: 1, status: 'complete', create_time: '2024-10-07T00:00:00.000Z' };
    req = {
      body: {
        token: 'valid-token',
        status: 'complete',
      },
      params: { id: '1' },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (orderStore.prototype.update as jest.Mock).mockResolvedValue(mockUpdatedOrder);

    await update(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockUpdatedOrder);
    expect(orderStore.prototype.update).toHaveBeenCalledWith(1, 'complete');
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('should return 401 if token is invalid in create route', async () => {
    req = {
      body: {
        token: 'invalid-token',
        user_id: '1',
        status: 'active',
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
