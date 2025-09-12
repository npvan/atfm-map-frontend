import { useState } from "react";
import MapView from "./components/MapView";
import LayerToggles from "./components/LayerToggles";

function App() {
	const [layerToggles, setLayerToggles] = useState({
		firs: true,
		enroute: false,
		// tma: false,
		airports: true,
		ats: false,
		sids: false,
		stars: false,
	});

	const [selectedFirId, setSelectedFirId] = useState<number | null>(null);
	// const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
	// 	null
	// );

	// const { data: firData } = useFirs();
	// const { data: versionData = [] } = useSnapshotVersions();

	const handleToggle = (layer: keyof typeof layerToggles) => {
		setLayerToggles((prev) => ({
			...prev,
			[layer]: !prev[layer],
		}));
	};

	// const firList = firData?.features.map((f) => f.properties) ?? [];

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<div
				style={{
					width: "220px",
					background: "#f4f4f4",
					padding: "1rem",
				}}
			>
				{/* <FilterControls
					firs={firList}
					versions={versionData ?? []}
					selectedFirId={selectedFirId}
					selectedVersionId={selectedVersionId}
					onFirChange={setSelectedFirId}
					onVersionChange={setSelectedVersionId}
				/> */}
				<LayerToggles toggles={layerToggles} onToggle={handleToggle} />
			</div>
			<div style={{ flex: 1 }}>
				<MapView
					visibleLayers={layerToggles}
					selectedFirId={selectedFirId}
					setSelectedFirId={setSelectedFirId}
				/>
			</div>
		</div>
	);
}

export default App;
