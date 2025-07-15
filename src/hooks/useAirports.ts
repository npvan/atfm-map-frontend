import { useEffect, useState } from "react";

export default function useAirports(firId: number | null) {
	const [data, setData] = useState<GeoJSON.FeatureCollection | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		setLoading(true);
		let url = "http://localhost:8000/api/v1/airports";
		if (firId) url += `?fir_id=${firId}`;

		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch airports");
				return res.json();
			})
			.then(setData)
			.catch(setError)
			.finally(() => setLoading(false));
	}, [firId]);

	return { data, loading, error };
}