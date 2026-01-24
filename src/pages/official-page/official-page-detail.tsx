import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOfficialPages, useUpdateOfficialPageDocument, useUpdateOfficialPage } from "@/hooks/use-offical-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  FileText,
  Copy,
  Hash,
  ExternalLink,
  List,
  Sparkles,
  CheckCircle2,
  File,
  Upload,
  X,
  Save,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import type { Documents } from "@/types/offical.page.types";
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

// Sortable Policy Row Component
function SortablePolicyRow({
  policy,
  index,
  onCopy,
}: {
  policy: any;
  index: number;
  onCopy: (text: string, label: string) => void;
}) {
  const id = `policy-${index}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 sm:p-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 group/item ${
        isDragging ? "shadow-lg z-10 ring-2 ring-primary/30" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 -ml-2 hover:bg-muted/50 rounded transition-colors flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border-0 px-2 sm:px-3 py-1 text-xs font-semibold">
              Sıra: {typeof policy.orderNumber === "string" ? parseInt(policy.orderNumber, 10) : policy.orderNumber}
            </Badge>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: policy.text }}
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-900 dark:prose-p:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-primary dark:prose-a:text-primary text-xs sm:text-sm leading-relaxed break-words"
          />
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onCopy(policy.text, "Kalite politikası")}
          className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-accent dark:hover:bg-accent/80 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity"
          title="Kopyala"
        >
          <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-white" />
        </Button>
      </div>
    </div>
  );
}

export default function OfficialPageDetail() {
  const navigate = useNavigate();
  const [editingDocument, setEditingDocument] = useState<{ id: number; document: Documents } | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  
  // Resmi sayfayı çek
  const { data: officialPage, isLoading } = useOfficialPages();
  const updateDocumentMutation = useUpdateOfficialPageDocument();
  const updatePageMutation = useUpdateOfficialPage({ suppressToast: true });

  // Policies state'i güncelle
  useEffect(() => {
    if (officialPage && (officialPage as any).qualityPolitics) {
      const sorted = [...(officialPage as any).qualityPolitics].sort((a: any, b: any) => {
        const aOrder = typeof a.orderNumber === "string" ? parseInt(a.orderNumber, 10) : a.orderNumber;
        const bOrder = typeof b.orderNumber === "string" ? parseInt(b.orderNumber, 10) : b.orderNumber;
        return aOrder - bOrder;
      });
      setPolicies(sorted);
    }
  }, [officialPage]);

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

  // Handle drag end for policies
  const handlePolicyDragEnd = (event: { active: { id: string }; over: { id: string } | null }) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = policies.findIndex((_, i) => `policy-${i}` === active.id);
      const newIndex = policies.findIndex((_, i) => `policy-${i}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newPolicies = arrayMove(policies, oldIndex, newIndex);
        
        // Update orderNumber based on new position
        const updatedPolicies = newPolicies.map((policy, index) => ({
          ...policy,
          orderNumber: String(index),
        }));

        setPolicies(updatedPolicies);

        // Update backend
        updatePageMutation.mutate(
          {
            description: officialPage?.description || "",
            qualityPolitics: updatedPolicies.map((p) => ({
              text: p.text,
              orderNumber: String(p.orderNumber),
            })),
          },
          {
            onSuccess: () => {
              toast.success("Sıralama başarıyla güncellendi");
            },
            onError: () => {
              toast.error("Sıralama güncellenirken hata oluştu");
              // Revert on error
              if (officialPage && (officialPage as any).qualityPolitics) {
                const sorted = [...(officialPage as any).qualityPolitics].sort((a: any, b: any) => {
                  const aOrder = typeof a.orderNumber === "string" ? parseInt(a.orderNumber, 10) : a.orderNumber;
                  const bOrder = typeof b.orderNumber === "string" ? parseInt(b.orderNumber, 10) : b.orderNumber;
                  return aOrder - bOrder;
                });
                setPolicies(sorted);
              }
            },
          }
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground text-lg font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!officialPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Resmi sayfa bulunamadı</h3>
            <p className="text-muted-foreground">Resmi sayfa mevcut değil.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/official-page")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} panoya kopyalandı`);
    } catch (err) {
      toast.error(`${label} kopyalanamadı`);
    }
  };

  const handleEditDocument = (document: any) => {
    if (!document.id) {
      toast.error("Bu belge düzenlenemez - ID bulunamadı");
      return;
    }
    setEditingDocument({ id: document.id, document });
    setDocumentName(document.name || "");
    setDocumentFile(null);
  };

  const handleCloseEditDialog = () => {
    setEditingDocument(null);
    setDocumentName("");
    setDocumentFile(null);
  };

  const handleSaveDocument = () => {
    if (!editingDocument) return;

    const request: Documents = {
      name: documentName,
      asset: documentFile || (typeof editingDocument.document.asset === "string" ? editingDocument.document.asset : ""),
    };

    updateDocumentMutation.mutate(
      { id: editingDocument.id, request },
      {
        onSuccess: () => {
          handleCloseEditDialog();
          toast.success("Belge başarıyla güncellendi");
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/official-page")}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-muted transition-all duration-200 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground dark:text-white" />
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => navigate(`/official-page/edit`)}
                className="h-9 sm:h-10 px-2 sm:px-4 rounded-xl font-medium bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 text-white dark:text-white" />
                <span className="hidden sm:inline">Düzenle</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg flex-shrink-0">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground dark:text-white mb-2 break-words">
                Resmi Sayfa Detayı
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground/80">
                  Resmi sayfa detay bilgileri
                </p>
                <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-muted/50 dark:bg-muted/70 flex-shrink-0">
                  <Hash className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground dark:text-white" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground dark:text-white">ID: {officialPage.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Temel Bilgiler ve Kalite Politikası */}
          <div className="space-y-6">
            {/* Temel Bilgiler */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-3 sm:pb-4 border-b border-border/50 bg-gradient-to-r from-blue-500/5 via-blue-500/3 to-transparent">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground dark:text-white">
                    Temel Bilgiler
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                {/* Açıklama */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <label className="text-xs sm:text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                      Açıklama
                    </label>
                  </div>
                  <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300 min-h-[150px] sm:min-h-[200px]">
                    {officialPage.description ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: officialPage.description }}
                        className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-900 dark:prose-p:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-primary dark:prose-a:text-primary"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-center">
                        <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 italic">
                          Açıklama bulunmamaktadır
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kalite Politikası */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-3 sm:pb-4 border-b border-border/50 bg-gradient-to-r from-green-500/5 via-green-500/3 to-transparent">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 dark:from-green-500/30 dark:to-green-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <List className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-foreground dark:text-white truncate">
                      Kalite Politikası
                    </CardTitle>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-2 sm:px-3 py-1 text-xs font-semibold shadow-lg flex-shrink-0">
                    {(officialPage as any).qualityPolitics?.length || 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                {policies && policies.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handlePolicyDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  >
                    <SortableContext
                      items={policies.map((_, index) => `policy-${index}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3 sm:space-y-4">
                        {policies.map((policy, index) => (
                          <SortablePolicyRow
                            key={index}
                            policy={policy}
                            index={index}
                            onCopy={handleCopyText}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                      <List className="h-8 w-8 text-muted-foreground dark:text-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 italic">
                      Kalite politikası bulunmamaktadır
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Belgeler */}
          <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group h-fit">
            <CardHeader className="pb-3 sm:pb-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <File className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground dark:text-white truncate">
                    Belgeler
                  </CardTitle>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 px-2 sm:px-3 py-1 text-xs font-semibold shadow-lg flex-shrink-0">
                  {officialPage.documents?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              {officialPage.documents && officialPage.documents.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {officialPage.documents.map((document, index) => {
                    const assetUrl = typeof document.asset === "string" && document.asset
                      ? document.asset.replace(/^https:/, "http:") 
                      : null;
                    return (
                      <div
                        key={document.id || index}
                        className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 group/item"
                      >
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-foreground dark:text-white truncate mb-1">
                                {document.name || `Belge #${document.id || index + 1}`}
                              </p>
                              {assetUrl && (
                                <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 truncate">
                                  {assetUrl}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditDocument(document)}
                              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-colors"
                              title="Düzenle"
                            >
                              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            {assetUrl && (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    handleCopyText(assetUrl as string, "Belge URL")
                                  }
                                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-accent dark:hover:bg-accent/80"
                                  title="Kopyala"
                                >
                                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-white" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  asChild
                                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-accent dark:hover:bg-accent/80"
                                  title="Yeni sekmede aç"
                                >
                                  <a
                                    href={assetUrl as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground dark:text-white" />
                                  </a>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                    <File className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 italic">
                    Belge bulunmamaktadır
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Edit Dialog */}
      <Dialog open={!!editingDocument} onOpenChange={(open) => !open && handleCloseEditDialog()}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Belge Düzenle
            </DialogTitle>
            <DialogDescription>
              Belge adını ve dosyasını güncelleyebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Belge Adı
              </label>
              <Input
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Belge adını girin"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Dosya
              </label>
              {editingDocument && typeof editingDocument.document.asset === "string" && editingDocument.document.asset && !documentFile && (
                <div className="flex items-center gap-2 p-3 border rounded-xl bg-muted/30">
                  <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm flex-1 min-w-0 break-all text-muted-foreground">
                    {editingDocument.document.asset}
                  </span>
                </div>
              )}
              {documentFile && (
                <div className="flex items-center gap-2 p-3 border rounded-xl bg-primary/5 border-primary/20">
                  <Upload className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm flex-1 min-w-0 break-all text-foreground font-medium">
                    {documentFile.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setDocumentFile(null)}
                    className="h-7 w-7 flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              <Input
                type="file"
                accept="*/*"
                onChange={handleFileChange}
                className="rounded-xl cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Yeni dosya seçmezseniz mevcut dosya korunur.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseEditDialog}
              className="rounded-xl"
            >
              İptal
            </Button>
            <Button
              onClick={handleSaveDocument}
              disabled={!documentName.trim() || updateDocumentMutation.isPending}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateDocumentMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
