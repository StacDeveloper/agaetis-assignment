import type {Employee} from "../types/types"

interface Props {
  employees: Employee[];
  loading: boolean;
  editingId?: number;
  onEdit: (e: Employee) => void;
  onDelete: (e: Employee) => void;
}

const initials = (name: string) =>
  name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

export default function EmployeeTable({ employees, loading, editingId, onEdit, onDelete }: Props) {
  if (!loading && employees.length === 0) {
    return <p className="empty">No employees found. Add one using the form.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Added</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody className={loading ? "loading" : ""}>
          {employees.map((emp) => (
            <tr key={emp.id} className={emp.id === editingId ? "active" : ""}>
              <td>
                <div className="person">
                  <span className="avatar">{initials(emp.name)}</span>
                  <div>
                    <strong>{emp.name}</strong>
                    <small>{emp.email}</small>
                  </div>
                </div>
              </td>
              <td>{emp.role}</td>
              <td>{new Date(emp.created_at).toLocaleDateString()}</td>
              <td className="row-actions">
                <button className="btn small" onClick={() => onEdit(emp)}>Edit</button>
                <button className="btn small danger" onClick={() => onDelete(emp)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
