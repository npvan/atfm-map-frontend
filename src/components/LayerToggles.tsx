// src/components/LayerToggles.tsx
import React from "react";

type LayerTogglesProps = {
	toggles: {
		firs: boolean;
		enroute: boolean;
		// tma: boolean;
		airports: boolean;
		ats: boolean;
		sids: boolean;
		stars: boolean;
	};
	onToggle: (layer: keyof LayerTogglesProps["toggles"]) => void;
};

const LayerToggles: React.FC<LayerTogglesProps> = ({ toggles, onToggle }) => {
	return (
		<div
			style={{
				padding: "1rem",
				background: "#f4f4f4",
				width: "200px",
				color: "#000000",
			}}
		>
			<h4>Layers</h4>
			{Object.entries(toggles).map(([key, value]) => (
				<div key={key}>
					<label>
						<input
							type="checkbox"
							checked={value}
							onChange={() =>
								onToggle(
									key as keyof LayerTogglesProps["toggles"]
								)
							}
						/>
						{" " + key.charAt(0).toUpperCase() + key.slice(1)}
					</label>
				</div>
			))}
		</div>
	);
};

export default LayerToggles;
