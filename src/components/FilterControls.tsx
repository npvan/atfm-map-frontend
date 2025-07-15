// src/components/FilterControls.tsx
import React from "react";

type FilterControlsProps = {
	firs: { id: number; long_name: string; name: string }[];
	versions: { id: number; created_at: string }[];
	selectedFirId: number | null;
	selectedVersionId: number | null;
	onFirChange: (id: number) => void;
	onVersionChange: (id: number) => void;
};

const FilterControls: React.FC<FilterControlsProps> = ({
	firs,
	versions,
	selectedFirId,
	selectedVersionId,
	onFirChange,
	onVersionChange,
}) => {
	return (
		<div style={{ marginBottom: "1rem", color: "black" }}>
			<label>FIR:</label>
			<select
				value={selectedFirId ?? ""}
				onChange={(e) => onFirChange(Number(e.target.value))}
				style={{
					display: "block",
					width: "100%",
					marginBottom: "0.5rem",
				}}
			>
				<option value="">-- Select FIR --</option>
				{firs.map((fir) => (
					<option key={fir.id} value={fir.id}>
						{fir.long_name}
					</option>
				))}
			</select>

			<label>Snapshot Version:</label>
			<select
				value={selectedVersionId ?? ""}
				onChange={(e) => onVersionChange(Number(e.target.value))}
				style={{ display: "block", width: "100%" }}
			>
				<option value="">-- Select Version --</option>
				{versions.map((v) => (
					<option key={v.id} value={v.id}>
						{v.id}
					</option>
				))}
			</select>
		</div>
	);
};

export default FilterControls;
