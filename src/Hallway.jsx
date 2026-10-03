import { HALL, hallLength, hallTotal, hallCenterZ } from './layout'

const Plane = ({ pos, rot, size, color, rough = 0.9, emissive }) => (
  <mesh position={pos} rotation={rot}>
    <planeGeometry args={size} />
    <meshStandardMaterial color={color} roughness={rough} emissive={emissive} emissiveIntensity={emissive ? 1.2 : 0} />
  </mesh>
)

export default function Hallway() {
  const { width: w, height: h } = HALL
  const lights = Array.from({ length: Math.floor(hallTotal / 6) }, (_, i) => -i * 6 - 2)
  return (
    <group>
      <Plane pos={[0, 0, hallCenterZ]} rot={[-Math.PI / 2, 0, 0]} size={[w, hallTotal]} color="#3b2a22" rough={0.4} />
      <Plane pos={[0, 0.01, hallCenterZ]} rot={[-Math.PI / 2, 0, 0]} size={[2.2, hallTotal]} color="#7a2e4a" />
      <Plane pos={[0, h, hallCenterZ]} rot={[Math.PI / 2, 0, 0]} size={[w, hallTotal]} color="#1d1122" />
      <Plane pos={[-w / 2, h / 2, hallCenterZ]} rot={[0, Math.PI / 2, 0]} size={[hallTotal, h]} color="#2a1830" />
      <Plane pos={[w / 2, h / 2, hallCenterZ]} rot={[0, -Math.PI / 2, 0]} size={[hallTotal, h]} color="#2a1830" />
      <Plane pos={[0, h / 2, -hallLength]} rot={[0, 0, 0]} size={[w, h]} color="#2a1830" />
      <Plane pos={[0, h / 2, HALL.backPad]} rot={[0, Math.PI, 0]} size={[w, h]} color="#2a1830" />
      {lights.map((z) => (
        <mesh key={z} position={[0, h - 0.03, z]}>
          <boxGeometry args={[1.6, 0.04, 0.3]} />
          <meshStandardMaterial color="#ffe7bf" emissive="#ffd9a0" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  )
}
