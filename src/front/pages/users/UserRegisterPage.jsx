import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
	const navigate = useNavigate();
	const [ubications, setUbications] = useState([]);
	const [error, setError] = useState("");

	const [form, setForm] = useState({
		nickname: "",
		email: "",
		password: "",
		name: "",
		surname: "",
		birthdate: "",
		is_professional_dancer: false,
		ubication_id: ""
	});

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_URL}api/ubications`)
			.then(res => res.json())
			.then(data => setUbications(data))
			.catch(err => console.error(err));
	}, []);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm({
			...form,
			[name]: type === "checkbox" ? checked : value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/users`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...form,
					ubication_id: Number(form.ubication_id)
				})
			});

			const data = await resp.json();

			if (!resp.ok) {
				setError(data.msg || "No se pudo registrar el usuario");
				return;
			}

			alert("Cuenta creada correctamente");
			navigate("/login");
		} catch (err) {
			setError("Error del servidor");
		}
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-lg-6">
					<div className="card shadow border-0">
						<div className="card-body p-4">
							<h2 className="mb-4">Crear cuenta</h2>

							<form onSubmit={handleSubmit}>
								<input
									className="form-control mb-3"
									name="nickname"
									placeholder="Nickname"
									value={form.nickname}
									onChange={handleChange}
									required
								/>

								<input
									type="email"
									className="form-control mb-3"
									name="email"
									placeholder="Email"
									value={form.email}
									onChange={handleChange}
									required
								/>

								<input
									type="password"
									className="form-control mb-3"
									name="password"
									placeholder="Password"
									value={form.password}
									onChange={handleChange}
									required
								/>

								<input
									className="form-control mb-3"
									name="name"
									placeholder="Nombre"
									value={form.name}
									onChange={handleChange}
									required
								/>

								<input
									className="form-control mb-3"
									name="surname"
									placeholder="Apellido"
									value={form.surname}
									onChange={handleChange}
									required
								/>

								<input
									type="date"
									className="form-control mb-3"
									name="birthdate"
									value={form.birthdate}
									onChange={handleChange}
									required
								/>

								<select className="form-select mb-3" name="ubication_id" value={form.ubication_id} onChange={handleChange} required>
									<option value="">Selecciona una ubicación</option>

									{ubications.map((u) => (
										<option key={u.id} value={u.id}>
											{u.city} ({u.country}) - {u.street} {u.number}
										</option>
									))}
								</select>

								<div className="mb-3">
								<small>
									¿No encuentras tu ubicación?{" "}
										<Link to="/ubications/new" state={{ from: "/register" }}>
											Crear nueva ubicación
										</Link>
								</small>
								</div>

								<div className="form-check mb-3">
									<input
										type="checkbox"
										className="form-check-input"
										name="is_professional_dancer"
										checked={form.is_professional_dancer}
										onChange={handleChange}
										id="isProfessional"
									/>
									<label className="form-check-label" htmlFor="isProfessional">
										Soy bailarín/a profesional
									</label>
								</div>

								{error && <div className="alert alert-danger">{error}</div>}

								<button className="btn btn-primary w-100" type="submit">
									Registrarse
								</button>
							</form>

							<div className="mt-3 text-center">
								<small>
									¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
								</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}