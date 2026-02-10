import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts`);
        const data = await res.json();
        setPosts(data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const deletePost = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este post?")) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            fetchPosts();
        }
    };

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="position-relative my-4">
                <h1 className="text-center m-0">POSTS</h1>

                <button
                    className="btn btn-success position-absolute top-50 end-0 translate-middle-y"
                    onClick={() => navigate("/posts/new")}
                >
                    Crear Post
                </button>
            </div>

            {/* Listado */}
            <div className="row">
                {posts.map((p) => (
                    <div key={p.id} className="col-md-4">
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <p className="card-text text-center fw-bold">
                                    {p.name}
                                </p>

                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <Link
                                        to={`/posts/${p.id}`}
                                        className="btn btn-light"
                                    >
                                        Ver ficha
                                    </Link>

                                    <button
                                        className="btn btn-light"
                                        onClick={() =>
                                            navigate(`/posts/${p.id}/edit`)
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deletePost(p.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <p className="text-center mt-5 text-muted">
                        No hay posts creados
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
