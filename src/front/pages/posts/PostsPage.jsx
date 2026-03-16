import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [postImages, setPostImages] = useState({});
    const navigate = useNavigate();

    const adminToken = localStorage.getItem("admin-token");
    const userToken = localStorage.getItem("jwt-token");

    const placeholderImage =
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

    const fetchPosts = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts`);
        const data = await res.json();
        setPosts(data);

        const imagesMap = {};

        await Promise.all(
            data.map(async (post) => {
                try {
                    const imgRes = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}api/posts/${post.id}/images`
                    );
                    const imgData = await imgRes.json();

                    if (Array.isArray(imgData) && imgData.length > 0) {
                        imagesMap[post.id] = imgData[0].url;
                    }
                } catch (error) {
                    console.error("Error loading post image", error);
                }
            })
        );

        setPostImages(imagesMap);
    };

    useEffect(() => {
        fetchPosts();
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
                        <div className="card mb-3 shadow-sm h-100">
                            <img
                                src={postImages[p.id] || placeholderImage}
                                alt={p.name}
                                className="card-img-top"
                                style={{ height: "220px", objectFit: "cover" }}
                            />

                            <div className="card-body d-flex flex-column">
                                <p className="card-text text-center fw-bold mb-2">
                                    {p.name}
                                </p>

                                <p className="text-center text-muted small mb-2">
                                    {p.type}
                                </p>

                                <p className="text-center small mb-3">
                                    {p.styles}
                                </p>

                                <div className="d-flex justify-content-center gap-2 flex-wrap mt-auto">
                                    <Link
                                        to={`/posts/${p.id}`}
                                        className="btn btn-light"
                                    >
                                        Ver ficha
                                    </Link>

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