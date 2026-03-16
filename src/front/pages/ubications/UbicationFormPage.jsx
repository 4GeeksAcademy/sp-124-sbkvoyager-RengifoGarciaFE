import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function UbicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);

  const returnTo = location.state?.from || "/ubications";

  const [formData, setFormData] = useState({
    country: "",
    city: "",
    zip_code: "",
    street: "",
    number: ""
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}api/ubications/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            country: data.country,
            city: data.city,
            zip_code: data.zip_code,
            street: data.street,
            number: data.number
          });
        });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEdit
      ? `${import.meta.env.VITE_BACKEND_URL}api/ubications/${id}`
      : `${import.meta.env.VITE_BACKEND_URL}api/ubications`;

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    navigate(returnTo);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        {isEdit ? "Editar Ubicación" : "Crear Ubicación"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <input
          className="form-control mb-3"
          name="country"
          placeholder="País"
          value={formData.country}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="city"
          placeholder="Ciudad"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="zip_code"
          placeholder="Código Postal"
          value={formData.zip_code}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="street"
          placeholder="Calle"
          value={formData.street}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          name="number"
          placeholder="Número"
          value={formData.number}
          onChange={handleChange}
          required
        />

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(returnTo)}
          >
            Cancelar
          </button>

          <button type="submit" className="btn btn-primary">
            {isEdit ? "Guardar Cambios" : "Crear Ubicación"}
          </button>
        </div>
      </form>
    </div>
  );
}