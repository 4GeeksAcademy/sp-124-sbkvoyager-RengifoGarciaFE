import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CommentFormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    text: "",
    puntuation: 1,
    post_id: "",
    user_id: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_BACKEND_URL}api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    navigate("/comments");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Crear Comentario</h1>

      <form className="card p-4 shadow mx-auto"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        <textarea
          className="form-control mb-3"
          name="text"
          placeholder="Comentario"
          value={form.text}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          min="1"
          max="5"
          className="form-control mb-3"
          name="puntuation"
          value={form.puntuation}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="post_id"
          placeholder="Post ID"
          value={form.post_id}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="user_id"
          placeholder="User ID"
          value={form.user_id}
          onChange={handleChange}
          required
        />

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary"
            onClick={() => navigate("/comments")}
          >
            Cancelar
          </button>

          <button type="submit" className="btn btn-warning">
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
