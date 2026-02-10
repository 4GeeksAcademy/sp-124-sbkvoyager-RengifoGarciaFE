import { useEffect, useState } from "react"; 
import { useParams, Link } from "react-router-dom";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const fetchPost = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`);
    const data = await res.json();
    setPost(data);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (!post) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-4">
      <h1>Ficha del Post</h1>

      <div className="card mt-4 shadow">
        <div className="card-body">
          <p><strong>Tipo:</strong> {post.type}</p>
          <p><strong>Fecha del evento:</strong> {post.event_date}</p>
          <p><strong>Horario:</strong> {post.schedule}</p>
          <p><strong>Estilos:</strong> {post.styles}</p>
          <p><strong>Nombre:</strong> {post.name}</p>
          <p><strong>Teléfono de contacto:</strong> {post.contact_number}</p>
          <p><strong>Propietario:</strong> {post.owner_name}</p>
          <p><strong>Descripción:</strong> {post.description}</p>

          <Link to="/posts" className="btn btn-secondary mt-3">
            Volver a Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
