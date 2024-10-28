import client from '../database';

export type OrderDetail = {
  order_id: number;
  product_id: number;
  quantity: number;
};

export class orderDetailStore {
  async index(): Promise<OrderDetail[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM order_detail';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get order details. Error: ${err}`);
    }
  }

  async show(order_id: number): Promise<OrderDetail[]> {
    try {
      const sql = 'SELECT * FROM order_detail WHERE order_id = $1';
      const conn = await client.connect();
      const result = await conn.query(sql, [order_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find details for order ${order_id}. Error: ${err}`);
    }
  }

  async create(orderDetail: OrderDetail): Promise<OrderDetail> {
    try {
      const sql =
        'INSERT INTO order_detail (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [
        orderDetail.order_id,
        orderDetail.product_id,
        orderDetail.quantity
      ]);
      const newOrderDetail = result.rows[0];
      conn.release();
      return newOrderDetail;
    } catch (err) {
      throw new Error(`Could not add order detail. Error: ${err}`);
    }
  }

  async delete(order_id: number, product_id: number): Promise<OrderDetail> {
    try {
      const sql = 'DELETE FROM order_detail WHERE order_id = $1 AND product_id = $2 RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [order_id, product_id]);
      const deletedOrderDetail = result.rows[0];
      conn.release();
      return deletedOrderDetail;
    } catch (err) {
      throw new Error(`Could not delete order detail. Error: ${err}`);
    }
  }

  async update(orderDetail: OrderDetail): Promise<OrderDetail> {
    try {
      const sql =
        'UPDATE order_detail SET quantity = $1 WHERE order_id = $2 AND product_id = $3 RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [
        orderDetail.quantity,
        orderDetail.order_id,
        orderDetail.product_id
      ]);
      const updatedOrderDetail = result.rows[0];
      conn.release();
      return updatedOrderDetail;
    } catch (err) {
      throw new Error(`Could not update order detail. Error: ${err}`);
    }
  }
}
