import { memo } from "react";
import PropTypes from "prop-types";

const gardenRoses = [
  { id: 1, left: "7%", delay: "7.7s", scale: .8 },
  { id: 2, left: "25%", delay: "8.2s", scale: 1.05 },
  { id: 3, left: "40%", delay: "8.8s", scale: .72 },
  { id: 4, left: "61%", delay: "8.5s", scale: .8 },
  { id: 5, left: "78%", delay: "7.9s", scale: 1.1 },
  { id: 6, left: "94%", delay: "9.1s", scale: .75 },
  { id: 7, left: "16%", delay: "9.5s", scale: .54 },
  { id: 8, left: "85%", delay: "9.8s", scale: .58 },
];

const fireflies = [
  { x: "8%", y: "12%", delay: "-2s", size: "3px" },
  { x: "19%", y: "22%", delay: "-5s", size: "2px" },
  { x: "30%", y: "10%", delay: "-1s", size: "2px" },
  { x: "40%", y: "18%", delay: "-4s", size: "3px" },
  { x: "63%", y: "13%", delay: "-3s", size: "2px" },
  { x: "78%", y: "24%", delay: "-6s", size: "3px" },
  { x: "91%", y: "16%", delay: "-2.5s", size: "2px" },
  { x: "12%", y: "39%", delay: "-4.5s", size: "3px" },
  { x: "86%", y: "42%", delay: "-1.5s", size: "2px" },
  { x: "6%", y: "58%", delay: "-5.5s", size: "2px" },
  { x: "94%", y: "62%", delay: "-3.5s", size: "3px" },
  { x: "23%", y: "57%", delay: "-1.2s", size: "2px" },
  { x: "72%", y: "57%", delay: "-6.2s", size: "2px" },
];

const fallingPetals = [
  { left: "7%", delay: "-2s", duration: "14s", drift: "54px" },
  { left: "22%", delay: "-8s", duration: "17s", drift: "-32px" },
  { left: "38%", delay: "-5s", duration: "16s", drift: "40px" },
  { left: "58%", delay: "-11s", duration: "18s", drift: "-48px" },
  { left: "76%", delay: "-4s", duration: "15s", drift: "35px" },
  { left: "91%", delay: "-10s", duration: "19s", drift: "-44px" },
];

function GardenRose({ left, delay, scale }) {
  return (
    <div className="rose-finale-garden-plant" style={{ "--rose-left": left, "--rose-delay": delay, "--rose-scale": scale }}>
      <svg viewBox="0 0 90 210" fill="none" aria-hidden="true">
        <path className="rose-finale-mini-stem" pathLength="1" d="M45 207C39 161 55 125 45 78" stroke="#7f9a74" strokeWidth="3" strokeLinecap="round" />
        <path className="rose-finale-mini-leaf rose-finale-mini-leaf--one" d="M46 158C17 143 10 126 16 117c22 5 32 18 30 41Z" fill="#789672" />
        <path className="rose-finale-mini-leaf rose-finale-mini-leaf--two" d="M46 135c22-27 37-28 43-21-10 19-24 25-43 21Z" fill="#9aaf84" />
        <g transform="translate(45 82)"><g className="rose-finale-mini-bloom">
          <path d="M0 0C-18-7-34-23-35-42c-2-17 12-27 26-19 12-10 28-2 29 16C20-24 11-9 0 0Z" fill="#99495f" />
          <path d="M0 0C18-7 34-23 35-42c2-17-12-27-26-19-12-10-28-2-29 16C-20-24-11-9 0 0Z" fill="#b75f70" />
          <path d="M0 0C-24-17-26-51-9-62c9-6 19-2 25 5 14-3 23 10 18 24C29-17 16-5 0 0Z" fill="#cf7980" />
          <path d="M0 0C-25-10-31-35-20-49c8-10 22-9 31 0C16-29 11-10 0 0Z" fill="#d8898b" />
          <path d="M0 0C25-10 31-35 20-49c-8-10-22-9-31 0C-16-29-11-10 0 0Z" fill="#ad5067" />
          <path d="M-13-19c-3-15 10-25 22-19 12 6 11 20 2 29C5-3-2 0-2 0c-9-7-13-13-11-19Z" fill="#e0a092" />
          <path d="M-8-24c1-10 14-14 20-5 5 7-1 14-8 14-5 0-6-5-3-8" stroke="#f5c3aa" strokeWidth="2" strokeLinecap="round" />
        </g></g>
      </svg>
    </div>
  );
}

GardenRose.propTypes = {
  left: PropTypes.string.isRequired,
  delay: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
};

