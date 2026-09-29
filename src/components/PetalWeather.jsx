const petals = [
  { left: 4, delay: -2, duration: 16, drift: 55, size: 8 },
  { left: 13, delay: -9, duration: 19, drift: -43, size: 6 },
  { left: 24, delay: -5, duration: 15, drift: 68, size: 9 },
  { left: 35, delay: -13, duration: 21, drift: -57, size: 7 },
  { left: 48, delay: -1, duration: 18, drift: 39, size: 5 },
  { left: 58, delay: -11, duration: 17, drift: -62, size: 8 },
  { left: 70, delay: -7, duration: 22, drift: 50, size: 6 },
  { left: 82, delay: -15, duration: 18, drift: -40, size: 9 },
  { left: 94, delay: -4, duration: 20, drift: 48, size: 7 },
];

export function PetalWeather() {
  return (
    <div className="petal-weather" aria-hidden="true">
      {petals.map((petal, index) => (
        <span
          key={petal.left}
          className={`petal-weather-piece petal-weather-piece--${index % 3}`}
          style={{
            "--petal-left": `${petal.left}%`,
            "--petal-delay": `${petal.delay}s`,
            "--petal-duration": `${petal.duration}s`,
            "--petal-drift": `${petal.drift}px`,
            "--petal-size": `${petal.size}px`,
          }}
        />
      ))}
    </div>
  );
}
