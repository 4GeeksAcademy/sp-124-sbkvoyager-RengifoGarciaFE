import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const adminToken = localStorage.getItem("admin-token");
    const userToken = localStorage.getItem("jwt-token");

    const fetchPosts = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts`);
        const data = await res.json();
        setPosts(data);
    };

    const fetchCurrentUser = async () => {
        if (!userToken) {
            setCurrentUser(null);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/me`, {
                headers: {
                    Authorization: "Bearer " + userToken
                }
            });

            if (!res.ok) {
                setCurrentUser(null);
                return;
            }

            const data = await res.json();
            setCurrentUser(data);
        } catch (error) {
            setCurrentUser(null);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchCurrentUser();
    }, []);

    const deletePost = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este post?")) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + adminToken
            }
        });

        if (res.ok) {
            fetchPosts();
        } else {
            const data = await res.json();
            alert(data.msg || "No se pudo eliminar el post");
        }
    };

    const canEditPost = (post) => {
        if (adminToken) return true;

        if (!currentUser) return false;

        if (post.user && post.user.id) {
            return currentUser.id === post.user.id;
        }

        if (post.user_id) {
            return currentUser.id === post.user_id;
        }

        return false;
    };

    return (
        <div className="container mt-4">
            <div className="position-relative my-4">
                <h1 className="text-center m-0">POSTS</h1>

                {userToken && (
                    <button
                        className="btn btn-success position-absolute top-50 end-0 translate-middle-y"
                        onClick={() => navigate("/posts/new")}
                    >
                        Crear Post
                    </button>
                )}
            </div>

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

                                    {canEditPost(p) && (
                                        <button
                                            className="btn btn-light"
                                            onClick={() => navigate(`/posts/${p.id}/edit`)}
                                        >
                                            Editar
                                        </button>
                                    )}

                                    {adminToken && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deletePost(p.id)}
                                        >
                                            Eliminar
                                        </button>
                                    )}
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