import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  usePartner,
  useDeletePartner,
  useUpdatePartner,
} from "@/hooks/use-partners";
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
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GripVertical,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PartnerResponse } from "@/types/partners.types";

// Sortable Row Component
interface SortableRowProps {
  item: PartnerResponse;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

function SortableRow({ item, onView, onEdit, onDelete }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-card border-b border-gray-100 dark:border-seyfhi-accent/20 hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors ${
        isDragging ? "shadow-lg z-10 opacity-50" : ""
      }`}
    >
      <TableCell className="w-[50px]">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 -ml-2 hover:bg-muted/50 rounded transition-colors"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <Badge variant="outline" className="font-mono bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
          #{item.id}
        </Badge>
      </TableCell>
      <TableCell>
        {item.logoUrl ? (
          <div className="flex items-center justify-center w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border">
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
          <div className="w-20 h-20 rounded-lg bg-muted/50 border border-border flex items-center justify-center">
            <Handshake className="h-5 w-5 text-muted-foreground dark:text-foreground/60 opacity-50" />
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[200px]">
        <span className="font-medium dark:text-foreground break-words">
          {item.name}
        </span>
      </TableCell>
      <TableCell className="text-center whitespace-nowrap">
        <Badge variant="secondary" className="font-semibold">
          {item.orderIndex}
        </Badge>
      </TableCell>
      <TableCell className="text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(item.id)}
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30"
            title="Detay Görüntüle"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item.id)}
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/30"
            title="Düzenle"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id, item.name)}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
            title="Sil"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function PartnerList() {
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

  const { data, isLoading } = usePartner(search, page, size, sort);
  const deleteMutation = useDeletePartner();
  const updateMutation = useUpdatePartner();

  // Local state for drag & drop reordering
  const [items, setItems] = useState<PartnerResponse[]>([]);

  // Update items when data changes
  useEffect(() => {
    if (data?.content) {
      setItems(data.content);
    }
  }, [data]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: { active: { id: number }; over: { id: number } | null }) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      const sortedByCurrentOrder = [...items].sort((a, b) => b.orderIndex - a.orderIndex);
      const maxOrderIndex = sortedByCurrentOrder[0]?.orderIndex || 0;

      const updates: Array<{ id: number; orderIndex: number }> = [];
      newItems.forEach((item, index) => {
        const newOrderIndex = maxOrderIndex - index;
        if (item.orderIndex !== newOrderIndex) {
          updates.push({ id: item.id, orderIndex: newOrderIndex });
        }
      });

      setItems(newItems);

      if (updates.length > 0) {
        Promise.all(
          updates.map((update) => {
            const item = newItems.find((item) => item.id === update.id)!;
            return updateMutation.mutateAsync({
              id: update.id,
              request: {
                name: item.name,
                orderIndex: update.orderIndex,
              },
            });
          })
        )
          .then(() => {
            toast.success("Sıralama başarıyla güncellendi");
          })
          .catch(() => {
            toast.error("Sıralama güncellenirken hata oluştu");
            if (data?.content) {
              setItems(data.content);
            }
          });
      }
    }
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

  return (
    <div className="space-y-4 md:space-y-6 pb-4 md:pb-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-foreground">
            Ortaklar
          </h1>
          <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/70 mt-1">
            Ortakları görüntüleyin ve yönetin
          </p>
        </div>
        <Button onClick={() => navigate("/partner/create")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ortak
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60 dark:text-foreground/60 z-10" />
          <Input
            placeholder="Ortak ara..."
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="pl-12 pr-4 h-12 text-base border border-gray-200 dark:border-gray-700 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-card rounded-lg"
          />
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
            <Handshake className="h-8 w-8 text-muted-foreground dark:text-foreground/60 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold dark:text-foreground mb-2">
            {search ? "Sonuç bulunamadı" : "Henüz ortak yok"}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-foreground/70 mb-4 text-center max-w-md">
            {search
              ? "Arama kriterlerinize uygun ortak bulunamadı. Farklı bir arama terimi deneyin."
              : "Ortakları yönetmeye başlamak için ilk ortağı oluşturun."}
          </p>
          {!search && (
            <Button onClick={() => navigate("/partner/create")}>
              <Plus className="h-4 w-4 mr-2" />
              İlk Ortağı Oluştur
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-muted-foreground dark:text-foreground/70">
                Toplam <span className="font-semibold text-foreground">{data.totalElements}</span> ortak
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <div className="overflow-x-auto scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F8F9FA] dark:bg-muted/30 border-b border-gray-200 dark:border-seyfhi-accent/30">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="w-[80px]">
                        <button
                          onClick={() => handleSortChange("id")}
                          className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                        >
                          <span>ID</span>
                          {getSortIcon("id")}
                        </button>
                      </TableHead>
                      <TableHead className="w-[120px]">Logo</TableHead>
                      <TableHead className="min-w-[200px]">
                        <button
                          onClick={() => handleSortChange("name")}
                          className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                        >
                          <span>İsim</span>
                          {getSortIcon("name")}
                        </button>
                      </TableHead>
                      <TableHead className="w-[100px] text-center">
                        <button
                          onClick={() => handleSortChange("orderIndex")}
                          className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded transition-colors mx-auto"
                        >
                          <span>Sıra</span>
                          {getSortIcon("orderIndex")}
                        </button>
                      </TableHead>
                      <TableHead className="w-[200px] text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={items.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {items.map((item) => (
                        <SortableRow
                          key={item.id}
                          item={item}
                          onView={(id) => navigate(`/partner/${id}`)}
                          onEdit={(id) => navigate(`/partner/${id}/edit`)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </div>
            </DndContext>
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
