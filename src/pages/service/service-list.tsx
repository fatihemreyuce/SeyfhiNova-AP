import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useService,
  useDeleteService,
} from "@/hooks/use-service";
import { useServiceCategory } from "@/hooks/use-category-service";
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
  Briefcase,
  Filter,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ServiceList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort, setSort] = useState("id,desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  const { data, isLoading } = useService(search, page, size, sort);
  const { data: categoriesData } = useServiceCategory("", 0, 100, "id,asc");
  const deleteMutation = useDeleteService();

  const getCategoryName = (categoryId: number) => {
    const category = categoriesData?.content.find((cat) => cat.id === categoryId);
    return category?.name || `Kategori #${categoryId}`;
  };

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

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(0);
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
            Servisler
          </h1>
          <p className="text-muted-foreground dark:text-foreground/70 mt-1">
            Servisleri görüntüleyin ve yönetin
          </p>
        </div>
        <Button onClick={() => navigate("/service/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Servis
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-foreground/60" />
          <Input
            placeholder="Servis ara..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="h-4 w-4 mr-2 opacity-50" />
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id,desc">ID (Yeni → Eski)</SelectItem>
            <SelectItem value="id,asc">ID (Eski → Yeni)</SelectItem>
            <SelectItem value="title,asc">Başlık (A → Z)</SelectItem>
            <SelectItem value="title,desc">Başlık (Z → A)</SelectItem>
            <SelectItem value="orderIndex,asc">Sıra (Düşük → Yüksek)</SelectItem>
            <SelectItem value="orderIndex,desc">Sıra (Yüksek → Düşük)</SelectItem>
          </SelectContent>
        </Select>
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearch("")}
            className="shrink-0"
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
            <Briefcase className="h-8 w-8 text-muted-foreground dark:text-foreground/60 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold dark:text-foreground mb-2">
            {search ? "Sonuç bulunamadı" : "Henüz servis yok"}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-foreground/70 mb-4 text-center max-w-md">
            {search
              ? "Arama kriterlerinize uygun servis bulunamadı. Farklı bir arama terimi deneyin."
              : "Servisleri yönetmeye başlamak için ilk servisi oluşturun."}
          </p>
          {!search && (
            <Button onClick={() => navigate("/service/create")}>
              <Plus className="h-4 w-4 mr-2" />
              İlk Servisi Oluştur
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground dark:text-foreground/70">
                Toplam <span className="font-semibold text-foreground">{data.totalElements}</span> servis
              </span>
              {search && (
                <Badge variant="secondary" className="gap-1">
                  <Filter className="h-3 w-3 dark:text-foreground/80" />
                  Arama: "{search}"
                </Badge>
              )}
            </div>
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
                  <TableHead>Başlık</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="max-w-md">Açıklama</TableHead>
                  <TableHead className="w-[100px] text-center">Sıra</TableHead>
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
                          <Briefcase className="h-4 w-4 text-primary dark:text-primary" />
                        </div>
                        <span className="font-medium dark:text-foreground">
                          {item.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Layers className="h-3 w-3 dark:text-foreground/80" />
                        {getCategoryName(item.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground dark:text-foreground/70 truncate">
                        {truncateText(stripHtml(item.description))}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-semibold">
                        {item.orderIndex}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4 dark:text-foreground/80" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => navigate(`/service/${item.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2 dark:text-foreground/80" />
                            Detay Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/service/${item.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-2 dark:text-foreground/80" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id, item.title)}
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
                  <ChevronLeft className="h-4 w-4 mr-1 dark:text-foreground/80" />
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
                  <ChevronRight className="h-4 w-4 ml-1 dark:text-foreground/80" />
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
