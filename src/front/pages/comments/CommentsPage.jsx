import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const fetchComments = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}api/comments`
    );
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const deleteComment = async (id) => {
    if (!window.confirm("¿Eliminar comentario?")) return;

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}api/comments/${id}`,
      { method: "DELETE" }
    );

    if (res.ok) fetchComments();
  };

  return (
    <div className="container mt-4">
      <div className="position-relative my-4">
        <h1 className="text-center m-0">COMMENTS</h1>

        <button
          className="btn btn-success position-absolute top-50 end-0 translate-middle-y"
          onClick={() => navigate("/comments/new")}
        >
          Crear comentario
        </button>
      </div>

      <div className="row">
        {comments.map((c) => (
          <div key={c.id} className="col-md-4">
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <p className="fw-bold text-center">{c.text}</p>
                <p className="text-center">⭐ {c.puntuacion}</p>

                <div className="d-flex justify-content-center gap-2">
                  <Link to={`/comments/${c.id}`} className="btn btn-light">
                    Ver
                  </Link>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteComment(c.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center mt-5 text-muted">
            No hay comentarios
          </p>
        )}
      </div>
    </div>
  );
}
