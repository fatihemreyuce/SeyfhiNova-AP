import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useHomePageAbout,
  useDeleteHomePageAbout,
} from "@/hooks/use-home-page-about";
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
  FileText,
  Filter,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { HomePageResponse } from "@/types/home.page.about.types";

export default function HomePageAboutList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpdatingURL = useRef(false);
  
  // URL'den parametreleri oku (ilk yüklemede)
  const getInitialSearch = () => searchParams.get("search") || "";
  const getInitialPage = () => parseInt(searchParams.get("page") || "0", 10);
  const getInitialSort = () => searchParams.get("sort") || "id,desc";
  
  const [searchInput, setSearchInput] = useState(getInitialSearch);
  const [search, setSearch] = useState(getInitialSearch);
  const [page, setPage] = useState(getInitialPage);
  const [size] = useState(10);
  const [sort, setSort] = useState(getInitialSort);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  // URL parametrelerini güncelle
  const updateURLParams = (updates: { search?: string; page?: number; sort?: string }) => {
    isUpdatingURL.current = true;
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      
      if (updates.search !== undefined) {
        if (updates.search) {
          newParams.set("search", updates.search);
        } else {
          newParams.delete("search");
        }
      }
      
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
    
    const urlSearch = searchParams.get("search") || "";
    const urlPage = parseInt(searchParams.get("page") || "0", 10);
    const urlSort = searchParams.get("sort") || "id,desc";
    
    if (urlSearch !== search) {
      setSearch(urlSearch);
      setSearchInput(urlSearch);
    }
    if (urlPage !== page) {
      setPage(urlPage);
    }
    if (urlSort !== sort) {
      setSort(urlSort);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounce search - 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        updateURLParams({ search: searchInput, page: 0 });
        setPage(0);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const { data, isLoading } = useHomePageAbout(search, page, size, sort);
  const deleteMutation = useDeleteHomePageAbout();

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
    updateURLParams({ search: "", page: 0 });
    setPage(0);
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

  const getSortLabel = (field: string, label: string) => {
    const [currentField, currentDir] = sort.split(",");
    if (currentField === field) {
      return `${label} ${currentDir === "asc" ? "(A → Z)" : "(Z → A)"}`;
    }
    return label;
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
    <div className="space-y-4 md:space-y-6 pb-4 md:pb-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-foreground">
            Ana Sayfa Hakkında
          </h1>
          <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/70 mt-1">
            Ana sayfa hakkında bölümlerini görüntüleyin ve yönetin
          </p>
        </div>
        <Button onClick={() => navigate("/home-page-about/create")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ekle
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70 dark:text-primary/80 z-10" />
          <Input
            placeholder="Ara..."
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
            <FileText className="h-8 w-8 text-muted-foreground dark:text-foreground/60 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold dark:text-foreground mb-2">
            {search ? "Sonuç bulunamadı" : "Henüz kayıt yok"}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-foreground/70 mb-4 text-center max-w-md">
            {search
              ? "Arama kriterlerinize uygun kayıt bulunamadı. Farklı bir arama terimi deneyin."
              : "Ana sayfa hakkında bölümlerini yönetmeye başlamak için ilk kaydı oluşturun."}
          </p>
          {!search && (
            <Button onClick={() => navigate("/home-page-about/create")}>
              <Plus className="h-4 w-4 mr-2" />
              İlk Kaydı Oluştur
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-muted-foreground dark:text-foreground/70">
                Toplam <span className="font-semibold text-foreground">{data.totalElements}</span> kayıt
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
                        onClick={() => handleSortChange("leftTitle")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>Sol Başlık</span>
                        {getSortIcon("leftTitle")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[200px] max-w-[300px]">
                      Sol Açıklama
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      <button
                        onClick={() => handleSortChange("rightTitle")}
                        className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                      >
                        <span>Sağ Başlık</span>
                        {getSortIcon("rightTitle")}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[200px] max-w-[300px]">
                      Sağ Açıklama
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
                          {item.leftTitle}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[200px] max-w-[300px]">
                        <p className="text-sm text-muted-foreground dark:text-foreground/70 break-words line-clamp-2">
                          {item.leftDescription ? stripHtml(item.leftDescription) : "-"}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <span className="font-medium dark:text-foreground break-words">
                          {item.rightTitle}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[200px] max-w-[300px]">
                        <p className="text-sm text-muted-foreground dark:text-foreground/70 break-words line-clamp-2">
                          {item.rightDescription ? stripHtml(item.rightDescription) : "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/home-page-about/${item.id}`)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30"
                            title="Detay Görüntüle"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/home-page-about/${item.id}/edit`)}
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/30"
                            title="Düzenle"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id, `${item.leftTitle} / ${item.rightTitle}`)}
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
