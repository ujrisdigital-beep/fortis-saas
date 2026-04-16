type EligibilityScoreRingProps = {
  score: number;
};

function colorForScore(score: number) {
  if (score >= 80) {
    return "#10B981";
  }
  if (score >= 60) {
    return "#C9A84C";
  }
  return "#E63946";
}

export function EligibilityScoreRing({ score }: EligibilityScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const progress = (clamped / 100) * circumference;
  const stroke = colorForScore(clamped);

  return (
    <div style={{ width: 72, height: 72, position: "relative" }} aria-label={`Eligibility ${clamped}%`}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="8" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          transform="rotate(-90 36 36)"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 700, color: "white", fontSize: "0.85rem" }}>
        {clamped}%
      </div>
    </div>
  );
}
