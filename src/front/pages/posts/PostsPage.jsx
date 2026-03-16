import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [postImages, setPostImages] = useState({});
    const [search, setSearch] = useState("");
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
                    const imgRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${post.id}/images`);
                    const imgData = await imgRes.json();

                    if (Array.isArray(imgData) && imgData.length > 0) {
                        imagesMap[post.id] = imgData[0].url;
                    }
                } catch (error) {
                    console.error(error);
                }
            })
        );
        setPostImages(imagesMap);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const deletePost = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este evento?")) return;
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
            alert(data.msg || "No se pudo eliminar el evento");
        }
    };

    const filteredPosts = posts.filter((post) => {
        const city = post.ubication?.city?.toLowerCase() || "";
        const name = post.name?.toLowerCase() || "";
        const styles = post.styles?.toLowerCase() || "";
        const type = post.type?.toLowerCase() || "";
        const query = search.toLowerCase();
        return (
            city.includes(query) ||
            name.includes(query) ||
            styles.includes(query) ||
            type.includes(query)
        );
    });

    return (
        <div className="container mt-4">
            <div className="my-4">
                <h1 className="text-center mb-4">Explorar eventos</h1>
                <div className="row justify-content-center mb-4">
                    <div className="col-md-6">
                        <input type="text" className="form-control search-input-custom" placeholder="Buscar por ciudad, nombre, estilo o tipo..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                </div>

                {userToken && (
                    <div className="text-center mb-4">
                        <button className="btn btn-danger" onClick={() => navigate("/posts/new")}>
                            Publicar evento
                        </button>
                    </div>
                )}
            </div>

            <div className="row">
                {filteredPosts.map((p) => (
                    <div key={p.id} className="col-md-4">
                        <div className="card mb-4 shadow-sm h-100 border-0 overflow-hidden">
                            <img src={postImages[p.id] || placeholderImage} alt={p.name} className="card-img-top" style={{ height: "220px", objectFit: "cover" }}/>
                            <div className="card-body d-flex flex-column">
                                <span className="badge bg-danger mb-2 align-self-start">
                                    {p.type}
                                </span>
                                <h5 className="fw-bold">{p.name}</h5>
                                <p className="text-muted mb-1">
                                    {p.ubication?.city}, {p.ubication?.country}
                                </p>
                                <p className="mb-1">
                                    <strong>Estilos:</strong> {p.styles}
                                </p>
                                <p className="mb-3">
                                    <strong>Fecha:</strong> {p.event_date}
                                </p>
                                <div className="d-flex justify-content-between align-items-center mt-auto flex-wrap gap-2">
                                    <Link to={`/posts/${p.id}`} className="btn btn-danger mt-auto">
                                        ¡Ver más!
                                    </Link>
                                    {adminToken && (
                                        <button className="btn btn-danger" onClick={() => deletePost(p.id)}>
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredPosts.length === 0 && (
                    <p className="text-center mt-5 text-muted"> No hay resultados para esa búsqueda </p>
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