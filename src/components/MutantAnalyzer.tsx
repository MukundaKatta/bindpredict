"use client";

import { useState, useMemo } from "react";
import { useBindStore } from "@/lib/store";
import { proteins, aminoAcids, analyzeMutation } from "@/lib/molecules";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FlaskConical } from "lucide-react";

export default function MutantAnalyzer() {
  const { selectedProtein } = useBindStore();
  const protein = proteins.find((p) => p.id === selectedProtein) || proteins[0];
  const [position, setPosition] = useState(42);
  const [originalAA, setOriginalAA] = useState("ALA");
  const [mutantAA, setMutantAA] = useState("GLY");

  const result = useMemo(
    () => analyzeMutation(protein, position, originalAA, mutantAA),
    [protein, position, originalAA, mutantAA]
  );

  // Scan all mutations at position
  const scan = useMemo(() => {
    return aminoAcids
      .filter((aa) => aa !== originalAA)
      .map((aa) => {
        const res = analyzeMutation(protein, position, originalAA, aa);
        return { mutant: aa, ddG: res.ddG, stability: res.stability, bindingChange: res.bindingChange };
      })
      .sort((a, b) => a.ddG - b.ddG);
  }, [protein, position, originalAA]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FlaskConical size={22} className="text-pink-400" /> Mutant Analyzer
        </h2>
        <p className="text-sm text-slate-400">Predict effects of point mutations on {protein.name}</p>
      </div>

      {/* Inputs */}
      <div className="glass-panel p-4 grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Position</label>
          <input type="number" value={position} onChange={(e) => setPosition(+e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            min={1} max={protein.residues}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Original</label>
          <select value={originalAA} onChange={(e) => setOriginalAA(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
          >
            {aminoAcids.map((aa) => <option key={aa} value={aa}>{aa}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Mutant</label>
          <select value={mutantAA} onChange={(e) => setMutantAA(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
          >
            {aminoAcids.map((aa) => <option key={aa} value={aa}>{aa}</option>)}
          </select>
        </div>
      </div>

      {/* Result */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-3">{originalAA}{position}{mutantAA} Mutation</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${result.ddG > 0 ? "text-red-400" : "text-green-400"}`}>
              {result.ddG > 0 ? "+" : ""}{result.ddG}
            </div>
            <div className="text-xs text-slate-500">ddG (kcal/mol)</div>
          </div>
          <div className="text-center">
            <div className={`text-sm font-medium px-2 py-1 rounded ${
              result.stability === "Destabilizing" ? "bg-red-500/20 text-red-400" :
              result.stability === "Stabilizing" ? "bg-green-500/20 text-green-400" :
              "bg-slate-700/50 text-slate-300"
            }`}>{result.stability}</div>
            <div className="text-xs text-slate-500 mt-1">Effect</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${result.bindingChange > 0 ? "text-red-400" : "text-green-400"}`}>
              {result.bindingChange > 0 ? "+" : ""}{result.bindingChange}
            </div>
            <div className="text-xs text-slate-500">Binding Change</div>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-4">{result.description}</p>
      </div>

      {/* Saturation Mutagenesis */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Saturation Mutagenesis at Position {position}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scan}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="mutant" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Bar dataKey="ddG" radius={[4, 4, 0, 0]}>
              {scan.map((s, i) => (
                <Cell key={i} fill={s.ddG > 1 ? "#ef4444" : s.ddG < -1 ? "#22c55e" : "#3b82f6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
