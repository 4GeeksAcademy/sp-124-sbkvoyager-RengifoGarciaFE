import { useState } from "react";

export default function AdminUserForm({ adminUser, onClose, onUpdated }) {
  const [form, setForm] = useState(adminUser || { email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAdmin = async () => {
    const url = adminUser.id
      ? `${import.meta.env.VITE_BACKEND_URL}/api/admin-user/${adminUser.id}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/admin-user`;

    const method = adminUser.id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">
              {adminUser.id ? "Editar Admin" : "Crear Admin"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {!adminUser.id && (
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={saveAdmin}>
              {adminUser.id ? "Guardar Cambios" : "Crear Admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}