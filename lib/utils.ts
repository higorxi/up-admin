import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const diasDaSemana = [
  { id: "SUNDAY", label: "Domingo" },
  { id: "MONDAY", label: "Segunda-feira" },
  { id: "TUESDAY", label: "Terça-feira" },
  { id: "WEDNESDAY", label: "Quarta-feira" },
  { id: "THURSDAY", label: "Quinta-feira" },
  { id: "FRIDAY", label: "Sexta-feira" },
  { id: "SATURDAY", label: "Sábado" },
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getDayLabelById(id: string): string {
  const day = diasDaSemana.find((d) => d.id === id.toUpperCase());
  return day ? day.label : id;
}

export default diasDaSemana;