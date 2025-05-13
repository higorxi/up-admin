import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: {
      name: "João Silva",
      image: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    action: "aprovou o cadastro de",
    target: "Maria Oliveira",
    time: "há 5 minutos",
  },
  {
    id: 2,
    user: {
      name: "Ana Costa",
      image: "/placeholder.svg?height=32&width=32",
      initials: "AC",
    },
    action: "cadastrou uma nova loja",
    target: "Loja Central",
    time: "há 15 minutos",
  },
  {
    id: 3,
    user: {
      name: "Pedro Santos",
      image: "/placeholder.svg?height=32&width=32",
      initials: "PS",
    },
    action: "rejeitou o cadastro de",
    target: "Carlos Ferreira",
    time: "há 30 minutos",
  },
  {
    id: 4,
    user: {
      name: "Lucia Mendes",
      image: "/placeholder.svg?height=32&width=32",
      initials: "LM",
    },
    action: "atualizou o perfil de",
    target: "Roberto Alves",
    time: "há 1 hora",
  },
  {
    id: 5,
    user: {
      name: "Marcos Pereira",
      image: "/placeholder.svg?height=32&width=32",
      initials: "MP",
    },
    action: "adicionou um novo usuário",
    target: "Fernanda Lima",
    time: "há 2 horas",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={activity.user.image || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-semibold">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
