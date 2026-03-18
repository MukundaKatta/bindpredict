"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import { useBindStore } from "@/lib/store";
import { proteins, ligands } from "@/lib/molecules";
import * as THREE from "three";

const atomColors: Record<string, string> = {
  C: "#909090", N: "#3050F8", O: "#FF0D0D", S: "#FFFF30", H: "#FFFFFF",
};

function ProteinMesh() {
  const ref = useRef<THREE.Group>(null);
  const { selectedProtein } = useBindStore();
  const protein = proteins.find((p) => p.id === selectedProtein) || proteins[0];

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={ref}>
      {protein.atoms.map((atom, i) => (
        <mesh key={i} position={[atom.x, atom.y, atom.z]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={atomColors[atom.type] || "#808080"}
            metalness={0.2}
            roughness={0.3}
            opacity={atom.chain === "A" ? 0.8 : 0.5}
            transparent
          />
        </mesh>
      ))}
      {/* Binding site highlight */}
      {protein.bindingSite.map((site, i) => (
        <mesh key={`site-${i}`} position={[site.x, site.y, site.z]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#22c55e" opacity={0.15} transparent wireframe />
        </mesh>
      ))}
    </group>
  );
}

function LigandMesh() {
  const { selectedLigand } = useBindStore();
  const ligand = ligands.find((l) => l.id === selectedLigand) || ligands[0];

  return (
    <group position={[0, 0, 0]}>
      {ligand.atoms.map((atom, i) => (
        <mesh key={i} position={[atom.x, atom.y, atom.z]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={atomColors[atom.type] || "#ff6b6b"} metalness={0.4} roughness={0.2} emissive={atomColors[atom.type] || "#ff6b6b"} emissiveIntensity={0.2} />
        </mesh>
      ))}
      {ligand.bonds.map(([a, b], i) => {
        const atomA = ligand.atoms[a];
        const atomB = ligand.atoms[b];
        if (!atomA || !atomB) return null;
        const start = new THREE.Vector3(atomA.x, atomA.y, atomA.z);
        const end = new THREE.Vector3(atomB.x, atomB.y, atomB.z);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dir = end.clone().sub(start);
        const len = dir.length();
        dir.normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        return (
          <mesh key={`bond-${i}`} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.03, 0.03, len, 8]} />
            <meshStandardMaterial color="#fbbf24" opacity={0.8} transparent />
          </mesh>
        );
      })}
    </group>
  );
}

export default function MolecularViewer() {
  const { selectedProtein } = useBindStore();
  const protein = proteins.find((p) => p.id === selectedProtein) || proteins[0];

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#6366f1" />
        <Float speed={0.3} rotationIntensity={0} floatIntensity={0.2}>
          <ProteinMesh />
          <LigandMesh />
        </Float>
        <OrbitControls enableDamping dampingFactor={0.05} />
        <Environment preset="night" />
      </Canvas>
      <div className="absolute bottom-4 left-4 glass-panel px-4 py-2">
        <div className="text-sm font-medium text-white">{protein.name}</div>
        <div className="text-xs text-slate-400">PDB: {protein.pdbId} | {protein.residues} residues</div>
      </div>
    </div>
  );
}
