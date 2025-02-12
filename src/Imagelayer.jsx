import React from "react";
import yes1 from "./assets/yes/yes1.gif";
import yes2 from "./assets/yes/yes2.gif";
import yes3 from "./assets/yes/yes3.gif";
import yes4 from "./assets/yes/yes4.gif";
import yes5 from "./assets/yes/yes5.gif";
import yes6 from "./assets/yes/yes6.gif";
import yes7 from "./assets/yes/yes7.webp";
import yes8 from "./assets/yes/yes8.gif";
import yes9 from "./assets/yes/yes9.gif";

export function ImageLayer() {
	const images = [yes1, yes2, yes3, yes4, yes5, yes6, yes7, yes8, yes9];

	// Define grid size
	const rows = 3;
	const cols = 3;
	const cellWidth = 100 / cols; // Percentage width
	const cellHeight = 100 / rows; // Percentage height

	// Shuffle images to randomize positions
	const shuffledImages = images.sort(() => Math.random() - 0.5);

	return (
		<div className="fixed inset-0 grid grid-cols-3 grid-rows-3">
			{shuffledImages.map((imgSrc, index) => {
				const row = Math.floor(index / cols);
				const col = index % cols;

				return (
					<img
						key={index}
						src={imgSrc}
						alt={`Grid Image ${index + 1}`}
						className="absolute"
						style={{
							top: `${row * cellHeight}%`,
							left: `${col * cellWidth}%`,
							width: `${cellWidth}%`,
							height: `${cellHeight}%`,
							objectFit: "cover", // Ensure images fill their sections
						}}
					/>
				);
			})}
		</div>
	);
}
