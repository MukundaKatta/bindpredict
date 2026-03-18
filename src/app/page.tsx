"use client";

import dynamic from "next/dynamic";
import { useBindStore, TabMode } from "@/lib/store";
import { proteins, ligands } from "@/lib/molecules";
import EnergyCalculator from "@/components/EnergyCalculator";
import VirtualScreening from "@/components/VirtualScreening";
import MutantAnalyzer from "@/components/MutantAnalyzer";
import { FlaskRound, Eye, Zap, Target, Search, FlaskConical } from "lucide-react";

const MolecularViewer = dynamic(() => import("@/components/MolecularViewer"), { ssr: false });

const tabs: { key: TabMode; label: string; icon: React.ReactNode }[] = [
  { key: "viewer", label: "3D Viewer", icon: <Eye size={18} /> },
  { key: "energy", label: "Free Energy", icon: <Zap size={18} /> },
  { key: "docking", label: "Docking", icon: <Target size={18} /> },
  { key: "screening", label: "Screening", icon: <Search size={18} /> },
  { key: "mutant", label: "Mutations", icon: <FlaskConical size={18} /> },
];

export default function HomePage() {
  const { tab, setTab, selectedProtein, setSelectedProtein, selectedLigand, setSelectedLigand } = useBindStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#050a15]">
      {/* Sidebar */}
      <div className="w-64 h-full glass-panel flex flex-col">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <FlaskRound size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">BindPredict</h1>
              <p className="text-xs text-slate-400">Binding Prediction</p>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                tab === t.key ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              {t.icon}
              <span className="text-sm">{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="flex-1 p-3 border-t border-slate-700/50 overflow-y-auto space-y-4">
          <div>
            <p className="text-xs text-slate-500 px-3 mb-2">Protein</p>
            {proteins.map((p) => (
              <button key={p.id} onClick={() => setSelectedProtein(p.id)}
                className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  selectedProtein === p.id ? "bg-pink-500/20 text-pink-300" : "text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-slate-500">{p.pdbId} | {p.residues} res</div>
              </button>
            ))}
          </div>
          <div>
            <p className="text-xs text-slate-500 px-3 mb-2">Ligand</p>
            {ligands.map((l) => (
              <button key={l.id} onClick={() => setSelectedLigand(l.id)}
                className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  selectedLigand === l.id ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                <div className="font-medium">{l.name}</div>
                <div className="text-slate-500">{l.formula}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {tab === "viewer" && <MolecularViewer />}
        {tab === "energy" && <EnergyCalculator />}
        {tab === "docking" && <EnergyCalculator />}
        {tab === "screening" && <VirtualScreening />}
        {tab === "mutant" && <MutantAnalyzer />}
      </div>
    </div>
  );
}
