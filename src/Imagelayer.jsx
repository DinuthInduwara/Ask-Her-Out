import { useState, useEffect } from "react";
import { celebrationImages } from "./constants/assets";

export function ImageLayer() {
	const [placedImages, setPlacedImages] = useState([]);

	useEffect(() => {
		const containerWidth = window.innerWidth;
		const containerHeight = window.innerHeight;

		// Responsive image sizes based on screen width
		const isMobile = containerWidth < 768;
		const minSize = isMobile ? 60 : 100;
		const maxSize = isMobile ? 150 : 300;

		// Track occupied positions to avoid stacking
		const occupiedPositions = [];

		// Check if a position overlaps with existing images
		const isOverlapping = (left, top, size) => {
			const padding = size * 0.3; // 30% padding to avoid close placements
			for (const pos of occupiedPositions) {
				const distance = Math.sqrt(
					Math.pow(left - pos.left, 2) + Math.pow(top - pos.top, 2)
				);
				if (distance < (size + pos.size) / 2 + padding) {
					return true;
				}
			}
			return false;
		};

		// Find a random non-overlapping position
		const findRandomPosition = (size) => {
			let attempts = 0;
			const maxAttempts = 50;

			while (attempts < maxAttempts) {
				const left = Math.floor(Math.random() * (containerWidth - size));
				const top = Math.floor(Math.random() * (containerHeight - size));

				if (!isOverlapping(left, top, size)) {
					return { left, top };
				}
				attempts++;
			}

			// If no non-overlapping position found, return a random one anyway
			return {
				left: Math.floor(Math.random() * (containerWidth - size)),
				top: Math.floor(Math.random() * (containerHeight - size)),
			};
		};

		// Slower interval for mobile (800ms) vs desktop (500ms)
		const intervalTime = isMobile ? 800 : 500;
		const maxImages = isMobile ? 25 : 50;

		const intervalId = setInterval(() => {
			setPlacedImages((prev) => {
				// Stop adding after max images
				if (prev.length >= maxImages) {
					clearInterval(intervalId);
					return prev;
				}

				const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
				const { left, top } = findRandomPosition(size);
				const rotation = Math.random() * 40 - 20; // -20 to +20 degrees (less extreme)
				const randomImage = celebrationImages[Math.floor(Math.random() * celebrationImages.length)];

				// Track this position
				occupiedPositions.push({ left, top, size });

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
		}, intervalTime);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="fixed inset-0 overflow-hidden">
			{placedImages.map((img, index) => (
				<img
					key={index}
					src={img.src}
					alt={`Celebration GIF ${index + 1}`}
					className="absolute celebration-img"
					style={{
						left: img.left,
						top: img.top,
						width: img.width,
						height: img.height,
						transform: `rotate(${img.rotation}deg)`,
						objectFit: "contain",
					}}
				/>
			))}
		</div>
	);
}
