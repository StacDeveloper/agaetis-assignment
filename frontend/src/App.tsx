import { useCallback, useEffect, useState } from "react";
import { createEmployee, deleteEmployee, errorMessage, getEmployees, updateEmployee } from "../src/api/api";
import EmployeeForm from "./components/employeeForm";
import EmployeeTable from "./components/employeeTable";
import type { Employee, EmployeeInput } from "../src/types/types";
import { toast } from "react-toastify"

const PAGE_SIZE = 8;

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployees({ search: query, page, limit: PAGE_SIZE });
      setEmployees(res.data);
      setTotal(res.total);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (values: EmployeeInput): Promise<boolean> => {
    setSaving(true);
    try {
      if (editing) {
        await updateEmployee(editing.id, values);
        toast.success(`Details Saved Successfully for ${values.name}`)
      }
      else {
        await createEmployee(values);
        toast.success(`Employee created successfully for ${values.name}`)
      }
      setEditing(null);
      setError("");
      await load();
      return true
    } catch (err) {
      setError(errorMessage(err));
      toast.error(errorMessage(err))
      return false
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (emp: Employee) => {
    if (!window.confirm(`Delete ${emp.name}? This can't be undone.`)) return;
    try {
      await deleteEmployee(emp.id);
      toast.success(`Employee Deleted Successfully ${emp.name}`)
      if (editing?.id === emp.id) setEditing(null);
      if (employees.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="app">
      <header>
        <h1>Employee Directory</h1>
        <p>{total} {total === 1 ? "person" : "people"} on the team</p>
      </header>

      {error && <div className="alert" role="alert">{error}</div>}

      <div className="layout">
        <EmployeeForm editing={editing} saving={saving} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />

        <section className="panel">
          <input
            className="search"
            type="search"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search employees by name"
          />
          <EmployeeTable
            employees={employees}
            loading={loading}
            editingId={editing?.id}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
          <nav className="pager" aria-label="Pagination">
            <button className="btn small" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {pages}</span>
            <button className="btn small" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
          </nav>
        </section>
      </div>
    </main>
  );
}
