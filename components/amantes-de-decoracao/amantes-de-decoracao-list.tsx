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
  MapPin,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PartnerSuppliers,
  Professional,
  PartnerSupplier,
  mapPartnerSupplierToDisplayData,
} from "@/types/Fornecedor-Parceiro/FornecedorParceiro";
import { lojasService } from "@/services/fornecedores-parceiros";
import Loading from "../loading";

export function AmantesDeDecoracaoList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerSuppliers, setPartnerSuppliers] = useState<PartnerSuppliers>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadPartnerSuppliers = async () => {
      try {
        const data = await lojasService.listarFornecedoresParceiros();
        setPartnerSuppliers(data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os fornecedores parceiros.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPartnerSuppliers();
  }, []);

  const filteredPartners = partnerSuppliers.filter((partner) => {
    const displayData = mapPartnerSupplierToDisplayData(partner);
    return (
      displayData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      displayData.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      displayData.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.document.includes(searchTerm)
    );
  });

  const handleDelete = async () => {
    if (!partnerToDelete) return;

    try {
      await lojasService.deletePartnerSupplier(partnerToDelete);
      setPartnerSuppliers(
        partnerSuppliers.filter((p) => p.id !== partnerToDelete)
      );
      toast({
        title: "Fornecedor excluído",
        description: "O fornecedor parceiro foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o fornecedor parceiro.",
        variant: "destructive",
      });
    } finally {
      setPartnerToDelete(null);
    }
  };

  const handleToggleAccess = async (
    partnerId: string,
    currentStatus: boolean
  ) => {
    try {
      if (currentStatus) {
        await lojasService.atualizarPendenciaFornecedor(partnerId, true);
      } else {
        await lojasService.atualizarPendenciaFornecedor(partnerId, false);
      }

      setPartnerSuppliers(
        partnerSuppliers.map((partner) =>
          partner.id === partnerId
            ? { ...partner, accessPending: !currentStatus }
            : partner
        )
      );

      toast({
        title: `Acesso ${!currentStatus ? "concedido" : "revogado"}`,
        description: `O acesso foi ${
          !currentStatus ? "concedido" : "revogado"
        } com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar o status de acesso.",
        variant: "destructive",
      });
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
            placeholder="Buscar fornecedores parceiros..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" asChild>
          <Link href="/profissionais/aprovacao">Pendentes de Aprovação</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Loja</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status de Acesso</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum amante de decoração encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners.map((partner) => {
                const displayData = mapPartnerSupplierToDisplayData(partner);
                return (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={partner.profileImage || "/placeholder.svg"}
                            alt={displayData.name}
                          />
                          <AvatarFallback>
                            {displayData.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {displayData.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {partner.companyName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {partner.document}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {partner.store?.name || "Sem loja"}
                        </span>
                        {partner.store?.website && (
                          <a
                            href={partner.store.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {partner.store.website}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {partner.store ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {partner.store.address.city},{" "}
                            {partner.store.address.state}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Sem endereço
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={partner.accessPending ? "warning" : "success"}
                      >
                        {partner.accessPending ? "Pendente" : "Liberado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {partner.store ? (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{partner.store.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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
                            <Link href={`/partner-suppliers/${partner.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleAccess(
                                partner.id,
                                !partner.accessPending
                              )
                            }
                          >
                            {partner.accessPending
                              ? "Liberar acesso"
                              : "Revogar acesso"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setPartnerToDelete(partner.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog
        open={!!partnerToDelete}
        onOpenChange={(open) => !open && setPartnerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este fornecedor parceiro? Esta ação
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
