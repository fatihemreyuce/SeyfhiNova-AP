import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useNotification,
  useDeleteNotification,
  useSendNotification,
} from "@/hooks/use-notifications";
import { useGetUserMe } from "@/hooks/use-user";
import { login } from "@/services/auth-services";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteModal } from "@/components/ui/delete-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bell,
  Send,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Filter,
  Lock,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NotificationResponse } from "@/types/notifications.types";

export default function NotificationList() {
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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordToSend, setPasswordToSend] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingSendId, setPendingSendId] = useState<number | null>(null);

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

  const { data, isLoading } = useNotification(page, size, sort);
  const deleteMutation = useDeleteNotification();
  const sendMutation = useSendNotification();
  const { data: userMe } = useGetUserMe();
  const [passwordError, setPasswordError] = useState<string>("");
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

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

  const handleSend = (id: number) => {
    setPendingSendId(id);
    setPasswordDialogOpen(true);
    setPasswordToSend("");
  };

  const confirmSend = async () => {
    if (!pendingSendId || !passwordToSend.trim()) {
      return;
    }

    if (!userMe?.email) {
      toast.error("Kullanıcı bilgisi alınamadı. Lütfen sayfayı yenileyin.");
      return;
    }

    setPasswordError("");
    setIsVerifyingPassword(true);

    try {
      // Şifre doğrulaması için login endpoint'ini kullan
      await login({
        email: userMe.email,
        password: passwordToSend,
      });

      // Şifre doğru, bildirimi gönder
      sendMutation.mutate(pendingSendId, {
        onSuccess: () => {
          setPasswordDialogOpen(false);
          setPendingSendId(null);
          setPasswordToSend("");
          setShowPassword(false);
          setPasswordError("");
        },
        onError: () => {
          // Bildirim gönderme hatası
          setPasswordError("");
        },
      });
    } catch (error: any) {
      // Şifre yanlış
      setPasswordError("Şifre yanlış. Lütfen tekrar deneyin.");
      setPasswordToSend("");
    } finally {
      setIsVerifyingPassword(false);
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

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-4 md:pb-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-foreground">
            Bildirimler
          </h1>
          <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/70 mt-1">
            Bildirimleri görüntüleyin, oluşturun ve gönderin
          </p>
        </div>
        <Button onClick={() => navigate("/notification/create")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Bildirim
        </Button>
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
            <Bell className="h-8 w-8 text-muted-foreground dark:text-foreground/60 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold dark:text-foreground mb-2">
            Henüz bildirim yok
          </h3>
          <p className="text-sm text-muted-foreground dark:text-foreground/70 mb-4 text-center max-w-md">
            Bildirimleri yönetmeye başlamak için ilk bildirimi oluşturun.
          </p>
          <Button onClick={() => navigate("/notification/create")}>
            <Plus className="h-4 w-4 mr-2" />
            İlk Bildirimi Oluştur
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-muted-foreground dark:text-foreground/70">
                Toplam <span className="font-semibold text-foreground">{data.totalElements}</span> bildirim
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
                  <TableRow className="bg-[#F8F9FA] dark:bg-muted/30 border-b border-gray-200 dark:border-border">
                    <TableHead className="w-[80px] h-9 py-2 text-xs font-medium">
                      <button
                        onClick={() => handleSortChange("id")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>ID</span>
                        {getSortIcon("id")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[200px] h-9 py-2 text-xs font-medium">
                      <button
                        onClick={() => handleSortChange("title")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>Başlık</span>
                        {getSortIcon("title")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[200px] max-w-md h-9 py-2 text-xs font-medium">İçerik</TableHead>
                    <TableHead className="w-[200px] text-right h-9 py-2 text-xs font-medium">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((item) => (
                    <TableRow
                      key={item.id}
                      className="bg-white dark:bg-card border-b border-gray-100 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="whitespace-nowrap py-1.5">
                        <Badge variant="outline" className="font-mono text-xs bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                          #{item.id}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[200px] py-1.5">
                        <span className="font-medium text-sm dark:text-foreground break-words">
                          {item.title}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[200px] max-w-md py-1.5">
                        <p className="text-xs text-muted-foreground dark:text-foreground/70 break-words line-clamp-2">
                          {truncateText(stripHtml(item.content))}
                        </p>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-1.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/notification/${item.id}`)}
                            className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30"
                            title="Detay Görüntüle"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/notification/${item.id}/edit`)}
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/30"
                            title="Düzenle"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSend(item.id)}
                            className="h-7 w-7 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/30"
                            title="Gönder"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id, item.title)}
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                            title="Sil"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* Password Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onOpenChange={(open) => {
          setPasswordDialogOpen(open);
          if (!open) {
            setPasswordToSend("");
            setShowPassword(false);
            setPendingSendId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Şifre Onayı</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Bildirimi göndermek için şifrenizi giriniz.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi giriniz"
                  value={passwordToSend}
                  onChange={(e) => {
                    setPasswordToSend(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && passwordToSend.trim() && !isVerifyingPassword) {
                      confirmSend();
                    }
                  }}
                  className={`pl-10 pr-10 h-12 text-base ${
                    passwordError ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 font-medium mt-1">{passwordError}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPasswordDialogOpen(false);
                setPasswordToSend("");
                setShowPassword(false);
                setPendingSendId(null);
                setPasswordError("");
              }}
              disabled={sendMutation.isPending || isVerifyingPassword}
            >
              İptal
            </Button>
            <Button
              onClick={confirmSend}
              disabled={!passwordToSend.trim() || sendMutation.isPending || isVerifyingPassword}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {isVerifyingPassword
                ? "Doğrulanıyor..."
                : sendMutation.isPending
                ? "Gönderiliyor..."
                : "Gönder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
