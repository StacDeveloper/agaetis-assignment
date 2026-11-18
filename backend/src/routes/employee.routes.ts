import express from 'express'
import { deleteEmployee, getAllEmployees, insertEmployes, updateEmployee } from '../controllers/employee.controller.js'

const employeeRoutes = express.Router()

employeeRoutes.get("/get-all-employees", getAllEmployees)
employeeRoutes.post("/insert-employee", insertEmployes)
employeeRoutes.put("/update-employee/:id", updateEmployee)
employeeRoutes.delete("/delete-employee/:id", deleteEmployee)

export default employeeRoutes