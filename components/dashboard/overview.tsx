"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    profissionais: 12,
    fornecedores: 220,
  },
  {
    name: "Fev",
    profissionais: 18,
    fornecedores: 380,
  },
  {
    name: "Mar",
    profissionais: 15,
    fornecedores: 290,
  },
  {
    name: "Abr",
    profissionais: 22,
    fornecedores: 430,
  },
  {
    name: "Mai",
    profissionais: 28,
    fornecedores: 510,
  },
  {
    name: "Jun",
    profissionais: 25,
    fornecedores: 590,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="profissionais" fill="#adfa1d" radius={[4, 4, 0, 0]} name="Profissionais" />
        <Bar dataKey="fornecedores" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Usuários" />
      </BarChart>
    </ResponsiveContainer>
  )
}
