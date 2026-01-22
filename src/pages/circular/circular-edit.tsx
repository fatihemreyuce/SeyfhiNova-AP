import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCircularById, useUpdateCircular } from "@/hooks/use-circulars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import { ArrowLeft, Save, FileText, Upload, X, File, Download, ExternalLink } from "lucide-react";
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
  file: z.any().optional(),
  title: z.string()
    .min(1, "Başlık gereklidir")
    .max(255, "Başlık en fazla 255 karakter olabilir"),
  description: z.string().min(1, "Açıklama gereklidir"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CircularEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCircularById(Number(id));
  const updateMutation = useUpdateCircular();
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        description: data.description,
      });
      if (data.fileUrl) {
        const urlParts = data.fileUrl.split('/');
        setFileName(urlParts[urlParts.length - 1] || "Mevcut dosya");
      }
    }
  }, [data, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File | undefined) => void) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileSize((selectedFile.size / (1024 * 1024)).toFixed(2) + " MB");
      onChange(selectedFile);
    }
  };

  const handleClearFile = (onChange: (value: undefined) => void) => {
    setFile(null);
    setFileName("");
    setFileSize("");
    onChange(undefined);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    // Mevcut dosyayı geri yükle
    if (data?.fileUrl) {
      const urlParts = data.fileUrl.split('/');
      setFileName(urlParts[urlParts.length - 1] || "Mevcut dosya");
    }
  };

  const onSubmit = (values: FormValues) => {
    if (id) {
      // Yeni dosya seçilmişse file alanını ekle, seçilmemişse ekleme (backend mevcut dosyayı korur)
      const requestData: any = {
        title: values.title,
        description: values.description,
      };
      
      // Sadece yeni bir dosya seçilmişse file alanını ekle
      if (file) {
        requestData.file = file;
      }
      
      updateMutation.mutate(
        { id: Number(id), request: requestData },
        {
          onSuccess: () => {
            navigate("/circular");
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Blog yazısı bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/circular")}>
          <ArrowLeft className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const fileUrl = data.fileUrl?.replace(/^https:/, 'http:') || data.fileUrl;

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/circular")}
          className="self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4 text-foreground dark:text-white" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Genelge Düzenle</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Genelgeyi düzenleyin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary dark:text-blue-400" />
                <CardTitle>Blog Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Dosya</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!file && !data.fileUrl ? (
                          <div className="relative">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                              onChange={(e) => handleFileChange(e, onChange)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              {...field}
                            />
                            <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                              <div className="flex flex-col items-center justify-center pt-6 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-primary/70 group-hover:text-primary transition-colors" />
                                <p className="mb-2 text-sm font-semibold text-foreground">
                                  Dosya seçmek için tıklayın
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max. 50MB)
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative group">
                              <div className="flex items-center justify-center w-full h-32 rounded-lg border-2 border-border bg-muted/30 p-6">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <File className="w-8 h-8 text-primary" />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-foreground">
                                      {fileName || "Dosya"}
                                    </p>
                                    {fileSize && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {fileSize}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="absolute top-4 right-4 flex gap-2">
                                {data.fileUrl && !file && (
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 w-9"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                )}
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleClearFile(onChange)}
                                  className="opacity-90 hover:opacity-100"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {fileName || "Mevcut dosya"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {file ? "Yeni dosya seçildi" : "Mevcut dosya kullanılıyor"}
                                  {data.fileUrl && !file && (
                                    <>
                                      {" • "}
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline inline-flex items-center gap-1"
                                      >
                                        <span>Mevcut dosyayı görüntüle</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </>
                                  )}
                                </p>
                              </div>
                              <label className="cursor-pointer">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <span>
                                    <Upload className="h-3 w-3 mr-1" />
                                    Değiştir
                                  </span>
                                </Button>
                                <Input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                  onChange={(e) => handleFileChange(e, onChange)}
                                  className="hidden"
                                  {...field}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Yeni dosya yüklemezseniz mevcut dosya kullanılır
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <div className="space-y-1">
                        <Input 
                          placeholder="Blog başlığını giriniz" 
                          maxLength={255}
                          {...field} 
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {field.value?.length || 0} / 255 karakter
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
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

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/circular")}
              className="w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2 text-white" />
              {updateMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
