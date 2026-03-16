import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");
		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/reset-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					email,
					new_password: newPassword
				})
			});

			const data = await resp.json();
			if (!resp.ok) {
				setError(data.msg || "No se pudo restablecer la contraseña");
				return;
			}
			setMessage("Contraseña actualizada correctamente");
			setTimeout(() => {
				navigate("/login");
			}, 1500);
		} catch (err) {
			setError("Error del servidor");
		}
	};

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<div className="card shadow border-0">
				<div className="card-body p-4">
					<h2 className="mb-4">Restablecer contraseña</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
						</div>
						<div className="mb-3">
							<label className="form-label">Nueva contraseña</label>
							<input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
						</div>
						{message && <div className="alert alert-success">{message}</div>}
						{error && <div className="alert alert-danger">{error}</div>}
						<button type="submit" className="btn btn-primary w-100">
							Actualizar contraseña
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}