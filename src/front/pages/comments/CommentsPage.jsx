import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CommentsPage() {
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    const fetchComments = async () => {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/comments`
        );
        const data = await res.json();
        setComments(data);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const deleteComment = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este comentario?")) return;

        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`,
            { method: "DELETE" }
        );

        if (res.ok) {
            fetchComments();
        }
    };

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="position-relative my-4">
                <h1 className="text-center m-0">COMMENTS</h1>

                <button
                    className="btn btn-info position-absolute top-50 end-0 translate-middle-y"
                    onClick={() => navigate("/comments/new")}
                >
                    Crear Comentario
                </button>
            </div>

            {/* Listado */}
            <div className="row">
                {comments.map((c) => (
                    <div key={c.id} className="col-md-4">
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <p className="card-text text-center fw-bold">
                                    {c.texto}
                                </p>

                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <Link
                                        to={`/comments/${c.id}`}
                                        className="btn btn-light"
                                    >
                                        Ver ficha
                                    </Link>

                                    <button
                                        className="btn btn-light"
                                        onClick={() =>
                                            navigate(`/comments/${c.id}/edit`)
                                        }
                                    >
                                        Editar
                                    </button>

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
                        No hay comentarios creados
                    </p>
                )}
            </div>

            <div className="text-center mt-4 mb-5">
                <Link to="/" className="btn btn-secondary btn-lg">
                    Volver a inicio
                </Link>
            </div>
        </div>
    );
}
