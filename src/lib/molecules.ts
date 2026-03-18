export interface ProteinData {
  id: string;
  name: string;
  pdbId: string;
  organism: string;
  residues: number;
  bindingSite: { x: number; y: number; z: number }[];
  atoms: { type: string; x: number; y: number; z: number; chain: string; residue: string }[];
}

export interface LigandData {
  id: string;
  name: string;
  formula: string;
  mw: number;
  logP: number;
  hbDonors: number;
  hbAcceptors: number;
  atoms: { type: string; x: number; y: number; z: number }[];
  bonds: [number, number][];
}

function generateProteinAtoms(count: number, spread: number): ProteinData["atoms"] {
  const atoms: ProteinData["atoms"] = [];
  const types = ["C", "N", "O", "S"];
  const residues = ["ALA", "GLY", "VAL", "LEU", "ILE", "PRO", "PHE", "TRP"];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = spread * (0.5 + Math.random() * 0.5);
    atoms.push({
      type: types[Math.floor(Math.random() * types.length)],
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      chain: Math.random() > 0.5 ? "A" : "B",
      residue: residues[Math.floor(Math.random() * residues.length)],
    });
  }
  return atoms;
}

export const proteins: ProteinData[] = [
  {
    id: "1hsg",
    name: "HIV-1 Protease",
    pdbId: "1HSG",
    organism: "HIV-1",
    residues: 198,
    bindingSite: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0.5, z: -0.3 }],
    atoms: generateProteinAtoms(200, 3),
  },
  {
    id: "4hhb",
    name: "Hemoglobin",
    pdbId: "4HHB",
    organism: "Homo sapiens",
    residues: 574,
    bindingSite: [{ x: 0, y: 1, z: 0.5 }],
    atoms: generateProteinAtoms(300, 4),
  },
  {
    id: "1crn",
    name: "Crambin",
    pdbId: "1CRN",
    organism: "Crambe hispanica",
    residues: 46,
    bindingSite: [{ x: 0, y: 0, z: 0 }],
    atoms: generateProteinAtoms(80, 2),
  },
];

export const ligands: LigandData[] = [
  {
    id: "aspirin",
    name: "Aspirin",
    formula: "C9H8O4",
    mw: 180.16,
    logP: 1.2,
    hbDonors: 1,
    hbAcceptors: 4,
    atoms: [
      { type: "C", x: 0, y: 0, z: 0 },
      { type: "C", x: 0.4, y: 0.3, z: 0 },
      { type: "C", x: 0.8, y: 0, z: 0 },
      { type: "O", x: 1.2, y: 0.3, z: 0 },
      { type: "O", x: 0, y: -0.4, z: 0 },
      { type: "C", x: -0.4, y: 0.3, z: 0 },
    ],
    bonds: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5]],
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    formula: "C13H18O2",
    mw: 206.28,
    logP: 3.97,
    hbDonors: 1,
    hbAcceptors: 2,
    atoms: [
      { type: "C", x: 0, y: 0, z: 0 },
      { type: "C", x: 0.5, y: 0, z: 0 },
      { type: "C", x: 0.5, y: 0.5, z: 0 },
      { type: "C", x: 0, y: 0.5, z: 0 },
      { type: "O", x: -0.3, y: -0.3, z: 0 },
    ],
    bonds: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]],
  },
  {
    id: "caffeine",
    name: "Caffeine",
    formula: "C8H10N4O2",
    mw: 194.19,
    logP: -0.07,
    hbDonors: 0,
    hbAcceptors: 3,
    atoms: [
      { type: "C", x: 0, y: 0, z: 0 },
      { type: "N", x: 0.3, y: 0.3, z: 0 },
      { type: "C", x: 0.6, y: 0, z: 0 },
      { type: "N", x: 0.3, y: -0.3, z: 0 },
      { type: "O", x: 0.9, y: 0.3, z: 0 },
    ],
    bonds: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4]],
  },
];

export function calculateBindingEnergy(protein: ProteinData, ligand: LigandData): {
  total: number;
  vdw: number;
  electrostatic: number;
  hbond: number;
  desolvation: number;
  entropy: number;
} {
  const seed = (protein.id + ligand.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const vdw = -(2 + r(1) * 6);
  const electrostatic = -(0.5 + r(2) * 3);
  const hbond = -(ligand.hbDonors + ligand.hbAcceptors) * (0.3 + r(3) * 0.5);
  const desolvation = 0.5 + r(4) * 2;
  const entropy = 1 + r(5) * 3;
  const total = vdw + electrostatic + hbond + desolvation - entropy;

  return {
    total: Math.round(total * 100) / 100,
    vdw: Math.round(vdw * 100) / 100,
    electrostatic: Math.round(electrostatic * 100) / 100,
    hbond: Math.round(hbond * 100) / 100,
    desolvation: Math.round(desolvation * 100) / 100,
    entropy: Math.round(entropy * 100) / 100,
  };
}

export function virtualScreening(protein: ProteinData): { ligand: LigandData; score: number; rank: number }[] {
  return ligands
    .map((lig) => ({
      ligand: lig,
      score: calculateBindingEnergy(protein, lig).total,
      rank: 0,
    }))
    .sort((a, b) => a.score - b.score)
    .map((item, i) => ({ ...item, rank: i + 1 }));
}

export const aminoAcids = ["ALA", "ARG", "ASN", "ASP", "CYS", "GLN", "GLU", "GLY", "HIS", "ILE", "LEU", "LYS", "MET", "PHE", "PRO", "SER", "THR", "TRP", "TYR", "VAL"];

export function analyzeMutation(protein: ProteinData, position: number, original: string, mutant: string): {
  ddG: number;
  stability: string;
  bindingChange: number;
  description: string;
} {
  const seed = (protein.id + position + original + mutant).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = Math.sin(seed) * 10000;
  const ddG = (r - Math.floor(r)) * 6 - 3;
  const bindingChange = ddG * (0.3 + (r % 1) * 0.7);

  return {
    ddG: Math.round(ddG * 100) / 100,
    stability: ddG > 1 ? "Destabilizing" : ddG < -1 ? "Stabilizing" : "Neutral",
    bindingChange: Math.round(bindingChange * 100) / 100,
    description: `Mutation ${original}${position}${mutant}: ${ddG > 0 ? "decreases" : "increases"} stability by ${Math.abs(ddG).toFixed(2)} kcal/mol`,
  };
}
