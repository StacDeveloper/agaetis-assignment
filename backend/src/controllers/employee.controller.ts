import { z } from 'zod'
import { NextFunction, type Request, type Response } from 'express';
import { pgpool } from '../configs/db.js';

const employeeSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    role: z.string().trim().min(1, "Role is required").max(100),
});

const listSchema = z.object({
    search: z.string().trim().default(""),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});

const IdToParse = (req: Request) => {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null
}

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, page, limit } = listSchema.parse(req.query);
        const like = `%${search}%`;
        const [rows, count] = await Promise.all([
            pgpool.query(
                `SELECT * FROM employees WHERE name ILIKE $1
         ORDER BY created_at DESC, id DESC LIMIT $2 OFFSET $3`,
                [like, limit, (page - 1) * limit]
            ),
            pgpool.query("SELECT COUNT(*)::int AS total FROM employees WHERE name ILIKE $1", [like]),
        ]);
        res.json({ data: rows.rows, total: count.rows[0].total, page, limit });
    } catch (err) {
        next(err);
    }
}

export const insertEmployes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, role } = employeeSchema.parse(req.body)
        const { rows } = await pgpool.query(
            "INSERT INTO employees (name, email, role) VALUES ($1, $2, $3) RETURNING *",
            [name, email, role]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        next(error)
    }
}

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = IdToParse(req);
        if (!id) return res.status(400).json({ error: "Invalid id" });
        const { name, email, role } = employeeSchema.parse(req.body);
        const { rows } = await pgpool.query(
            "UPDATE employees SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *",
            [name, email, role, id]
        );
        if (!rows[0]) return res.status(404).json({ error: "Employee not found" });
        res.json(rows[0]);
    } catch (error) {
        next(error)
    }
}

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = IdToParse(req);
        if (!id) return res.status(400).json({ error: "Invalid id" });
        const { rowCount } = await pgpool.query("DELETE FROM employees WHERE id = $1", [id]);
        if (!rowCount) return res.status(404).json({ error: "Employee not found" });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.issues[0].message });
    }
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "23505") {
        return res.status(409).json({ error: "An employee with this email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong on the server" });
}