import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function CommentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState(null);
  const adminToken = localStorage.getItem("admin-token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}api/comments/${id}`)
      .then((res) => res.json())
      .then((data) => setComment(data));
  }, [id]);

  const deleteComment = async () => {
    if (!adminToken) {
      alert("Solo un admin puede eliminar comentarios");
      return;
    }

    if (!window.confirm("¿Eliminar comentario?")) return;

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}api/comments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + adminToken
        }
      }
    );

    if (res.ok) {
      navigate("/comments");
    } else {
      const data = await res.json();
      alert(data.msg || "No se pudo eliminar el comentario");
    }
  };

  if (!comment) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-4">
      <h1>Detalle del Comentario</h1>
      <div className="card mt-4 shadow">
        <div className="card-body">
          <p><strong>Texto:</strong> {comment.text}</p>
          <p><strong>Puntuación:</strong> {comment.puntuation}</p>

          <div className="d-flex gap-2 mt-3 flex-wrap">
            {adminToken && (
              <button className="btn btn-danger" onClick={deleteComment}>
                Eliminar
              </button>
            )}

            <Link to="/comments" className="btn btn-secondary">
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}