"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  Edit,
  Trash,
  Instagram,
  Music,
  Phone,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { lojasService } from "@/services/fornecedores-parceiros";
import Loading from "../loading";

// Interface para o novo formato de retorno
interface AmanteDeDecoracao {
  id: string;
  name: string;
  contact: string;
  instagram: string;
  tiktok: string;
}

type AmantesDeDecoracao = AmanteDeDecoracao[];

export function AmantesDeDecoracaoList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amantesDeDecoracao, setAmantesDeDecoracao] = useState<AmantesDeDecoracao>([]);
  const [loading, setLoading] = useState(true);
  const [amanteToDelete, setAmanteToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadAmantesDeDecoracao = async () => {
      try {
        const data = await lojasService.listarFornecedoresParceiros1();
        setAmantesDeDecoracao(data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os amantes de decoração.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAmantesDeDecoracao();
  }, []);

  const filteredAmantes = amantesDeDecoracao.filter((amante) => {
    return (
      amante.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amante.contact.includes(searchTerm) ||
      amante.instagram.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amante.tiktok.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async () => {
    if (!amanteToDelete) return;

    try {
      await lojasService.deletePartnerSupplier(amanteToDelete);
      setAmantesDeDecoracao(
        amantesDeDecoracao.filter((amante) => amante.id !== amanteToDelete)
      );
      toast({
        title: "Amante de decoração excluído",
        description: "O amante de decoração foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o amante de decoração.",
        variant: "destructive",
      });
    } finally {
      setAmanteToDelete(null);
    }
  };

  if (loading) {
    return <Loading text="Carregando amantes de decoração..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar amantes de decoração..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Instagram</TableHead>
              <TableHead>TikTok</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAmantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum amante de decoração encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredAmantes.map((amante) => (
                <TableRow key={amante.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={amante.name}
                        />
                        <AvatarFallback>
                          {amante.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {amante.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{amante.contact}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://instagram.com/${amante.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        @{amante.instagram.replace('@', '')}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://tiktok.com/@${amante.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        @{amante.tiktok.replace('@', '')}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/amantes-decoracao/${amante.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setAmanteToDelete(amante.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog
        open={!!amanteToDelete}
        onOpenChange={(open) => !open && setAmanteToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este amante de decoração? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}