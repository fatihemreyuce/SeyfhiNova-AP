import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useServiceCategory,
  useDeleteServiceCategory,
} from "@/hooks/use-category-service";
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
  Layers,
  Filter,
  ArrowUpDown,
  GripVertical,
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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ServiceCategoryResponse } from "@/types/service.category.types";

// Sortable Row Component
interface SortableRowProps {
  item: ServiceCategoryResponse;
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
      className={`hover:bg-muted/50 transition-colors ${
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
      <TableCell>
        <Badge variant="outline" className="font-mono">
          #{item.id}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Layers className="h-4 w-4 text-primary dark:text-primary" />
          </div>
          <span className="font-medium dark:text-foreground">
            {item.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="max-w-md">
        <p className="text-sm text-muted-foreground dark:text-foreground/70 truncate">
          {item.description || "-"}
        </p>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="secondary" className="font-semibold">
          {item.orderIndex}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
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

export default function ServiceCategoryList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort, setSort] = useState("id,desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  const { data, isLoading } = useServiceCategory(search, page, size, sort);
  const deleteMutation = useDeleteServiceCategory();

  // Local state for drag & drop reordering
  const [items, setItems] = useState<ServiceCategoryResponse[]>([]);

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
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
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

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">
            Servis Kategorileri
          </h1>
          <p className="text-muted-foreground dark:text-foreground/70 mt-1">
            Servis kategorilerini görüntüleyin ve yönetin
          </p>
        </div>
        <Button onClick={() => navigate("/service-category/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kategori
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-foreground/60" />
          <Input
            placeholder="Kategori ara..."
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
            <SelectItem value="name,asc">İsim (A → Z)</SelectItem>
            <SelectItem value="name,desc">İsim (Z → A)</SelectItem>
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
            <Layers className="h-8 w-8 text-muted-foreground dark:text-foreground/60 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold dark:text-foreground mb-2">
            {search ? "Sonuç bulunamadı" : "Henüz kategori yok"}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-foreground/70 mb-4 text-center max-w-md">
            {search
              ? "Arama kriterlerinize uygun kategori bulunamadı. Farklı bir arama terimi deneyin."
              : "Servis kategorilerini yönetmeye başlamak için ilk kategoriyi oluşturun."}
          </p>
          {!search && (
            <Button onClick={() => navigate("/service-category/create")}>
              <Plus className="h-4 w-4 mr-2" />
              İlk Kategoriyi Oluştur
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground dark:text-foreground/70">
                Toplam <span className="font-semibold text-foreground">{data.totalElements}</span> kategori
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="overflow-x-auto scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Kategori Adı</TableHead>
                      <TableHead className="max-w-md">Açıklama</TableHead>
                      <TableHead className="w-[100px] text-center">Sıra</TableHead>
                      <TableHead className="w-[120px] text-right">İşlemler</TableHead>
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
                          onView={(id) => navigate(`/service-category/${id}`)}
                          onEdit={(id) => navigate(`/service-category/${id}/edit`)}
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
