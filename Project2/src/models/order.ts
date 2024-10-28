import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
  create_time: string;
};

export class orderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status, create_time) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [order.user_id, order.status, order.create_time]);
      const newOrder = result.rows[0];
      conn.release();
      return newOrder;
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const deletedOrder = result.rows[0];
      conn.release();
      return deletedOrder;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async update(id: number, status: string): Promise<Order> {
    try {
      const sql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [status, id]);
      const updatedOrder = result.rows[0];
      conn.release();
      return updatedOrder;
    } catch (err) {
      throw new Error(`Could not update order ${id}. Error: ${err}`);
    }
  }
}
