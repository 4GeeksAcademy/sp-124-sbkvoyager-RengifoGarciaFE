import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const UbicationsPage = () => {
    const [ubications, setUbications] = useState([])

    const loadUbications = async () => {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "api/ubications")
        const data = await resp.json()
        setUbications(data)
    }

    const deleteUbication = async (id) => {
        await fetch(
            import.meta.env.VITE_BACKEND_URL + `api/ubications/${id}`,
            { method: "DELETE" }
        )
        loadUbications()
    }

    useEffect(() => {
        loadUbications()
    }, [])

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>UBICATIONS</h1>

                <Link to="/ubications/new" className="btn btn-success">
                    Crear Ubicación
                </Link>
            </div>

            <div className="row">
                {ubications.map(u => (
                    <div key={u.id} className="col-md-4">
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body text-center">
                                <p className="mb-1"><strong>{u.city}</strong></p>
                                <p className="mb-1">{u.country}</p>
                                <p className="mb-3">CP: {u.zip_code}</p>

                                <Link to={`/ubications/${u.id}/edit`} className="btn btn-light me-2">
                                    Editar
                                </Link>

                                <button className="btn btn-danger" onClick={() => deleteUbication(u.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UbicationsPage
