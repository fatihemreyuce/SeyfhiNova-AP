import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useNotificationSubs,
  useDeleteNotificationSub,
} from "@/hooks/use-notifications-subs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteModal } from "@/components/ui/delete-modal";
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NotificationSubResponse } from "@/types/notification.subs.types";

export default function NotificationSubList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpdatingURL = useRef(false);
  
  // URL'den parametreleri oku (ilk yüklemede)
  const getInitialPage = () => parseInt(searchParams.get("page") || "0", 10);
  const getInitialSort = () => searchParams.get("sort") || "id,desc";
  
  const [page, setPage] = useState(getInitialPage);
  const [size] = useState(10);
  const [sort, setSort] = useState(getInitialSort);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  // URL parametrelerini güncelle
  const updateURLParams = (updates: { page?: number; sort?: string }) => {
    isUpdatingURL.current = true;
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      
      if (updates.page !== undefined) {
        if (updates.page > 0) {
          newParams.set("page", updates.page.toString());
        } else {
          newParams.delete("page");
        }
      }
      
      if (updates.sort !== undefined) {
        if (updates.sort !== "id,desc") {
          newParams.set("sort", updates.sort);
        } else {
          newParams.delete("sort");
        }
      }
      
      return newParams;
    }, { replace: true });
    
    // URL güncellemesi tamamlandıktan sonra flag'i sıfırla
    setTimeout(() => {
      isUpdatingURL.current = false;
    }, 0);
  };

  // URL değişikliklerini dinle (browser back/forward için)
  useEffect(() => {
    if (isUpdatingURL.current) {
      return; // Kendi güncellememizden kaynaklanan değişiklikleri ignore et
    }
    
    const urlPage = parseInt(searchParams.get("page") || "0", 10);
    const urlSort = searchParams.get("sort") || "id,desc";
    
    if (urlPage !== page) {
      setPage(urlPage);
    }
    if (urlSort !== sort) {
      setSort(urlSort);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { data, isLoading } = useNotificationSubs(page, size, sort);
  const deleteMutation = useDeleteNotificationSub();

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
      updateURLParams({ page: newPage });
    }
  };

  const handleSortChange = (field: string) => {
    const [currentField, currentDir] = sort.split(",");
    let newSort: string;
    if (currentField === field) {
      // Aynı alana tıklandıysa yönü değiştir
      newSort = `${field},${currentDir === "asc" ? "desc" : "asc"}`;
    } else {
      // Yeni alana tıklandıysa varsayılan olarak desc yap
      newSort = `${field},desc`;
    }
    setSort(newSort);
    setPage(0);
    updateURLParams({ sort: newSort, page: 0 });
  };

  const getSortIcon = (field: string) => {
    const [currentField, currentDir] = sort.split(",");
    if (currentField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />;
    }
    return currentDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary dark:text-blue-400" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary dark:text-blue-400" />
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-4 md:pb-6 px-4 md:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-foreground">
          Bildirim Abonelikleri
        </h1>
        <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/70 mt-1">
          Sitedeki bülten formu üzerinden gelen abonelikleri görüntüleyin ve yönetin
        </p>
      </div>

      {/* Search and Filters - Removed search as API doesn't support it */}

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
            <Mail className="h-8 w-8 text-muted-foreground dark:text-foreground/60 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold dark:text-foreground mb-2">
            Henüz abonelik yok
          </h3>
          <p className="text-sm text-muted-foreground dark:text-foreground/70 text-center max-w-md">
            Abonelikler sitedeki bülten formu üzerinden oluşturulur. Henüz kayıt bulunmuyor.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-muted-foreground dark:text-foreground/70">
                Toplam <span className="font-semibold text-foreground">{data.totalElements}</span> abonelik
              </span>
            </div>
            <span className="text-muted-foreground dark:text-foreground/70">
              Sayfa {page + 1} / {data.totalPages}
            </span>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8F9FA] dark:bg-muted/30 border-b border-gray-200 dark:border-seyfhi-accent/30">
                    <TableHead className="w-[80px]">
                      <button
                        onClick={() => handleSortChange("id")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>ID</span>
                        {getSortIcon("id")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      <button
                        onClick={() => handleSortChange("name")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>Ad</span>
                        {getSortIcon("name")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      <button
                        onClick={() => handleSortChange("surname")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>Soyad</span>
                        {getSortIcon("surname")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[200px]">
                      <button
                        onClick={() => handleSortChange("email")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>E-posta</span>
                        {getSortIcon("email")}
                      </button>
                    </TableHead>
                    <TableHead className="w-[200px] text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((item) => (
                    <TableRow
                      key={item.id}
                      className="bg-white dark:bg-card border-b border-gray-100 dark:border-seyfhi-accent/20 hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="font-mono bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                          #{item.id}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <span className="font-medium dark:text-foreground break-words">
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <span className="font-medium dark:text-foreground break-words">
                          {item.surname}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground dark:text-foreground/60 shrink-0" />
                          <span className="text-sm dark:text-foreground/80 break-words">{item.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/notification-sub/${item.id}`)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30"
                            title="Detay Görüntüle"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id, `${item.name} ${item.surname}`)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {data && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 bg-background border rounded-lg shadow-sm mt-4">
              <div className="text-xs sm:text-sm text-muted-foreground dark:text-foreground/70">
                {data.totalElements > 0 && (
                  <>
                    <span className="font-medium text-foreground">{(page * size) + 1}</span> - <span className="font-medium text-foreground">{Math.min((page + 1) * size, data.totalElements)}</span> / <span className="font-medium text-foreground">{data.totalElements}</span> kayıt gösteriliyor
                  </>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground dark:text-foreground/70">Sayfa</span>
                  <div className="px-3 sm:px-4 py-2 bg-muted/50 border-2 border-border rounded-lg">
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      {page + 1} / {data.totalPages || 1}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="h-9 px-4 font-medium bg-background hover:bg-muted border-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Önceki
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= (data.totalPages || 1) - 1}
                    className="h-9 px-4 font-medium bg-background hover:bg-muted border-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background"
                  >
                    Sonraki
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
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
