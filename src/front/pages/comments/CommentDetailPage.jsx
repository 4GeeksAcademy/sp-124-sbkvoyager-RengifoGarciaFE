import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CommentDetailPage() {
  const { id } = useParams();
  const [comment, setComment] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}api/comments/${id}`)
      .then(res => res.json())
      .then(setComment);
  }, [id]);

  if (!comment) return <p>Cargando...</p>;

  return (
    <div className="container mt-4">
      <h1>Detalle del Comentario</h1>

      <div className="card mt-4 shadow">
        <div className="card-body">
          <p><strong>Texto:</strong> {comment.text}</p>
          <p><strong>Puntuación:</strong> {comment.puntuacion}</p>

          <Link to="/comments" className="btn btn-secondary mt-3">
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}
