import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useContact,
  useDeleteContact,
} from "@/hooks/use-contact";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteModal } from "@/components/ui/delete-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Eye,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContactList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort] = useState("id,desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  const { data, isLoading } = useContact(page, size, sort);
  const deleteMutation = useDeleteContact();

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && data && newPage < data.totalPages) {
      setPage(newPage);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">İletişimler</h1>
          <p className="text-muted-foreground dark:text-foreground/70">
            İletişim kayıtlarını görüntüleyin ve yönetin
          </p>
        </div>
        <Button onClick={() => navigate("/contact/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni İletişim Ekle
        </Button>
      </div>

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground dark:text-foreground/70">Yükleniyor...</p>
          </div>
        ) : !data || data.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground dark:text-foreground/70 mb-4">
              Henüz iletişim kaydı bulunmamaktadır.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/contact/create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk İletişimi Oluştur
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ad</TableHead>
                    <TableHead>Soyad</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Konu</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline">{item.id}</Badge>
                      </TableCell>
                      <TableCell className="font-medium dark:text-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground dark:text-foreground/60" />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium dark:text-foreground">
                        {item.surname}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground dark:text-foreground/60" />
                          <span className="text-sm dark:text-foreground/80">{item.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium dark:text-foreground max-w-xs truncate">
                        {item.subject}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground dark:text-foreground/70 truncate">
                          {truncateText(stripHtml(item.description), 80)}
                        </p>
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
                                navigate(`/contact/${item.id}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Detay
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete(item.id, `${item.name} ${item.surname}`)
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
                <div className="text-sm text-muted-foreground dark:text-foreground/70">
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
