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
            <div className="position-relative my-4">
                <h1 className="text-center m-0">UBICATIONS</h1>

                <Link to="/ubications/new" className="btn btn-success position-absolute top-50 end-0 translate-middle-y">
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

                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <Link to={`/ubications/${u.id}`} className="btn btn-light">
                                        Ver ficha
                                    </Link>

                                    <Link to={`/ubications/${u.id}/edit`} className="btn btn-light">
                                        Editar
                                    </Link>

                                    <button className="btn btn-danger" onClick={() => deleteUbication(u.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UbicationsPage
