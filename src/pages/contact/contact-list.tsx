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
  RefreshCw,
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

  const { data, isLoading, refetch } = useContact(page, size, sort);
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

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">
            İletişimler
          </h1>
          <p className="text-muted-foreground dark:text-foreground/70 mt-1">
            İletişim kayıtlarını görüntüleyin ve yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate("/contact/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni İletişim
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-sm text-muted-foreground dark:text-foreground/70">
              Yükleniyor...
            </p>
          </div>
        </div>
      ) : !data || data.content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-lg font-semibold dark:text-foreground mb-2">
            Henüz iletişim kaydı yok
          </h3>
          <p className="text-sm text-muted-foreground dark:text-foreground/70 mb-4 text-center max-w-md">
            İletişim kayıtlarını yönetmeye başlamak için ilk iletişimi oluşturun.
          </p>
          <Button onClick={() => navigate("/contact/create")}>
            <Plus className="h-4 w-4 mr-2" />
            İlk İletişimi Oluştur
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground dark:text-foreground/70">
              Toplam <span className="font-semibold text-foreground">{data.totalElements}</span> iletişim
            </span>
            <span className="text-muted-foreground dark:text-foreground/70">
              Sayfa {page + 1} / {data.totalPages}
            </span>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Ad</TableHead>
                  <TableHead>Soyad</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead className="max-w-xs">Konu</TableHead>
                  <TableHead className="max-w-md">Açıklama</TableHead>
                  <TableHead className="w-[120px] text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        #{item.id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium dark:text-foreground">
                          {item.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium dark:text-foreground">
                        {item.surname}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground dark:text-foreground/60" />
                        <span className="text-sm dark:text-foreground/80">{item.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="font-medium dark:text-foreground truncate block">
                        {item.subject}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground dark:text-foreground/70 truncate">
                        {truncateText(stripHtml(item.description))}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => navigate(`/contact/${item.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detay Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id, `${item.name} ${item.surname}`)}
                            className="text-destructive focus:text-destructive"
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

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground dark:text-foreground/70">
                {data.totalElements > 0 && (
                  <>
                    {(page * size) + 1} - {Math.min((page + 1) * size, data.totalElements)} / {data.totalElements} kayıt gösteriliyor
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Önceki
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    let pageNum;
                    if (data.totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > data.totalPages - 4) {
                      pageNum = data.totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-9 h-9 p-0"
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= data.totalPages - 1}
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

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
