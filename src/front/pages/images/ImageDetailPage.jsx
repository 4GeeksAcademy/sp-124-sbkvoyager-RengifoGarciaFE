import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ImageDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const adminToken = localStorage.getItem("admin-token");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}api/images-post/${id}`)
            .then(res => res.json())
            .then(data => setImage(data));
    }, [id]);

    const deleteImage = async () => {
        if (!adminToken) {
            alert("Solo un admin puede eliminar imágenes");
            return;
        }
        if (!window.confirm("¿Seguro que quieres eliminar esta imagen?")) return;
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/images-post/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + adminToken
            }
        });

        if (res.ok) {
            navigate("/images-post");
        } else {
            const data = await res.json();
            alert(data.msg || "No se pudo eliminar la imagen");
        }
    };

    if (!image) return <p className="text-center mt-5">Cargando...</p>;

    return (
        <div className="container mt-4">
            <h1>Ficha de Imagen</h1>
            <div className="card mt-4 shadow text-center">
                <div className="card-body">
                    <img src={image.url} alt={`Image ${image.id}`} className="img-fluid mb-3 rounded" style={{ maxHeight: "400px", objectFit: "cover" }}/>
                    <p><strong>ID:</strong> {image.id}</p>
                    <p><strong>URL:</strong> {image.url}</p>
                    <p><strong>Post:</strong> {image.post?.name}</p>

                    <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
                        {adminToken && (
                            <>
                                <button className="btn btn-outline-primary" onClick={() => navigate(`/images-post/${image.id}/edit`)}>
                                    Editar
                                </button>

                                <button className="btn btn-danger" onClick={deleteImage}>
                                    Eliminar
                                </button>
                            </>
                        )}

                        <button className="btn btn-secondary" onClick={() => navigate("/images-post")}>
                            Volver a Imágenes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}