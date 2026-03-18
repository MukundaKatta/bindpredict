"use client";

import { useMemo } from "react";
import { useBindStore } from "@/lib/store";
import { proteins, virtualScreening } from "@/lib/molecules";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Search, Trophy } from "lucide-react";

export default function VirtualScreening() {
  const { selectedProtein, setSelectedLigand, setTab } = useBindStore();
  const protein = proteins.find((p) => p.id === selectedProtein) || proteins[0];
  const results = useMemo(() => virtualScreening(protein), [protein]);

  const chartData = results.map((r) => ({
    name: r.ligand.name,
    score: Math.abs(r.score),
    rawScore: r.score,
  }));

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Search size={22} className="text-cyan-400" /> Virtual Screening
        </h2>
        <p className="text-sm text-slate-400">Screening against {protein.name}</p>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Binding Scores (|kcal/mol|)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : "#8b5cf6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {results.map((r) => (
          <button
            key={r.ligand.id}
            onClick={() => { setSelectedLigand(r.ligand.id); setTab("viewer"); }}
            className="w-full glass-panel p-4 text-left hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                r.rank === 1 ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-400"
              }`}>
                {r.rank === 1 ? <Trophy size={18} /> : `#${r.rank}`}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{r.ligand.name}</div>
                <div className="text-xs text-slate-500">{r.ligand.formula} | MW: {r.ligand.mw}</div>
              </div>
              <div className={`text-sm font-mono font-bold ${r.score < -5 ? "text-green-400" : r.score < -2 ? "text-blue-400" : "text-red-400"}`}>
                {r.score.toFixed(2)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
