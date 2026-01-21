import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOfficialPages, useUpdateOfficialPage } from "@/hooks/use-offical-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import { ArrowLeft, Save, FileText, X, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  description: z.string().min(1, "Açıklama gereklidir"),
  documents: z.array(
    z.object({
      id: z.number().optional(),
      asset: z.any(),
      name: z.string().min(1, "Belge adı gereklidir"),
    })
  ),
  qualityPolicy: z.array(
    z.object({
      text: z.string().min(1, "Metin gereklidir"),
      orderNumber: z.number().min(0, "Sıra numarası 0 veya daha büyük olmalıdır"),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function OfficialPageEdit() {
  const navigate = useNavigate();
  
  // Resmi sayfayı çek
  const { data: officialPage, isLoading } = useOfficialPages();
  
  const updateMutation = useUpdateOfficialPage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = (values: FormValues) => {
    // Backend için documents dizisini dönüştür
    // Mevcut dokümanlar için: asset olarak boş string gönder (backend mevcut dosyayı korur)
    // Yeni dokümanlar için: asset (File) ve name gönder
    const formattedDocuments = values.documents.map((doc) => {
      // Eğer asset bir File ise, yeni doküman - asset (File) ve name gönder
      if (doc.asset instanceof File) {
        return {
          asset: doc.asset,
          name: doc.name,
        };
      }
      
      // Eğer asset bir string (URL) ise, mevcut doküman - asset olarak boş string gönder
      // Backend mevcut dosyayı korur, yeni dosya gönderilmediği sürece
      if (typeof doc.asset === "string" && doc.asset) {
        return {
          asset: "", // Boş string - backend mevcut dosyayı korur
          name: doc.name,
        };
      }
      
      // Diğer durumlar (sadece name varsa, yeni doküman ama dosya seçilmemiş)
      return {
        asset: "",
        name: doc.name || "",
      };
    });

    // qualityPolicy -> qualityPolitics olarak değiştir ve orderNumber'ı string'e çevir
    // objectToFormData içinde String() kullanılıyor ama yine de burada string olarak gönderelim
    const formattedQualityPolitics = values.qualityPolicy.map((policy) => ({
      text: policy.text,
      orderNumber: String(policy.orderNumber), // String'e çevir
    }));

    const requestData = {
      description: values.description,
      documents: formattedDocuments,
      qualityPolitics: formattedQualityPolitics, // qualityPolicy değil, qualityPolitics
    };

    console.log("Request Data:", requestData);
    console.log("Documents:", formattedDocuments);
    console.log("Quality Politics:", formattedQualityPolitics);

    updateMutation.mutate(requestData as any, {
      onSuccess: () => {
        navigate("/official-page");
      },
    });
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
    form.setValue(
      "documents",
      currentDocuments.filter((_, i) => i !== index)
    );
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
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/official-page")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resmi Sayfa Düzenle</h1>
          <p className="text-muted-foreground">
            Resmi sayfayı düzenleyin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Açıklama */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Açıklama</CardTitle>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Belgeler</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDocument}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Belge Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("documents").map((document, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex-1 space-y-4">
                    <FormField
                      control={form.control}
                      name={`documents.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Belge Adı</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Belge adı" />
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
                          <FormLabel>Dosya</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              {typeof document.asset === "string" && document.asset ? (
                                <div className="flex items-center gap-2 p-2 border rounded bg-background">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm flex-1 truncate">
                                    {document.asset}
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
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Input
                                  type="file"
                                  accept="*/*"
                                  onChange={(e) => {
                                    handleDocumentFileChange(index, e);
                                  }}
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
                    className="self-start mt-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {form.watch("documents").length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-8">
                  Henüz belge eklenmemiş. Yeni belge eklemek için "Belge Ekle" butonuna tıklayın.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Kalite Politikası */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Kalite Politikası</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQualityPolicy}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Politika Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("qualityPolicy").map((_policy, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex-1 space-y-4">
                    <FormField
                      control={form.control}
                      name={`qualityPolicy.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metin</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Kalite politikası metni" />
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
                          <FormLabel>Sıra Numarası</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                              placeholder="0"
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
                    onClick={() => handleRemoveQualityPolicy(index)}
                    className="self-start mt-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {form.watch("qualityPolicy").length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-8">
                  Henüz kalite politikası eklenmemiş. Yeni politika eklemek için "Politika Ekle" butonuna tıklayın.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/official-page")}
            >
              İptal
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
