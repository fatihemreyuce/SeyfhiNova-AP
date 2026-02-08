import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useUsers,
  useDeleteUser,
} from "@/hooks/use-user";
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
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Mail,
  Shield,
  UserCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserResponse } from "@/types/user.types";

export default function UserList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL'den parametreleri oku
  const urlSearch = searchParams.get("search") || "";
  const urlPage = parseInt(searchParams.get("page") || "0", 10);
  const urlSort = searchParams.get("sort") || "id,desc";
  
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [search, setSearch] = useState(urlSearch);
  const [page, setPage] = useState(urlPage);
  const [size] = useState(10);
  const [sort, setSort] = useState(urlSort);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  // URL parametrelerini güncelle
  const updateURLParams = useCallback((newSearch: string, newPage: number, newSort: string) => {
    const params = new URLSearchParams();
    if (newSearch) {
      params.set("search", newSearch);
    }
    if (newPage > 0) {
      params.set("page", newPage.toString());
    }
    if (newSort && newSort !== "id,desc") {
      params.set("sort", newSort);
    }
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // URL'den gelen parametreleri state'e senkronize et (sadece URL değiştiğinde)
  useEffect(() => {
    // URL'den gelen değerler state'ten farklıysa güncelle
    if (urlSearch !== searchInput) {
      setSearchInput(urlSearch);
      setSearch(urlSearch);
    }
    if (urlPage !== page) {
      setPage(urlPage);
    }
    if (urlSort !== sort) {
      setSort(urlSort);
    }
  }, [urlSearch, urlPage, urlSort]);

  // Debounce search - 500ms delay
  useEffect(() => {
    // Eğer searchInput URL'deki değerle aynıysa URL'i güncelleme
    if (searchInput === urlSearch) {
      return;
    }

    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
      updateURLParams(searchInput, 0, sort);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, sort, urlSearch, updateURLParams]);

  const { data, isLoading } = useUsers(search, page, size, sort);
  const deleteMutation = useDeleteUser();

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

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(0);
    updateURLParams("", 0, sort);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && data && newPage < data.totalPages) {
      setPage(newPage);
      updateURLParams(search, newPage, sort);
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
    updateURLParams(search, 0, newSort);
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

  const getRoleBadge = (role: string) => {
    if (role === "ROLE_ADMIN") {
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300">
        <UserCircle className="h-3 w-3 mr-1" />
        Editör
      </Badge>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-4 md:pb-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-foreground">
            Kullanıcılar
          </h1>
          <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/70 mt-1">
            Kullanıcıları görüntüleyin ve yönetin
          </p>
        </div>
        <Button onClick={() => navigate("/user/create")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kullanıcı
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70 dark:text-primary/80 z-10" />
          <Input
            placeholder="Kullanıcı adı, e-posta veya ad soyad ile ara..."
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="pl-12 pr-12 h-12 text-base border-2 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-md hover:shadow-lg transition-all duration-200 bg-background dark:bg-card"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
              type="button"
              title="Temizle"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchInput && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="shrink-0 h-10"
          >
            Temizle
          </Button>
        )}
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
            <User className="h-8 w-8 text-muted-foreground dark:text-foreground/60 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold dark:text-foreground mb-2">
            {search ? "Sonuç bulunamadı" : "Henüz kullanıcı yok"}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-foreground/70 mb-4 text-center max-w-md">
            {search
              ? "Arama kriterlerinize uygun kullanıcı bulunamadı. Farklı bir arama terimi deneyin."
              : "Sisteme kullanıcı eklemek için ilk kullanıcıyı oluşturun."}
          </p>
          {!search && (
            <Button onClick={() => navigate("/user/create")}>
              <Plus className="h-4 w-4 mr-2" />
              İlk Kullanıcıyı Oluştur
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-muted-foreground dark:text-foreground/70">
                Toplam <span className="font-semibold text-foreground">{data.totalElements}</span> kullanıcı
              </span>
              {searchInput && (
                <Badge variant="secondary" className="gap-1">
                  <Filter className="h-3 w-3 dark:text-foreground/80" />
                  Arama: "{searchInput}"
                </Badge>
              )}
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
                        onClick={() => handleSortChange("username")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>Kullanıcı Adı</span>
                        {getSortIcon("username")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[250px] h-9 py-2 text-xs font-medium">
                      <button
                        onClick={() => handleSortChange("email")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>E-posta</span>
                        {getSortIcon("email")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[180px] h-9 py-2 text-xs font-medium">
                      <button
                        onClick={() => handleSortChange("firstName")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>Ad Soyad</span>
                        {getSortIcon("firstName")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[140px] h-9 py-2 text-xs font-medium">
                      <button
                        onClick={() => handleSortChange("role")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>Rol</span>
                        {getSortIcon("role")}
                      </button>
                    </TableHead>
                    <TableHead className="w-[200px] text-right h-9 py-2 text-xs font-medium">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((user) => (
                    <TableRow
                      key={user.id}
                      className="bg-white dark:bg-card border-b border-gray-100 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="whitespace-nowrap py-1.5">
                        <Badge variant="outline" className="font-mono bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                          #{user.id}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-muted-foreground dark:text-foreground/60 shrink-0" />
                          <span className="font-medium dark:text-foreground break-words">
                            {user.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[250px]">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground dark:text-foreground/60 shrink-0" />
                          <span className="text-sm dark:text-foreground/80 break-words">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <span className="font-medium dark:text-foreground break-words">
                          {user.firstName} {user.lastName}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/user/${user.id}`)}
                            className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30"
                            title="Detay Görüntüle"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/user/${user.id}/edit`)}
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/30"
                            title="Düzenle"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id, `${user.username} (${user.email})`)}
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
    </div>
  );
}
