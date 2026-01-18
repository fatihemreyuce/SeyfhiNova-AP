import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReferance,
  useDeleteReferance,
} from "@/hooks/use-referance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteModal } from "@/components/ui/delete-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Award,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReferanceList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort] = useState("id,desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  const { data, isLoading } = useReferance(search, page, size, sort);
  const deleteMutation = useDeleteReferance();

  const handleDelete = (id: number, itemName: string) => {
    setSelectedId(id);
    setSelectedItemName(itemName);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      deleteMutation.mutate(selectedId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedId(null);
          setSelectedItemName("");
        },
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && data && newPage < data.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referanslar</h1>
          <p className="text-muted-foreground">
            Referansları yönetin ve düzenleyin
          </p>
        </div>
        <Button onClick={() => navigate("/referance/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Referans Ekle
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Referans ara..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          ) : !data || data.content.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Henüz referans bulunmamaktadır.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/referance/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Referansı Oluştur
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Logo</TableHead>
                      <TableHead>İsim</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead>Web Sitesi</TableHead>
                      <TableHead>Sıra</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.content.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline">{item.id}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.logoUrl ? (
                            <div className="flex items-center justify-center w-16 h-16 rounded-md overflow-hidden bg-muted border border-border">
                              <img
                                src={item.logoUrl.replace(/^https:/, 'http:')}
                                alt={item.name}
                                className="w-full h-full object-contain p-2"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-md bg-muted/50 border border-border flex items-center justify-center">
                              <Award className="h-4 w-4 text-muted-foreground opacity-50" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm text-muted-foreground truncate">
                            {item.description ? item.description.replace(/<[^>]*>/g, "").substring(0, 80) + "..." : "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          {item.websiteUrl ? (
                            <a
                              href={item.websiteUrl.replace(/^https:/, 'http:')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <span className="truncate max-w-[200px]">
                                {item.websiteUrl}
                              </span>
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.orderIndex}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/referance/${item.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Detay
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/referance/${item.id}/edit`)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDelete(item.id, item.name)
                                }
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Toplam {data.totalElements} kayıt, Sayfa {page + 1} /{" "}
                    {data.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= data.totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
      </div>

      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        itemName={selectedItemName}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
