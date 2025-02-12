import { AskOut } from "./AskOut";
import { ImageLayer } from "./Imagelayer";
import { useState } from "react";
function App() {
	const [isYes, setYes] = useState(false);

	return (
		<>
			{!isYes && <AskOut setYes={setYes} />}
			{isYes && <ImageLayer />}
		</>
	);
}

export default App;
