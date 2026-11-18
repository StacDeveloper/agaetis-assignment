import 'dotenv/config'
import { readFileSync } from 'node:fs'
import pg from 'pg'

export const pgpool = new pg.Pool({ connectionString: process.env.NEON_DB })

export const pginit = async (): Promise<void> => {
    const pgsql = readFileSync(new URL('../models/schema.sql', import.meta.url), 'utf-8')
    await pgpool.query(pgsql)
}