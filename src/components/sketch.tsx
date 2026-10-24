type Props = { kind: string; className?: string };

// Concept illustrations, not screenshots. Deterministic geometry also keeps SSR stable.
export function Sketch({ kind, className = "" }: Props) {
  const isNetwork = /mnist|perceptron|backprop|neural|xor|weights|nn|convol|learning/.test(kind);
  const isCube = /cube|tesseract|3d/.test(kind);
  const isBoids = /boids|particles|gravity|solar|simulations|agents/.test(kind);
  return <svg viewBox="0 0 480 280" className={className} aria-hidden="true" fill="none">
    <path d="M0 70H480M0 140H480M0 210H480M80 0V280M160 0V280M240 0V280M320 0V280M400 0V280" stroke="currentColor" opacity=".055" />
    {isNetwork ? <>
      {[3, 5, 4, 2].map((count, layer, layers) => Array.from({ length: count }, (_, node) => {
        const x = 72 + layer * 112, y = 140 + (node - (count - 1) / 2) * 43;
        return <g key={`${layer}-${node}`}>
          {layer < layers.length - 1 && Array.from({ length: layers[layer + 1] }, (_, next) => <line key={next} x1={x} y1={y} x2={x + 112} y2={140 + (next - (layers[layer + 1] - 1) / 2) * 43} stroke="currentColor" opacity={.09 + ((node + next) % 3) * .07} />)}
          <circle cx={x} cy={y} r="9" fill={layer === 3 || (layer + node) % 4 === 0 ? "var(--accent)" : "var(--paper)"} stroke="currentColor" strokeWidth="1.3" />
        </g>;
      }))}
      <text x="65" y="258" fill="currentColor" opacity=".5" fontSize="10" fontFamily="monospace">INPUT</text><text x="366" y="258" fill="currentColor" opacity=".5" fontSize="10" fontFamily="monospace">OUTPUT</text>
    </> : isCube ? <>
      {[0, 1].map(index => <g key={index} transform={`translate(${index * 43} ${index * -30})`} opacity={index ? .38 : 1}>
        <path d="m144 103 107-45 97 55-107 47-97-57v111l97 48 107-47V113M241 160v102" stroke="currentColor" strokeWidth="1.5" />
        {index === 0 && <path d="m144 103 97 57 107-47-97-55Z" fill="var(--accent)" opacity=".4" />}
      </g>)}
      <path d="m144 103 43-30m64-15 43-30m54 85 43-30M241 262l43-30m64-17 43-30M144 214l43-30" stroke="currentColor" strokeWidth="1" opacity=".35" />
    </> : isBoids ? <>
      {Array.from({ length: 32 }, (_, i) => {
        const x = 40 + ((i * 73) % 390), y = 40 + ((i * 47) % 200), rotation = (i * 17) % 85 - 45;
        return <g key={i} transform={`translate(${x} ${y}) rotate(${rotation})`}><path d="M-23 3Q-34 8-49 2" stroke="currentColor" opacity=".13" /><path d="m10 0-18-6 4 6-4 6Z" fill={i % 5 === 0 ? "var(--accent-ink)" : "currentColor"} opacity={.35 + (i % 4) * .2} /></g>;
      })}
    </> : <>
      <path d="M55 223H426M85 245V35" stroke="currentColor" opacity=".3" />
      <path d="M65 207C114 220 132 93 178 110S231 226 271 155 340 51 419 67" stroke="currentColor" strokeWidth="2" />
      {Array.from({ length: 13 }, (_, i) => <circle key={i} cx={80 + i * 27} cy={150 + Math.sin(i * .7) * 58} r={i % 3 === 0 ? 6 : 3} fill={i % 3 === 0 ? "var(--accent-ink)" : "currentColor"} opacity=".6" />)}
      <path d="M103 201 381 61" stroke="currentColor" strokeDasharray="4 7" opacity=".2" />
    </>}
  </svg>;
}
