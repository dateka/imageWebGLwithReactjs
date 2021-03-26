import React from "react";
import ShaderCanvas from "./ShaderCanvas";
import * as filters from "./filterShaders";
import "./styles.css";
import image from "./intro.jpg";

// this is our render pipeline in order.
const shaders = [
	filters.textureShader,
	filters.saturation,
	filters.brightnessContrast,
	filters.vibrance,
	filters.sharpen,
	filters.exposure,
	filters.denoise,
	filters.opacity
];

export default function App() {
	const [saturation, setSaturation] = React.useState(0);
	const [brightness, setBrightness] = React.useState(0);
	const [contrast, setContrast] = React.useState(0);
	const [vibrance, setVibrance] = React.useState(0);
	const [sharpen, setSharpen] = React.useState(0);
	const [exposure, setExposure] = React.useState(0);
	const [denoise, setDenoise] = React.useState(0);
	const [opacity, setOpacity] = React.useState(0);
	const [texture, setTexture] = React.useState(null);

	React.useEffect(() => {
		const defaultTexture = new Image();
		defaultTexture.src = image;
		defaultTexture.onload = () => {
			setTexture(defaultTexture);
		};
	}, []);
	return (
		<div className="App">
			<ShaderCanvas
				width={600} // see for set with and height with %
				height={600}
				uniforms={[
					null, // texture shader
					{ saturation },
					{ brightness, contrast },
					{ vibrance },
					{ sharpen },
					{ exposure },
					{ denoise },
					{ opacity }
				]}
				renderLoop={false}
				texture={texture}
				fragmentShaders={shaders}
			/>
			<div style={{ display: "flex", margin: "6px" }}>
				<div>
					<div>Saturation: {saturation}</div>
					<input
						type="range"
						min="-1"
						max="1"
						step="0.1"
						onInput={(e) => setSaturation(e.target.value)}
						value={saturation}
					/>
				</div>
				<div>
					<div>Opacity : {opacity}</div>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						onInput={(e) => setOpacity(e.target.value)}
						value={opacity}
					/>
				</div>
				<div>
					<div>Brightness: {brightness}</div>
					<input
						type="range"
						min="-1"
						max="1"
						step="0.1"
						onInput={(e) => setBrightness(e.target.value)}
						value={brightness}
					/>
				</div>
				<div>
					<div>Contrast: {contrast}</div>
					<input
						type="range"
						min="-1"
						max="1"
						step="0.1"
						onInput={(e) => setContrast(e.target.value)}
						value={contrast}
					/>
				</div>
			</div>
			<div style={{ display: "flex", margin: "6px" }}>
				<div>
					<div>Vibrance: {vibrance}</div>
					<input
						type="range"
						min="-1"
						max="1"
						step="0.1"
						onInput={(e) => setVibrance(e.target.value)}
						value={vibrance}
					/>
				</div>
				<div>
					<div>Sharpen: {sharpen}</div>
					<input
						type="range"
						min="0"
						max="5"
						step="0.1"
						onInput={(e) => setSharpen(e.target.value)}
						value={sharpen}
					/>
				</div>
				<div>
					<div>Exposure: {exposure}</div>
					<input
						type="range"
						min="-1"
						max="1"
						step="0.1"
						onInput={(e) => setExposure(e.target.value)}
						value={exposure}
					/>
				</div>
				<div>
					<div>Denoise: {denoise}</div>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						onInput={(e) => setDenoise(e.target.value)}
						value={denoise}
					/>
				</div>
			</div>
		</div>
	);
}
