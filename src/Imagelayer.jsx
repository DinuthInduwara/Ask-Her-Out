import { useState, useEffect, useMemo } from "react";
import yes1 from "./assets/yes/yes1.gif";
import yes2 from "./assets/yes/yes2.gif";
import yes3 from "./assets/yes/yes3.gif";
import yes4 from "./assets/yes/yes4.gif";
import yes5 from "./assets/yes/yes5.gif";
import yes6 from "./assets/yes/yes6.gif";
import yes7 from "./assets/yes/yes7.webp";
import yes8 from "./assets/yes/yes8.gif";
import yes9 from "./assets/yes/yes9.gif";

import cat1 from "./assets/cat/cat (1).gif";
import cat2 from "./assets/cat/cat (2).gif";
import cat3 from "./assets/cat/cat (3).gif";
import cat4 from "./assets/cat/cat (4).gif";
import cat5 from "./assets/cat/cat (5).gif";
import cat6 from "./assets/cat/cat (6).gif";
import cat7 from "./assets/cat/cat (7).gif";
import cat8 from "./assets/cat/cat (8).gif";
import cat9 from "./assets/cat/cat (9).gif";
import cat10 from "./assets/cat/cat (10).gif";
import cat11 from "./assets/cat/cat (11).gif";
import cat12 from "./assets/cat/cat (12).gif";
import cat13 from "./assets/cat/cat (13).gif";
import cat14 from "./assets/cat/cat (14).gif";
import cat15 from "./assets/cat/cat (15).gif";
import cat16 from "./assets/cat/cat (16).gif";
import cat17 from "./assets/cat/cat (17).gif";
import cat18 from "./assets/cat/cat (18).gif";
import cat19 from "./assets/cat/cat (19).gif";

export function ImageLayer() {
	// Array of reusable images
	const images = useMemo(
		() => [
			yes1,
			yes2,
			yes3,
			yes4,
			yes5,
			yes6,
			yes7,
			yes8,
			yes9,
			cat1,
			cat2,
			cat3,
			cat4,
			cat5,
			cat6,
			cat7,
			cat8,
			cat9,
			cat10,
			cat11,
			cat12,
			cat13,
			cat14,
			cat15,
			cat16,
			cat17,
			cat18,
			cat19,
		]
	);

	const [placedImages, setPlacedImages] = useState([]);

	useEffect(() => {
		const containerWidth = window.innerWidth;
		const containerHeight = window.innerHeight;

		// Define image size range
		const minSize = 100; // pixels
		const maxSize = 300; // pixels

		// Define a grid to approximate coverage
		const rows = 20;
		const cols = 20;
		const cellWidth = containerWidth / cols;
		const cellHeight = containerHeight / rows;
		const totalCells = rows * cols;
		const coverageThreshold = 0.95; // Stop when 95% of the grid is covered

		// Create a grid (flat array) to mark covered cells (initially all false)
		const grid = new Array(totalCells).fill(false);

		// Function to mark grid cells that the image covers
		const markCoveredCells = (left, top, width, height) => {
			const imageRight = left + width;
			const imageBottom = top + height;
			const startCol = Math.floor(left / cellWidth);
			const endCol = Math.min(
				cols - 1,
				Math.floor(imageRight / cellWidth)
			);
			const startRow = Math.floor(top / cellHeight);
			const endRow = Math.min(
				rows - 1,
				Math.floor(imageBottom / cellHeight)
			);
			for (let row = startRow; row <= endRow; row++) {
				for (let col = startCol; col <= endCol; col++) {
					grid[row * cols + col] = true;
				}
			}
		};

		// Function to compute the percentage of the grid that's covered
		const getCoverage = () => {
			const covered = grid.filter((cell) => cell).length;
			return covered / totalCells;
		};

		// Interval to add a new image every second
		const intervalId = setInterval(() => {
			setPlacedImages((prev) => {
				// Random size
				const size =
					Math.floor(Math.random() * (maxSize - minSize + 1)) +
					minSize;
				// Random position ensuring the image fits entirely within the viewport
				const left = Math.floor(
					Math.random() * (containerWidth - size)
				);
				const top = Math.floor(
					Math.random() * (containerHeight - size)
				);
				// Random rotation angle in degrees
				const rotation = Math.random() * 360;
				// Randomly pick one of the images
				const randomImage =
					images[Math.floor(Math.random() * images.length)];

				// Mark the grid cells that this image covers
				markCoveredCells(left, top, size, size);

				// Check if we have reached the desired screen coverage
				const coverage = getCoverage();
				if (coverage >= coverageThreshold) {
					clearInterval(intervalId);
				}

				return [
					...prev,
					{
						left,
						top,
						width: size,
						height: size,
						rotation,
						src: randomImage,
					},
				];
			});
		}, 600);

		return () => clearInterval(intervalId);
	}, [images]);

	return (
		<div className="fixed inset-0 overflow-hidden">
			{placedImages.map((img, index) => (
				<img
					key={index}
					src={img.src}
					alt={`Random GIF ${index + 1}`}
					className="absolute"
					style={{
						left: img.left,
						top: img.top,
						width: img.width,
						height: img.height,
						transform: `translate(-50%, -50%) rotate(${img.rotation}deg)`,
					}}
				/>
			))}
		</div>
	);
}
