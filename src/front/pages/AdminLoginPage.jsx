import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/admin-token`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});

			const data = await resp.json();

			if (!resp.ok) {
				setError(data.msg || "Admin login failed");
				return;
			}

			localStorage.removeItem("jwt-token");
            localStorage.setItem("admin-token", data.token);
            window.dispatchEvent(new Event("auth-changed"));
            navigate("/admin-panel");
		} catch (err) {
			setError("Server error");
		}
	};

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<div className="card shadow border-0">
				<div className="card-body p-4">
					<h2 className="mb-4">Admin Login</h2>

					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input
								type="email"
								className="form-control"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Password</label>
							<input
								type="password"
								className="form-control"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						{error && <div className="alert alert-danger">{error}</div>}

						<button type="submit" className="btn btn-warning w-100">
							Entrar como admin
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}