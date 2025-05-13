"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    profissionais: 12,
    usuarios: 220,
  },
  {
    name: "Fev",
    profissionais: 18,
    usuarios: 380,
  },
  {
    name: "Mar",
    profissionais: 15,
    usuarios: 290,
  },
  {
    name: "Abr",
    profissionais: 22,
    usuarios: 430,
  },
  {
    name: "Mai",
    profissionais: 28,
    usuarios: 510,
  },
  {
    name: "Jun",
    profissionais: 25,
    usuarios: 590,
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
        <Bar dataKey="usuarios" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Usuários" />
      </BarChart>
    </ResponsiveContainer>
  )
}
