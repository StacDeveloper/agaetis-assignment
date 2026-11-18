import express from 'express'
import employeeRoutes from './routes/employee.routes.js'
import cors from 'cors'
import { errorHandler } from './controllers/employee.controller.js'
import { pginit } from './configs/db.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'

const app = express()

const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(rateLimit({windowMs:60_000, max:100}))
app.use(express.json())
app.use(morgan("dev"))
app.use(cors({
    origin: process.env.FRONTEND_URL
}))

app.use("/api/employees", employeeRoutes)
app.use(errorHandler)

app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: `Health check successful` })
})

pginit().then(() => app.listen(PORT, () => {
    console.log(`Express app running on http://localhost:${PORT}`)
})).catch((err) => {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1);
})
