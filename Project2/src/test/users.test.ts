import { Request, Response } from 'express';
import { userStore } from '../models/user';
const jwt = require('jsonwebtoken');
import { index, show, create, destroy, authenticateUser } from '../handlers/user'; // Đường dẫn đến file routes

jest.mock('../models/user');
jest.mock('jsonwebtoken');

describe('User Routes', () => {
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

  it('index - should return all users', async () => {
    const mockUsers = [{ user_id: 1, username: 'john', email: 'john@example.com' }];
    (userStore.prototype.index as jest.Mock).mockResolvedValue(mockUsers);

    await index(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockUsers);
    expect(userStore.prototype.index).toHaveBeenCalled();
  });

  it('show - should return a user by id', async () => {
    const mockUser = { user_id: 1, username: 'john', email: 'john@example.com' };
    req = { params: { id: '1' } };
    (userStore.prototype.show as jest.Mock).mockResolvedValue(mockUser);

    await show(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockUser);
    expect(userStore.prototype.show).toHaveBeenCalledWith(1);
  });

  it('create - should create a new user and return a token', async () => {
    const mockUser = { user_id: 1, username: 'john', email: 'john@example.com' };
    const mockToken = 'mockToken';
    req = {
      body: {
        username: 'john',
        password: 'password',
        email: 'john@example.com',
      },
    };
    (userStore.prototype.create as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    await create(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockToken);
    expect(userStore.prototype.create).toHaveBeenCalledWith({
      user_id: 0,
      username: 'john',
      password: 'password',
      email: 'john@example.com',
    });
    expect(jwt.sign).toHaveBeenCalledWith({ user: mockUser }, process.env.TOKEN_SECRET);
  });

  it('destroy - should delete a user', async () => {
    const mockDeleteResponse = { message: 'User deleted' };
    req = { body: { id: 1 } };
    (userStore.prototype.delete as jest.Mock).mockResolvedValue(mockDeleteResponse);

    await destroy(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockDeleteResponse);
    expect(userStore.prototype.delete).toHaveBeenCalledWith(1);
  });

  it('authenticateUser - should authenticate user and return a token', async () => {
    const mockUser = { user_id: 1, username: 'john', email: 'john@example.com' };
    const mockToken = 'mockToken';
    req = {
      body: { username: 'john', password: 'password' },
    };
    (userStore.prototype.authenticate as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    await authenticateUser(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(mockToken);
    expect(userStore.prototype.authenticate).toHaveBeenCalledWith('john', 'password');
    expect(jwt.sign).toHaveBeenCalledWith({ user: mockUser }, process.env.TOKEN_SECRET);
  });

  it('authenticateUser - should return 401 if authentication fails', async () => {
    req = {
      body: { username: 'john', password: 'wrongpassword' },
    };
    (userStore.prototype.authenticate as jest.Mock).mockResolvedValue(null);

    await authenticateUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed' });
  });
});
