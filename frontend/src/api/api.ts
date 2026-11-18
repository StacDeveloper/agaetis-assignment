import axios from "axios";
import type { Employee, EmployeeInput, EmployeePage } from "../types/types";

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000" });

export const getEmployees = (params: { search: string; page: number; limit: number }) =>
  http.get<EmployeePage>("/api/employees/get-all-employees", { params }).then((r) => r.data);

export const createEmployee = (body: EmployeeInput) =>
  http.post<Employee>("/api/employees/insert-employee", body).then((r) => r.data);

export const updateEmployee = (id: number, body: EmployeeInput) =>
  http.put<Employee>(`/api/employees/update-employee/${id}`, body).then((r) => r.data);

export const deleteEmployee = (id: number) => http.delete(`/api/employees/delete-employee/${id}`);


export const errorMessage = (err: unknown): string =>
  axios.isAxiosError(err)
    ? err.response?.data?.error ?? "Can't reach the server. Check that the API is running."
    : "Something went wrong.";
