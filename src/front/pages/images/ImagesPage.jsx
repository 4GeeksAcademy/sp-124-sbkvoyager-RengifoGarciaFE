import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ImagesPage() {
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    const fetchImages = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/images-post`);
        const data = await res.json();
        setImages(data);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const deleteImage = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta imagen?")) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/images-post/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            fetchImages();
        }
    };

    return (
        <div className="container mt-4">
            <div className="position-relative my-4">
                <h1 className="text-center m-0">IMÁGENES</h1>

                <button
                    className="btn btn-success position-absolute top-50 end-0 translate-middle-y"
                    onClick={() => navigate("/images-post/new")}
                >
                    Crear Imagen
                </button>
            </div>

            <div className="row">
                {images.map((img) => (
                    <div key={img.id} className="col-md-4">
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body text-center">
                                <img src={img.url} alt={`Image ${img.id}`} className="img-fluid mb-2" />

                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <button
                                        className="btn btn-light"
                                        onClick={() => navigate(`/images-post/${img.id}`)}
                                    >
                                        Ver ficha
                                    </button>

                                    <button
                                        className="btn btn-light"
                                        onClick={() => navigate(`/images-post/${img.id}/edit`)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteImage(img.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {images.length === 0 && (
                    <p className="text-center mt-5 text-muted">
                        No hay imágenes creadas
                    </p>
                )}
            </div>

            <div className="text-center mt-4 mb-5">
                <button className="btn btn-secondary btn-lg" onClick={() => navigate("/")}>
                    Volver a inicio
                </button>
            </div>
        </div>
    );
}
