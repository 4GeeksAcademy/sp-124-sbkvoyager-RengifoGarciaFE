import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CommentDetailPage() {
    const { id } = useParams();
    const [comment, setComment] = useState(null);

    const fetchComment = async () => {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`
        );
        const data = await res.json();
        setComment(data);
    };

    useEffect(() => {
        fetchComment();
    }, []);

    if (!comment) return <p className="text-center mt-5">Cargando...</p>;

    return (
        <div className="container mt-4">
            <h1>Ficha del Comentario</h1>

            <div className="card mt-4 shadow">
                <div className="card-body">
                    <p><strong>Texto:</strong> {comment.texto}</p>
                    <p><strong>Puntuación:</strong> {comment.puntuacion}</p>

                    <Link to="/comments" className="btn btn-secondary mt-3">
                        Volver a Comments
                    </Link>
                </div>
            </div>
        </div>
    );
}
