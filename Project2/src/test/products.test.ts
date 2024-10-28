import { Request, Response } from 'express';
import { productStore } from '../models/product';
const jwt = require('jsonwebtoken');
import { index, show, create, destroy, update } from '../handlers/product';

jest.mock('../models/product');
jest.mock('jsonwebtoken');

describe('Product Routes', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it('index - should return all products', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1', price: 100, category: 'Category 1' }];
    (productStore.prototype.index as jest.Mock).mockResolvedValue(mockProducts);

    await index(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockProducts);
    expect(productStore.prototype.index).toHaveBeenCalled();
  });

  it('show - should return a product by id', async () => {
    const mockProduct = { id: 1, name: 'Product 1', price: 100, category: 'Category 1' };
    req = { params: { id: '1' } };
    (productStore.prototype.show as jest.Mock).mockResolvedValue(mockProduct);

    await show(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockProduct);
    expect(productStore.prototype.show).toHaveBeenCalledWith(1);
  });

  it('create - should create a new product and return the product', async () => {
    const mockProduct = { id: 1, name: 'Product 1', price: 100, category: 'Category 1' };
    req = {
      body: {
        token: 'valid-token',
      },
      params: {
        name: 'Product 1',
        price: '100',
        category: '1',
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (productStore.prototype.create as jest.Mock).mockResolvedValue(mockProduct);

    await create(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockProduct);
    expect(productStore.prototype.create).toHaveBeenCalledWith('Product 1', 100, 1);
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('destroy - should delete a product', async () => {
    const mockDeleteResponse = { message: 'Product deleted' };
    req = { body: { id: 1 } };
    (productStore.prototype.delete as jest.Mock).mockResolvedValue(mockDeleteResponse);

    await destroy(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockDeleteResponse);
    expect(productStore.prototype.delete).toHaveBeenCalledWith(1);
  });

  it('update - should update a product and return the updated product', async () => {
    const mockUpdatedProduct = { id: 1, name: 'Updated Product', price: 150, category: 'Updated Category' };
    req = {
      body: {
        token: 'valid-token',
        name: 'Updated Product',
        price: 150,
        category: 'Updated Category',
      },
      params: { id: '1' },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (productStore.prototype.update as jest.Mock).mockResolvedValue(mockUpdatedProduct);

    await update(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockUpdatedProduct);
    expect(productStore.prototype.update).toHaveBeenCalledWith(1, 'Updated Product', 150, 'Updated Category');
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('should return 401 if token is invalid in create route', async () => {
    req = {
      body: {
        token: 'invalid-token',
      },
      params: {
        name: 'Product 1',
        price: '100',
        category: '1',
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
