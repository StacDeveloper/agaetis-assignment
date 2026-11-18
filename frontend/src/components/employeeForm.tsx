import { useEffect, useState, type FormEvent } from "react";
import type { EmployeeInput, Employee } from '../types/types'

const empty: EmployeeInput = { name: "", email: "", role: "" };

interface Props {
    editing: Employee | null;
    saving: boolean;
    onSubmit: (values: EmployeeInput) => void;
    onCancel: () => void;
}

export default function EmployeeForm({ editing, saving, onSubmit, onCancel }: Props) {
    const [values, setValues] = useState<EmployeeInput>(empty);

    useEffect(() => {
        setValues(editing ? { name: editing.name, email: editing.email, role: editing.role } : empty);
    }, [editing]);

    const set = (key: keyof EmployeeInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setValues((v) => ({ ...v, [key]: e.target.value }));

    const submit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(values);
    };

    return (
        <form className="panel form" onSubmit={submit}>
            <h2>{editing ? "Edit employee" : "Add employee"}</h2>
            <label>
                Full name
                <input value={values.name} onChange={set("name")} placeholder="Asha Rao" required maxLength={100} />
            </label>
            <label>
                Work email
                <input type="email" value={values.email} onChange={set("email")} placeholder="asha@company.com" required />
            </label>
            <label>
                Job role
                <input value={values.role} onChange={set("role")} placeholder="Product Designer" required maxLength={100} />
            </label>
            <div className="actions">
                <button className="btn primary" disabled={saving}>
                    {saving ? "Saving…" : editing ? "Save changes" : "Add employee"}
                </button>
                {editing && (
                    <button type="button" className="btn" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
