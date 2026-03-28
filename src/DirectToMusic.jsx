import PropTypes from "prop-types";
import { reactionImages } from "./constants/assets";

const orbitHearts = Array.from({ length: 14 }, (_, index) => ({
	id: index,
	left: 8 + ((index * 7) % 84),
	top: 10 + ((index * 11) % 72),
	delay: index * 0.35,
	duration: 7 + (index % 4),
	size: 16 + ((index * 3) % 18),
}));

export function DirectToMusic({ onYes }) {
	return (
		<section className="direct-music-page">
			<div className="direct-music-backdrop" />

			<div className="direct-music-sparkles" aria-hidden="true">
				{orbitHearts.map((heart) => (
					<span
						key={heart.id}
						className="direct-music-heart"
						style={{
							left: `${heart.left}%`,
							top: `${heart.top}%`,
							animationDelay: `${heart.delay}s`,
							animationDuration: `${heart.duration}s`,
							fontSize: `${heart.size}px`,
						}}
					>
						{heart.id % 3 === 0 ? "♥" : heart.id % 2 === 0 ? "✦" : "♡"}
					</span>
				))}
			</div>

			<div className="direct-music-card">
				<div className="direct-music-image-wrap">
					<div className="direct-music-image-glow" />
					<img
						src={reactionImages.sayYs}
						alt="Cute romantic reaction"
						className="direct-music-image"
					/>
				</div>

				<p className="direct-music-eyebrow">For the sweetest moment</p>
				<h1 className="direct-music-title">
					Are you ready to go direcly in to music
				</h1>
				<p className="direct-music-description">
					real magic happen when last part of the music
				</p>

				<button className="direct-music-button" onClick={onYes}>
					Yes, take me there
				</button>
			</div>
		</section>
	);
}

DirectToMusic.propTypes = {
	onYes: PropTypes.func.isRequired,
};
