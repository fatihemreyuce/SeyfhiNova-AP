import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useOfficialPages,
  useUpdateOfficialPage,
  useUpdateOfficialPageDocument,
  useAddOfficialPageDocument,
  useDeleteOfficialPageDocument,
} from "@/hooks/use-offical-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Save, FileText, X, Plus, Trash2, Edit, Upload, CheckCircle2, AlertCircle, GripVertical } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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

const formSchema = z.object({
  description: z.string().min(1, "Açıklama gereklidir"),
  documents: z.array(
    z.object({
      id: z.number().optional(),
      asset: z.any(),
      name: z.string(),
    })
  ),
  qualityPolicy: z.array(
    z.object({
      text: z.string().min(1, "Metin gereklidir"),
      orderNumber: z.union([
        z.string().transform((val) => val === "" ? 0 : parseInt(val, 10) || 0),
        z.number()
      ]).refine((val) => val >= 0, "Sıra numarası 0 veya daha büyük olmalıdır"),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

function SortableQualityPolicyRow({
  index,
  form,
  onRemove,
}: {
  index: number;
  form: ReturnType<typeof useForm<FormValues>>;
  onRemove: () => void;
}) {
  const id = `qp-${index}`;
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
      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg bg-muted/30 ${
        isDragging ? "shadow-lg z-10 ring-2 ring-primary/30" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center sm:items-start pt-2 sm:pt-0 cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-muted/50 rounded transition-colors self-start"
      >
        <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
        <FormField
          control={form.control}
          name={`qualityPolicy.${index}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Metin</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Kalite politikası metni" className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`qualityPolicy.${index}.orderNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Sıra Numarası</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="max-w-[150px] text-sm sm:text-base"
                  placeholder="0"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) field.onChange(value);
                  }}
                  value={field.value === undefined || field.value === null ? "" : String(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="self-start sm:self-start mt-0 sm:mt-8 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
      >
        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
      </Button>
    </div>
  );
}

export default function OfficialPageEdit() {
  const navigate = useNavigate();
  const [editingDocumentIndex, setEditingDocumentIndex] = useState<number | null>(null);
  const [documentEditName, setDocumentEditName] = useState("");
  const [documentEditFile, setDocumentEditFile] = useState<File | null>(null);
  
  // Resmi sayfayı çek
  const { data: officialPage, isLoading } = useOfficialPages();
  
  const updateMutation = useUpdateOfficialPage();
  const updateDocumentMutation = useUpdateOfficialPageDocument();
  const addDocumentMutation = useAddOfficialPageDocument();
  const deleteDocumentMutation = useDeleteOfficialPageDocument();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      description: "",
      documents: [],
      qualityPolicy: [],
    },
  });

  useEffect(() => {
    if (officialPage) {
      form.reset({
        description: officialPage.description || "",
        documents: officialPage.documents || [],
        qualityPolicy: (officialPage as any).qualityPolitics?.map((p: any) => ({
          text: p.text,
          orderNumber: typeof p.orderNumber === "string" ? parseInt(p.orderNumber, 10) : p.orderNumber,
        })) || [],
      });
    }
  }, [officialPage, form]);

  const onSubmit = async (values: FormValues) => {
    const withFileWithoutName = values.documents.filter(
      (d) => d.asset instanceof File && (!d.name || typeof d.name !== "string" || d.name.trim() === "")
    );
    if (withFileWithoutName.length > 0) {
      toast.error("Dosyası olan yeni belgelerin adı girilmelidir.");
      return;
    }

    const formattedQualityPolitics = values.qualityPolicy.map((policy) => {
      const n =
        typeof policy.orderNumber === "string"
          ? policy.orderNumber === ""
            ? 0
            : parseInt(policy.orderNumber, 10) || 0
          : policy.orderNumber;
      return { text: policy.text, orderNumber: String(n) };
    });

    const newDocs = values.documents.filter(
      (d): d is { asset: File; name: string } =>
        d.asset instanceof File && typeof d.name === "string" && d.name.trim() !== ""
    );

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        description: values.description,
        qualityPolitics: formattedQualityPolitics,
      });
      for (const d of newDocs) {
        await addDocumentMutation.mutateAsync({ asset: d.asset, name: d.name.trim() });
      }
      navigate("/official-page");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDocument = () => {
    const currentDocuments = form.getValues("documents");
    form.setValue("documents", [
      ...currentDocuments,
      { asset: "", name: "" },
    ]);
  };

  const handleRemoveDocument = (index: number) => {
    const currentDocuments = form.getValues("documents");
    const doc = currentDocuments[index];
    const hasId = typeof doc?.id === "number";

    if (hasId && doc.id != null) {
      deleteDocumentMutation.mutate(doc.id, {
        onSuccess: () => {
          form.setValue(
            "documents",
            currentDocuments.filter((_, i) => i !== index)
          );
        },
      });
    } else {
      form.setValue(
        "documents",
        currentDocuments.filter((_, i) => i !== index)
      );
    }
  };

  const handleDocumentFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const currentDocuments = form.getValues("documents");
      const updatedDocuments = [...currentDocuments];
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        asset: file,
        name: updatedDocuments[index].name || file.name,
      };
      form.setValue("documents", updatedDocuments);
    }
  };

  const handleAddQualityPolicy = () => {
    const currentPolicies = form.getValues("qualityPolicy");
    const maxOrder = currentPolicies.length > 0
      ? Math.max(...currentPolicies.map((p) => p.orderNumber))
      : -1;
    form.setValue("qualityPolicy", [
      ...currentPolicies,
      { text: "", orderNumber: maxOrder + 1 },
    ]);
  };

  const handleRemoveQualityPolicy = (index: number) => {
    const currentPolicies = form.getValues("qualityPolicy");
    form.setValue(
      "qualityPolicy",
      currentPolicies.filter((_, i) => i !== index)
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleQualityPolicyDragEnd = (event: { active: { id: string }; over: { id: string } | null }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const policies = form.getValues("qualityPolicy");
    const oldIndex = policies.findIndex((_, i) => `qp-${i}` === active.id);
    const newIndex = policies.findIndex((_, i) => `qp-${i}` === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(policies, oldIndex, newIndex);
    const withOrder = reordered.map((p, i) => ({ ...p, orderNumber: i }));
    form.setValue("qualityPolicy", withOrder);
  };

  const handleEditDocumentInline = (index: number) => {
    const document = form.getValues("documents")[index];
    setEditingDocumentIndex(index);
    setDocumentEditName(document.name || "");
    setDocumentEditFile(null);
  };

  const handleCloseEditDialog = () => {
    setEditingDocumentIndex(null);
    setDocumentEditName("");
    setDocumentEditFile(null);
  };

  const handleSaveDocumentInline = () => {
    if (editingDocumentIndex === null) return;

    const document = form.getValues("documents")[editingDocumentIndex];
    const isExistingDocument = document.id && typeof document.asset === "string";

    // Eğer mevcut bir belge ise (id varsa), yeni hook ile güncelle
    if (isExistingDocument && document.id) {
      const request = {
        name: documentEditName,
        asset: documentEditFile || (typeof document.asset === "string" ? document.asset : ""),
      };

      updateDocumentMutation.mutate(
        { id: document.id, request },
        {
          onSuccess: () => {
            // Form'u güncelle
            const currentDocuments = form.getValues("documents");
            const updated = [...currentDocuments];
            updated[editingDocumentIndex] = {
              ...updated[editingDocumentIndex],
              name: documentEditName,
              asset: documentEditFile || updated[editingDocumentIndex].asset,
            };
            form.setValue("documents", updated);
            handleCloseEditDialog();
            toast.success("Belge başarıyla güncellendi");
          },
        }
      );
    } else {
      // Yeni belge ise, sadece form'u güncelle
      const currentDocuments = form.getValues("documents");
      const updated = [...currentDocuments];
      updated[editingDocumentIndex] = {
        ...updated[editingDocumentIndex],
        name: documentEditName,
        asset: documentEditFile || updated[editingDocumentIndex].asset,
      };
      form.setValue("documents", updated);
      handleCloseEditDialog();
    }
  };

  const handleDocumentEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentEditFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (!officialPage) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Resmi sayfa bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/official-page")}>
          <ArrowLeft className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/official-page")}
          className="self-start sm:self-auto h-9 w-9 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="h-4 w-4 text-primary dark:text-blue-400" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">Resmi Sayfa Düzenle</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Resmi sayfayı düzenleyin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FormValues>)} className="space-y-6">
          {/* Açıklama */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary dark:text-blue-400 flex-shrink-0" />
                <CardTitle className="text-lg sm:text-xl">Açıklama</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TinyMCEEditor
                        value={field.value}
                        onChange={field.onChange}
                        maxWords={100000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Belgeler */}
          <Card className="border-2 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="pb-3 sm:pb-4 border-b bg-gradient-to-r from-purple-500/5 to-transparent">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold">Belgeler</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {form.watch("documents").length} belge
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDocument}
                  className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 rounded-xl border-primary/20 hover:bg-primary/5 hover:border-primary/40"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Belge Ekle</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
              {form.watch("documents").map((document, index) => {
                const isExisting = document.id && typeof document.asset === "string" && document.asset;
                return (
                  <div
                    key={index}
                    className="group relative p-4 sm:p-5 border-2 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isExisting && (
                            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Mevcut
                            </Badge>
                          )}
                          {!isExisting && (
                            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Yeni
                            </Badge>
                          )}
                        </div>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs sm:text-sm font-semibold">Belge Adı</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Belge adı" 
                                  className="text-sm sm:text-base rounded-xl" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`documents.${index}.asset`}
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-xs sm:text-sm font-semibold">Dosya</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  {isExisting ? (
                                    <div className="flex items-center gap-2 p-3 border rounded-xl bg-background min-w-0">
                                      <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                      <span className="text-xs sm:text-sm flex-1 min-w-0 break-all text-muted-foreground">
                                        {document.asset}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditDocumentInline(index)}
                                        className="h-8 w-8 flex-shrink-0 rounded-lg hover:bg-primary/10"
                                        title="Düzenle"
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  ) : document.asset instanceof File ? (
                                    <div className="flex items-center gap-2 p-3 border rounded-xl bg-primary/5 border-primary/20">
                                      <Upload className="h-4 w-4 text-primary flex-shrink-0" />
                                      <span className="text-xs sm:text-sm flex-1 min-w-0 break-all font-medium">
                                        {(document.asset as File).name}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          const currentDocuments = form.getValues("documents");
                                          const updated = [...currentDocuments];
                                          updated[index] = { ...updated[index], asset: "" };
                                          form.setValue("documents", updated);
                                        }}
                                        className="h-8 w-8 flex-shrink-0 rounded-lg"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Input
                                      type="file"
                                      accept="*/*"
                                      onChange={(e) => {
                                        handleDocumentFileChange(index, e);
                                      }}
                                      className="text-xs sm:text-sm rounded-xl cursor-pointer"
                                    />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDocument(index)}
                        className="self-start h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {form.watch("documents").length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Henüz belge eklenmemiş. Yeni belge eklemek için "Belge Ekle" butonuna tıklayın.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Kalite Politikası */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary dark:text-blue-400 flex-shrink-0" />
                  <CardTitle className="text-lg sm:text-xl">Kalite Politikası</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQualityPolicy}
                  className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Politika Ekle</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleQualityPolicyDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext
                  items={form.watch("qualityPolicy").map((_, i) => `qp-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {form.watch("qualityPolicy").map((_, index) => (
                    <SortableQualityPolicyRow
                      key={index}
                      index={index}
                      form={form}
                      onRemove={() => handleRemoveQualityPolicy(index)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {form.watch("qualityPolicy").length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-8">
                  Henüz kalite politikası eklenmemiş. Yeni politika eklemek için "Politika Ekle" butonuna tıklayın.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/official-page")}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base rounded-xl"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base rounded-xl bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Save className="h-4 w-4 mr-2 text-white" />
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Document Edit Dialog */}
      <Dialog open={editingDocumentIndex !== null} onOpenChange={(open) => !open && handleCloseEditDialog()}>
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
                value={documentEditName}
                onChange={(e) => setDocumentEditName(e.target.value)}
                placeholder="Belge adını girin"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Dosya
              </label>
              {editingDocumentIndex !== null && 
               form.getValues("documents")[editingDocumentIndex]?.id &&
               typeof form.getValues("documents")[editingDocumentIndex].asset === "string" && 
               form.getValues("documents")[editingDocumentIndex].asset && 
               !documentEditFile && (
                <div className="flex items-center gap-2 p-3 border rounded-xl bg-muted/30">
                  <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm flex-1 min-w-0 break-all text-muted-foreground">
                    {form.getValues("documents")[editingDocumentIndex].asset}
                  </span>
                </div>
              )}
              {documentEditFile && (
                <div className="flex items-center gap-2 p-3 border rounded-xl bg-primary/5 border-primary/20">
                  <Upload className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm flex-1 min-w-0 break-all text-foreground font-medium">
                    {documentEditFile.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setDocumentEditFile(null)}
                    className="h-7 w-7 flex-shrink-0 rounded-lg"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              <Input
                type="file"
                accept="*/*"
                onChange={handleDocumentEditFileChange}
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
              onClick={handleSaveDocumentInline}
              disabled={!documentEditName.trim() || updateDocumentMutation.isPending}
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
