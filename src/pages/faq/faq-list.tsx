import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useFaq,
  useDeleteFaq,
} from "@/hooks/use-faqs";
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
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FaqList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort] = useState("id,desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  const { data, isLoading } = useFaq(search, page, size, sort);
  const deleteMutation = useDeleteFaq();

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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sıkça Sorulan Sorular</h1>
          <p className="text-muted-foreground">
            Sıkça sorulan soruları yönetin ve düzenleyin
          </p>
        </div>
        <Button onClick={() => navigate("/faq/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Soru Ekle
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Soru ara..."
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
              <HelpCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Henüz soru bulunmamaktadır.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/faq/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Soruyu Oluştur
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Soru</TableHead>
                      <TableHead>Cevap</TableHead>
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
                        <TableCell className="font-medium">
                          {item.question}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm text-muted-foreground truncate">
                            {truncateText(stripHtml(item.answer), 80)}
                          </p>
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
                                  navigate(`/faq/${item.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Detay
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/faq/${item.id}/edit`)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDelete(item.id, item.question)
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
