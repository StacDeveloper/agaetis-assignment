import express from 'express'
import employeeRoutes from './routes/employee.routes.js'
import cors from 'cors'
import { errorHandler } from './controllers/employee.controller.js'
import { pginit } from './configs/db.js'


const app = express()

const PORT = process.env.PORT || 4000


app.use(express.json())
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
