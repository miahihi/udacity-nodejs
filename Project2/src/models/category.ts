import Client from '../database'

export type Category = {
    category_id: number;
    name: string;
}

export class categoryStore {
    async index(): Promise<Category[]> {
      try {
        const conn = await Client.connect()
        const sql = 'SELECT * FROM categories'
  
        const result = await conn.query(sql)
  
        conn.release()
  
        return result.rows 
      } catch (err) {
        throw new Error(`Could not get categories. Error: ${err}`)
      }
    }
  
    async show(id: number): Promise<Category> {
      try {
      const sql = 'SELECT * FROM categories WHERE category_id=($1)'
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [id])
  
      conn.release()
  
      return result.rows[0]
      } catch (err) {
          throw new Error(`Could not find category ${id}. Error: ${err}`)
      }
    }
  
    async create(name: string): Promise<Category> {
        try {
      const sql = 'INSERT INTO categories (name) VALUES($1) RETURNING *'
      const conn = await Client.connect()
  
      const result = await conn
          .query(sql, [name])
  
      const category = result.rows[0]
  
      conn.release()
  
      return category
        } catch (err) {
            throw new Error(`Could not add new category ${name}. Error: ${err}`)
        }
    }
  
    async delete(id: number): Promise<Category> {
        try {
      const sql = 'DELETE FROM categories WHERE category_id=($1)'
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [id])
  
      const category = result.rows[0]
  
      conn.release()
  
      return category
        } catch (err) {
            throw new Error(`Could not delete category ${id}. Error: ${err}`)
        }
    }
  }