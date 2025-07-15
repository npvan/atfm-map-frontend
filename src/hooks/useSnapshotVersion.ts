import { useEffect, useState } from "react";

type SnapshotVersion = {
	id: number;
	created_at: string;
};

export default function useSnapshotVersions() {
	const [data, setData] = useState<SnapshotVersion[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		fetch("http://localhost:8000/api/v1/snapshot_versions")
			.then((res) => {
				if (!res.ok)
					throw new Error("Failed to fetch snapshot versions");
				return res.json();
			})
			.then(setData)
			.catch(setError)
			.finally(() => setLoading(false));
	}, []);

	return { data, loading, error };
}
