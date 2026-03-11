import { useEffect, useState } from "react";

export default function ProtectedPage() {
	const [data, setData] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("jwt-token");

		if (!token) {
			setError("No token found");
			return;
		}

		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token
			}
		})
			.then(async (resp) => {
				const result = await resp.json();
				if (!resp.ok) throw new Error(result.msg || "Error");
				setData(result);
			})
			.catch((err) => setError(err.message));
	}, []);

	return (
		<div className="container mt-5">
			<h2>Protected Page</h2>

			{error && <div className="alert alert-danger">{error}</div>}

			{data && (
				<div className="card p-3 mt-3">
					<p><strong>ID:</strong> {data.id}</p>
					<p><strong>Nickname:</strong> {data.nickname}</p>
					<p><strong>Email:</strong> {data.email}</p>
				</div>
			)}
		</div>
	);
}