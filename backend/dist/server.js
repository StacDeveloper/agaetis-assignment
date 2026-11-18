import express from 'express';
import employeeRoutes from './routes/employee.routes.js';
const app = express();
const PORT = 4000;
app.use("/api/employees", employeeRoutes);
app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: `Health check successful` });
});
app.listen(PORT, () => {
    console.log(`Express app running on http://localhost:${PORT}`);
});
