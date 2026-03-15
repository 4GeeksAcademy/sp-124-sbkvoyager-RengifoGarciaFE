import { useState } from "react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/token`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});

			const data = await resp.json();

			if (!resp.ok) {
				setError(data.msg || "Login failed");
				return;
			}

			localStorage.setItem("jwt-token", data.token);
			navigate("/profile");
		} catch (err) {
			setError("Server error");
		}
	};

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<h2 className="mb-4">Login</h2>

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

				<button type="submit" className="btn btn-primary w-100">
					Entrar
				</button>
			</form>
		</div>
	);
}