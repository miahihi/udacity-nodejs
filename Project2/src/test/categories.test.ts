import { Request, Response } from 'express';
import { categoryStore } from '../models/category';
const jwt = require('jsonwebtoken');
import { index, show, create, destroy } from '../handlers/category';

jest.mock('../models/category');
jest.mock('jsonwebtoken');

describe('Category Routes', () => {
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

  it('index - should return all categories', async () => {
    const mockCategories = [{ id: 1, name: 'Category 1' }];
    (categoryStore.prototype.index as jest.Mock).mockResolvedValue(mockCategories);

    await index(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockCategories);
    expect(categoryStore.prototype.index).toHaveBeenCalled();
  });

  it('show - should return a category by id', async () => {
    const mockCategory = { id: 1, name: 'Category 1' };
    req = { params: { id: '1' } };
    (categoryStore.prototype.show as jest.Mock).mockResolvedValue(mockCategory);

    await show(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockCategory);
    expect(categoryStore.prototype.show).toHaveBeenCalledWith(1);
  });

  it('create - should create a new category and return it', async () => {
    const mockCategory = { id: 1, name: 'New Category' };
    req = {
      body: {
        token: 'valid-token',
        name: 'New Category',
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (categoryStore.prototype.create as jest.Mock).mockResolvedValue(mockCategory);

    await create(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockCategory);
    expect(categoryStore.prototype.create).toHaveBeenCalledWith('New Category');
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('destroy - should delete a category', async () => {
    const mockDeleteResponse = { message: 'Category deleted' };
    req = { params: { id: '1' } };
    (categoryStore.prototype.delete as jest.Mock).mockResolvedValue(mockDeleteResponse);

    await destroy(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockDeleteResponse);
    expect(categoryStore.prototype.delete).toHaveBeenCalledWith(1);
  });

  it('create - should return 401 if token is invalid', async () => {
    req = {
      body: {
        token: 'invalid-token',
        name: 'New Category',
      },
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith('Invalid token Error: Invalid token');
  });
});
