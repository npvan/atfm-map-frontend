// src/components/MapView.tsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import enrouteData from "../data/enroute-sectors.json";
import airportData from "../data/airports.json";
import atsData from "../data/ats-routes.json";
import sidData from "../data/sids.json";
import starData from "../data/stars.json";
import useFirs from "../hooks/useFirs";
import useAirports from "../hooks/useAirports";
import type {
	GeoJsonObject,
	Feature,
	Polygon,
	Point,
	LineString,
} from "geojson";
import L from "leaflet";
import "leaflet-polylinedecorator";
import { useEffect, useRef } from "react";

type MapViewProps = {
	visibleLayers: {
		firs: boolean;
		enroute: boolean;
		tma: boolean;
		airports: boolean;
		ats: boolean;
		sids: boolean;
		stars: boolean;
	};
	selectedFirId: number | null;
	setSelectedFirId: (id: number | null) => void;
};

const defaultStyle = {
	color: "#3388ff",
	weight: 1,
	fillOpacity: 0.01,
};

export default function MapView({
	visibleLayers,
	selectedFirId,
	setSelectedFirId,
}: MapViewProps) {
	const mapRef = useRef<L.Map>(null);
	const decoratorsRef = useRef<L.Layer[]>([]);

	const { data: firData, loading: firLoading, error: firError } = useFirs();
	const {
		data: airportData,
		loading: airportLoading,
		error: airportError,
	} = useAirports(selectedFirId);

	useEffect(() => {
		if (firData) {
			console.log("✅ FIR data received:", firData);
		}
		if (firError) {
			console.error("❌ FIR fetch error:", firError);
		}
	}, [firData, firError]);

	useEffect(() => {
		if (airportData) console.log("✅ Airport data received:", airportData);
		if (airportError) console.error("❌ Airport error:", airportError);
	}, [airportData, airportError]);

	useEffect(() => {
		if (!mapRef.current) return;

		const map = mapRef.current;
		const LPD = L.polylineDecorator;

		decoratorsRef.current.forEach((decorator) => {
			map.removeLayer(decorator);
		});
		decoratorsRef.current = [];

		if (visibleLayers.ats) {
			(atsData.features as Feature<LineString>[]).forEach((feature) => {
				// Fix 1: Properly type the coordinates conversion
				const coords: L.LatLngExpression[] =
					feature.geometry.coordinates.map(
						([lon, lat]) => [lat, lon] as L.LatLngExpression
					);

				const decorator = LPD(L.polyline(coords), {
					patterns: [
						{
							offset: "50%",
							repeat: 0,
							symbol: L.Symbol.arrowHead({
								pixelSize: 8,
								polygon: false,
								pathOptions: { color: "#ff7f0e", weight: 2 },
							}),
						},
					],
				});

				decorator.addTo(map);
				decoratorsRef.current.push(decorator);
			});
		}
	}, [visibleLayers.ats]);

	const onEachFir = (
		feature: Feature<
			Polygon,
			{ name: string; long_name: string; id: number }
		>,
		layer: L.Layer
	) => {
		const { name, long_name, id } = feature.properties;

		layer.bindTooltip(`FIR: ${name}`, {
			direction: "top",
			sticky: true,
			opacity: 0.9,
		});

		layer.on("click", () => {
			setSelectedFirId(id); // <- store selected FIR ID
		});

		layer.on("mouseover", () => {
			(layer as L.Path).setStyle({ color: "orange", weight: 3 });
		});

		layer.on("mouseout", () => {
			(layer as L.Path).setStyle(defaultStyle);
		});
	};

	const onEachSector = (
		feature: Feature<Polygon, { index: string }>,
		layer: L.Layer
	) => {
		const { index } = feature.properties;

		// Attach a Leaflet tooltip
		layer.bindTooltip(`Sector: ${index}`, {
			direction: "top",
			sticky: true,
			opacity: 0.9,
		});

		// Highlight on hover
		layer.on("mouseover", () => {
			(layer as L.Path).setStyle({
				color: "orange",
				weight: 3,
				fillOpacity: 0.5,
			});
		});

		// Reset style on mouseout
		layer.on("mouseout", () => {
			(layer as L.Path).setStyle(defaultStyle);
		});
	};

	const onEachAirport = (
		feature: Feature<
			Point,
			{ name: string; arpt_ident: string; long_name: string }
		>,
		layer: L.Layer
	) => {
		const { name, arpt_ident, long_name } = feature.properties;

		layer.bindTooltip(`${name} (${arpt_ident})\nLong Name: ${long_name}`, {
			direction: "top",
			sticky: true,
			opacity: 0.9,
		});
	};

	const onEachAtsRoute = (
		feature: Feature<LineString, { name: string; direction: string }>,
		layer: L.Layer
	) => {
		const { name, direction } = feature.properties;

		layer.bindTooltip(`ATS Route: ${name} [${direction}]`, {
			direction: "center",
			sticky: true,
			opacity: 0.9,
		});
	};

	const onEachSid = (
		feature: Feature<LineString, { name: string }>,
		layer: L.Layer
	) => {
		const { name } = feature.properties;

		layer.bindTooltip(`SID: ${name}`, {
			direction: "top",
			sticky: true,
			opacity: 0.9,
		});

		layer.on("mouseover", () => {
			(layer as L.Path).setStyle({
				color: "purple",
				weight: 3,
				opacity: 1,
			});
		});

		layer.on("mouseout", () => {
			(layer as L.Path).setStyle({
				color: "#6e2ca9",
				weight: 2,
				opacity: 0.8,
			});
		});
	};

	const onEachStar = (
		feature: Feature<LineString, { name: string }>,
		layer: L.Layer
	) => {
		const { name } = feature.properties;

		layer.bindTooltip(`STAR: ${name}`, {
			direction: "top",
			sticky: true,
			opacity: 0.9,
		});

		layer.on("mouseover", () => {
			(layer as L.Path).setStyle({
				color: "pink",
				weight: 3,
				opacity: 1,
			});
		});

		layer.on("mouseout", () => {
			(layer as L.Path).setStyle({
				color: "#ed3ee7",
				weight: 2,
				opacity: 0.8,
			});
		});
	};

	return (
		<MapContainer
			ref={mapRef}
			center={[1.352083, 103.819836]}
			zoom={6}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://carto.com/">CARTO</a>'
				url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
			/>

			{visibleLayers.firs && firData && (
				<GeoJSON
					data={firData}
					onEachFeature={onEachFir}
					style={() => ({
						color: "#14c2d2",
						weight: 1,
						fillOpacity: 0.1,
					})}
				/>
			)}

			{visibleLayers.enroute && (
				<GeoJSON
					data={enrouteData as GeoJsonObject}
					onEachFeature={onEachSector}
					style={defaultStyle}
				/>
			)}

			{visibleLayers.airports && airportData && (
				<GeoJSON
					key={`airports-${selectedFirId ?? "all"}`}
					data={airportData}
					onEachFeature={onEachAirport}
					pointToLayer={(_feature, latlng) => {
						return L.circleMarker(latlng, {
							radius: 6,
							fillColor: "#285afc",
							color: "#030d05",
							weight: 1,
							opacity: 1,
							fillOpacity: 0.8,
						});
					}}
				/>
			)}

			{visibleLayers.ats && (
				<GeoJSON
					data={atsData as GeoJsonObject}
					onEachFeature={onEachAtsRoute}
					style={() => ({
						color: "#ff7f0e", // Orange for visibility
						weight: 2,
						opacity: 0.9,
					})}
				/>
			)}

			{visibleLayers.sids && (
				<GeoJSON
					data={sidData as GeoJsonObject}
					onEachFeature={onEachSid}
					style={() => ({
						color: "#6e2ca9",
						weight: 2,
						opacity: 0.8,
					})}
				/>
			)}

			{visibleLayers.stars && (
				<GeoJSON
					data={starData as GeoJsonObject}
					onEachFeature={onEachStar}
					style={() => ({
						color: "#ed3ee7",
						weight: 2,
						opacity: 0.8,
					})}
				/>
			)}
		</MapContainer>
	);
}
