import PropTypes from "prop-types";

function Bird() {
  return (
    <svg viewBox="0 0 96 52" fill="none" aria-hidden="true">
      <path d="M48 31C33 16 18 12 3 15c13 4 21 11 28 21 7-1 12-3 17-5Zm0 0c15-15 30-19 45-16-13 4-21 11-28 21-7-1-12-3-17-5Z" fill="currentColor" />
      <path d="M42 28c3 1 9 1 12 0l-6 17-6-17Z" fill="currentColor" />
    </svg>
  );
}

function Flower({ side }) {
  return (
    <svg className={`garden-flower garden-flower--${side}`} viewBox="0 0 185 290" fill="none" aria-hidden="true">
      <path d="M91 289c-12-41-21-84-12-127 9-38 37-57 40-100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M82 211c-38-10-53-31-57-57 36 4 56 19 57 57Zm3-18c17-38 39-49 69-45-13 31-34 47-69 45ZM94 122c-26-11-37-28-39-48 24 5 38 19 39 48Z" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth="1.5" />
      <g transform="translate(120 57)">
        <ellipse rx="17" ry="34" transform="rotate(0) translate(0 -25)" fill="#d59e91" />
        <ellipse rx="17" ry="34" transform="rotate(72) translate(0 -25)" fill="#d59e91" />
        <ellipse rx="17" ry="34" transform="rotate(144) translate(0 -25)" fill="#d59e91" />
        <ellipse rx="17" ry="34" transform="rotate(216) translate(0 -25)" fill="#d59e91" />
        <ellipse rx="17" ry="34" transform="rotate(288) translate(0 -25)" fill="#d59e91" />
        <circle r="17" fill="#f4c67e" />
        <circle r="5" fill="#7b4b54" />
      </g>
      <circle cx="55" cy="66" r="4" fill="#f4c67e" />
      <circle cx="43" cy="98" r="2" fill="#f4c67e" />
      <circle cx="157" cy="107" r="3" fill="#f4c67e" />
    </svg>
  );
}

Flower.propTypes = { side: PropTypes.oneOf(["left", "right"]).isRequired };

export function MoonGarden() {
  return (
    <div className="moon-garden" aria-hidden="true">
      <div className="moon-garden-halo" />
      <div className="moon-garden-moon" />
      <span className="moon-garden-star moon-garden-star--one">✦</span>
      <span className="moon-garden-star moon-garden-star--two">✧</span>
      <span className="moon-garden-star moon-garden-star--three">✦</span>
      <div className="reunion-bird reunion-bird--first"><Bird /></div>
      <div className="reunion-bird reunion-bird--second"><Bird /></div>
      <Flower side="left" />
      <Flower side="right" />
    </div>
  );
}
