import { useEffect, useState } from "react";
import type { FeatureCollection, Polygon } from "geojson";

export default function useFirs() {
	const [data, setData] = useState<FeatureCollection<
		Polygon,
		{ id: number; name: string; long_name: string }
	> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		fetch("http://localhost:8000/api/v1/firs")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch FIRs");
				return res.json();
			})
			.then((json) => setData(json))
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, []);

	return { data, loading, error };
}
