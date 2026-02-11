import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ImageDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}api/images-post/${id}`)
            .then(res => res.json())
            .then(data => setImage(data));
    }, [id]);

    if (!image) return <p className="text-center mt-5">Cargando...</p>;

    return (
        <div className="container mt-4">
            <h1>Ficha de Imagen</h1>

            <div className="card mt-4 shadow text-center">
                <div className="card-body">
                    <img src={image.url} alt={`Image ${image.id}`} className="img-fluid mb-3" />
                    <p><strong>ID:</strong> {image.id}</p>
                    <p><strong>URL:</strong> {image.url}</p>

                    <button
                        className="btn btn-secondary mt-3"
                        onClick={() => navigate("/images-post")}
                    >
                        Volver a Imágenes
                    </button>
                </div>
            </div>
        </div>
    );
}