export const RoseGardenFinale = memo(function RoseGardenFinale() {
  return (
    <div className="rose-finale" role="img" aria-label="A rose grows from its roots, opens petal by petal, and a garden blooms beneath a moon. I love you.">
      <div className="rose-finale-glow" />
      <div className="rose-finale-night" aria-hidden="true">
        <svg className="rose-finale-moon" viewBox="0 0 24 24" fill="none">
          <path d="M20.985 12.486A9 9 0 0 1 11.514 3.015a9 9 0 1 0 9.47 9.47Z" fill="#f3cfaa" />
        </svg>
        {fireflies.map((light, index) => <span key={index} className="rose-finale-firefly" style={{ "--light-x": light.x, "--light-y": light.y, "--light-delay": light.delay, "--light-size": light.size }} />)}
        {fallingPetals.map((petal, index) => <span key={index} className="rose-finale-falling-petal" style={{ "--petal-x": petal.left, "--petal-delay": petal.delay, "--petal-duration": petal.duration, "--petal-drift": petal.drift }} />)}
      </div>
      <span className="rose-finale-declaration">I love you.</span>
      <div className="rose-finale-garden" aria-hidden="true">
        {gardenRoses.map((rose) => <GardenRose key={rose.id} {...rose} />)}
      </div>
      <svg className="rose-finale-main" viewBox="0 0 390 650" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="rose-petal-deep" x1="-70" y1="-95" x2="55" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#e69791" /><stop offset=".55" stopColor="#ba5d70" /><stop offset="1" stopColor="#873b58" /></linearGradient>
          <linearGradient id="rose-petal-warm" x1="-45" y1="-95" x2="45" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#f3b29b" /><stop offset=".58" stopColor="#d47a82" /><stop offset="1" stopColor="#a44662" /></linearGradient>
          <linearGradient id="rose-stem" x1="175" y1="600" x2="205" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#667d64" /><stop offset="1" stopColor="#a8bc8d" /></linearGradient>
        </defs>
        <g className="rose-finale-roots" stroke="#62795e" strokeLinecap="round" fill="none">
          <path pathLength="1" d="M195 598C157 602 122 607 84 632" strokeWidth="3" />
          <path pathLength="1" d="M195 598C223 608 265 603 313 634" strokeWidth="3" />
          <path pathLength="1" d="M195 598C185 620 165 626 151 645" strokeWidth="2" />
          <path pathLength="1" d="M195 598C208 621 229 627 241 645" strokeWidth="2" />
          <path pathLength="1" d="M131 612C116 610 105 607 92 609M265 612C281 612 292 610 307 615" strokeWidth="1.5" />
        </g>
        <path className="rose-finale-stem" pathLength="1" d="M195 598C187 542 201 501 193 449C182 396 207 357 195 302C187 269 197 231 195 204" stroke="url(#rose-stem)" strokeWidth="6" strokeLinecap="round" />
        <g className="rose-finale-leaf rose-finale-leaf--one">
          <path d="M193 478C151 466 111 435 103 405C149 409 180 434 193 478Z" fill="#749172" stroke="#a8bc8d" strokeWidth="2" />
          <path d="M193 477C155 441 133 431 111 416" stroke="#adc196" strokeWidth="1.5" />
        </g>
        <g className="rose-finale-leaf rose-finale-leaf--two">
          <path d="M196 420C220 381 259 356 291 355C285 392 249 420 196 420Z" fill="#88a580" stroke="#b1c49c" strokeWidth="2" />
          <path d="M198 419C236 391 259 379 284 362" stroke="#c0d1aa" strokeWidth="1.5" />
        </g>
        <g className="rose-finale-leaf rose-finale-leaf--three">
          <path d="M194 337C167 318 143 296 138 267C169 272 190 296 194 337Z" fill="#83a07c" stroke="#b1c49c" strokeWidth="2" />
          <path d="M192 334C170 303 158 290 144 276" stroke="#b5c9a2" strokeWidth="1.5" />
        </g>
        <path className="rose-finale-thorns" d="M193 448l-15-15 17 7M197 378l14-18-12 8M193 286l-11-14 12 6" stroke="#8ba882" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <g className="rose-finale-head" transform="translate(195 205)">
          <path className="rose-finale-petal rose-finale-petal--one" d="M0 2C-33-4-81-29-85-67c-2-23 17-39 38-29 16-14 39-3 42 21C-1-48-1-20 0 2Z" fill="url(#rose-petal-deep)" />
          <path className="rose-finale-petal rose-finale-petal--two" d="M0 2C33-4 81-29 85-67c2-23-17-39-38-29-16-14-39-3-42 21C1-48 1-20 0 2Z" fill="url(#rose-petal-deep)" />
          <path className="rose-finale-petal rose-finale-petal--three" d="M0 0C-34-32-43-89-19-106c12-10 23-7 30 1 13-11 30-4 34 13 8 30-15 75-45 92Z" fill="url(#rose-petal-warm)" />
          <path className="rose-finale-petal rose-finale-petal--four" d="M0 5C-39-9-62-37-60-70c1-22 20-33 37-23 14-8 29 1 33 19C17-46 7-15 0 5Z" fill="#bd6475" />
          <path className="rose-finale-petal rose-finale-petal--five" d="M0 5C39-9 62-37 60-70c-1-22-20-33-37-23-14-8-29 1-33 19C-17-46-7-15 0 5Z" fill="#d77f83" />
          <path className="rose-finale-petal rose-finale-petal--six" d="M0 2C-30-22-39-64-20-81c9-9 20-8 28-3 14-10 30-1 32 16C44-44 19-11 0 2Z" fill="url(#rose-petal-warm)" />
          <path className="rose-finale-petal rose-finale-petal--seven" d="M0 2C30-22 39-64 20-81c-9-9-20-8-28-3-14-10-30-1-32 16C-44-44-19-11 0 2Z" fill="#a94f69" />
          <path className="rose-finale-petal rose-finale-petal--eight" d="M-17-16C-33-38-25-66-5-72c12-4 21 2 25 9 15-3 25 13 17 27C29-18 11-4 0 3c-6-4-12-11-17-19Z" fill="#e49a91" />
          <path className="rose-finale-petal rose-finale-petal--nine" d="M-13-25C-17-47 5-58 18-45 28-31 15-10 0 0c-9-7-12-15-13-25Z" fill="#c46a79" />
          <path className="rose-finale-petal rose-finale-petal--ten" d="M-8-28C-5-42 12-43 16-30 19-21 10-13 1-11c-7 0-8-8-3-12" stroke="#f4bb9f" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <span className="rose-finale-caption">a rose for you</span>
    </div>
  );
});
