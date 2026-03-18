"use client";

import { useMemo } from "react";
import { useBindStore } from "@/lib/store";
import { proteins, ligands, calculateBindingEnergy } from "@/lib/molecules";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Zap } from "lucide-react";

export default function EnergyCalculator() {
  const { selectedProtein, selectedLigand } = useBindStore();
  const protein = proteins.find((p) => p.id === selectedProtein) || proteins[0];
  const ligand = ligands.find((l) => l.id === selectedLigand) || ligands[0];

  const energy = useMemo(() => calculateBindingEnergy(protein, ligand), [protein, ligand]);

  const components = [
    { name: "Van der Waals", value: energy.vdw, color: "#3b82f6" },
    { name: "Electrostatic", value: energy.electrostatic, color: "#8b5cf6" },
    { name: "H-Bond", value: energy.hbond, color: "#22c55e" },
    { name: "Desolvation", value: energy.desolvation, color: "#f59e0b" },
    { name: "Entropy", value: -energy.entropy, color: "#ef4444" },
  ];

  // Cross-docking matrix
  const matrix = useMemo(() => {
    return proteins.map((p) => ({
      protein: p.name.slice(0, 12),
      ...Object.fromEntries(ligands.map((l) => [l.name, calculateBindingEnergy(p, l).total])),
    }));
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap size={22} className="text-amber-400" /> Binding Free Energy
        </h2>
        <p className="text-sm text-slate-400">{protein.name} + {ligand.name}</p>
      </div>

      {/* Total Energy */}
      <div className="glass-panel p-6 text-center">
        <div className="text-4xl font-bold text-white">{energy.total}</div>
        <div className="text-sm text-slate-400 mt-1">kcal/mol (predicted binding affinity)</div>
        <div className={`inline-block mt-2 px-3 py-1 rounded text-xs ${
          energy.total < -5 ? "bg-green-500/20 text-green-400" :
          energy.total < -2 ? "bg-blue-500/20 text-blue-400" :
          "bg-red-500/20 text-red-400"
        }`}>
          {energy.total < -5 ? "Strong Binder" : energy.total < -2 ? "Moderate Binder" : "Weak Binder"}
        </div>
      </div>

      {/* Energy Components */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Energy Decomposition</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={components}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {components.map((c, i) => <Cell key={i} fill={c.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Component Details */}
      <div className="grid grid-cols-2 gap-3">
        {components.map((c) => (
          <div key={c.name} className="glass-panel p-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-xs text-slate-400">{c.name}</span>
            </div>
            <div className="text-lg font-bold text-white mt-1">{c.value.toFixed(2)} kcal/mol</div>
          </div>
        ))}
      </div>

      {/* Ligand Properties */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Ligand Properties</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div><span className="text-slate-500">Formula:</span> <span className="text-white">{ligand.formula}</span></div>
          <div><span className="text-slate-500">MW:</span> <span className="text-white">{ligand.mw}</span></div>
          <div><span className="text-slate-500">LogP:</span> <span className="text-white">{ligand.logP}</span></div>
          <div><span className="text-slate-500">HB Donors:</span> <span className="text-white">{ligand.hbDonors}</span></div>
          <div><span className="text-slate-500">HB Acceptors:</span> <span className="text-white">{ligand.hbAcceptors}</span></div>
        </div>
      </div>

      {/* Cross-Docking */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Cross-Docking Matrix (kcal/mol)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 text-slate-500">Protein</th>
                {ligands.map((l) => <th key={l.id} className="p-2 text-slate-500">{l.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i} className="border-t border-slate-800">
                  <td className="p-2 text-slate-300">{row.protein}</td>
                  {ligands.map((l) => {
                    const val = row[l.name] as number;
                    return (
                      <td key={l.id} className="p-2 text-center">
                        <span className={val < -5 ? "text-green-400" : val < -2 ? "text-blue-400" : "text-red-400"}>
                          {val.toFixed(1)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
