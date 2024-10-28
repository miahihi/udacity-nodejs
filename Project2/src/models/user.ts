import Client from '../database'
const bcrypt = require('bcryptjs');

export type User = {
    user_id: number;
    username: string;
    password: string;
    email: string;
}

export class userStore {
    async index(): Promise<User[]> {
      try {
        // @ts-ignore
        const conn = await Client.connect()
        const sql = 'SELECT * FROM users'
  
        const result = await conn.query(sql)
  
        conn.release()
  
        return result.rows 
      } catch (err) {
        throw new Error(`Could not get users. Error: ${err}`)
      }
    }
  
    async show(id: number): Promise<User> {
      try {
      const sql = 'SELECT * FROM users WHERE user_id=($1)'
      // @ts-ignore
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [id])
  
      conn.release()
  
      return result.rows[0]
      } catch (err) {
          throw new Error(`Could not find user ${id}. Error: ${err}`)
      }
    }
  
    async create(b: User): Promise<User> {
        try {
      const sql = 'INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING *'
      // @ts-ignore
      const conn = await Client.connect()
      const saltRounds = parseInt(process.env.SALT_ROUNDS as string, 10);
      const hash = bcrypt.hashSync(b.password + process.env.PEPPER, saltRounds);
      const result = await conn
          .query(sql, [b.username, hash, b.email])
  
      const user = result.rows[0]
  
      conn.release()
  
      return user
        } catch (err) {
            throw new Error(`Could not add new user ${b.username}. Error: ${err}`)
        }
    }
  
    async authenticate(username: string, password: string): Promise<User | null> {
      const conn = await Client.connect()
      const sql = 'SELECT password FROM users WHERE username=($1)'
  
      const result = await conn.query(sql, [username])
  
      if(result.rows.length) {
  
        const user = result.rows[0]
  
        if (bcrypt.compareSync(password+process.env.PEPPER, user.password)) {
          return user
        }
      }
  
      return null
    }

    async delete(id: number): Promise<User> {
        try {
      const sql = 'DELETE FROM users WHERE user_id=($1)'
      // @ts-ignore
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [id])
  
      const user = result.rows[0]
  
      conn.release()
  
      return user
        } catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`)
        }
    }
  }