# BindPredict

Molecular binding prediction platform with 3D protein visualization, docking simulation, and virtual screening.

<!-- Add screenshot here -->

## Features

- **3D Molecular Viewer** — Interactive Three.js-based protein and ligand visualization
- **Binding Free Energy Calculator** — Estimate binding affinities with thermodynamic models
- **Docking Simulation** — Simulate protein-ligand docking with scoring functions
- **Virtual Screening** — Screen compound libraries against protein targets at scale
- **Mutation Analyzer** — Predict how point mutations affect binding affinity
- **Protein & Ligand Selection** — Browse and select from curated molecular databases
- **Real-Time Rendering** — GPU-accelerated 3D rendering with React Three Fiber and Drei

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **3D Rendering:** Three.js, @react-three/fiber, @react-three/drei
- **Charts:** Recharts
- **Database:** Supabase
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project
- WebGL-capable browser

### Installation

```bash
git clone <repo-url>
cd bindpredict
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/
│   ├── MolecularViewer.tsx
│   ├── EnergyCalculator.tsx
│   ├── VirtualScreening.tsx
│   └── MutantAnalyzer.tsx
├── lib/
│   ├── store.ts      # Zustand state management
│   └── molecules.ts  # Protein and ligand data
└── types/            # TypeScript type definitions
```

## License

MIT
