import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetServiceStatsById, useUpdateServiceStats } from "@/hooks/use-service-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, BarChart3, Upload, X, Image as ImageIcon } from "lucide-react";
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
  icon: z.any().optional(),
  title: z.string().min(1, "Başlık gereklidir"),
  numberValue: z.number().min(0, "Değer 0 veya daha büyük olmalıdır"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ServiceStatsEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetServiceStatsById(Number(id));
  const updateMutation = useUpdateServiceStats();
  const [preview, setPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: undefined,
      title: "",
      numberValue: 0,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        numberValue: data.numberValue,
      });
      // Mevcut ikon için preview oluştur (eğer iconName varsa)
      if (data.iconName) {
        // iconName muhtemelen bir URL path'i veya dosya adı
        // Burada backend'in icon URL'ini kullanabilirsiniz
        // setPreview(`/api/v1/uploads/${data.iconName}`);
      }
    }
  }, [data, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File | undefined) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setFileName(file.name);
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = (onChange: (value: undefined) => void) => {
    setIconFile(null);
    setPreview(null);
    setFileName("");
    onChange(undefined);
    // Input'u temizle
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = (values: FormValues) => {
    if (id) {
      // Yeni ikon seçilmişse icon alanını ekle, seçilmemişse ekleme (backend mevcut ikonu korur)
      const requestData: any = {
        title: values.title,
        numberValue: values.numberValue,
      };
      
      // Sadece yeni bir ikon seçilmişse icon alanını ekle
      if (iconFile) {
        requestData.icon = iconFile;
      }
      
      updateMutation.mutate(
        { id: Number(id), request: requestData },
        {
          onSuccess: () => {
            navigate("/service-stats");
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
        <p className="text-muted-foreground mb-4">İstatistik bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/service-stats")}>
          <ArrowLeft className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/service-stats")}
          className="self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4 text-primary" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">İstatistik Düzenle</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Servis istatistiğini düzenleyin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary dark:text-blue-400" />
                <CardTitle>İstatistik Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>İkon</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!preview && !data.iconName ? (
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, onChange)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              {...field}
                            />
                            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-primary/70 group-hover:text-primary transition-colors" />
                                <p className="mb-2 text-sm text-foreground">
                                  <span className="font-semibold">Dosya seçmek için tıklayın</span> veya sürükleyip bırakın
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, SVG veya GIF (Max. 10MB)</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30">
                              <div className="flex items-center justify-center w-16 h-16 rounded-md border border-border bg-background overflow-hidden shrink-0">
                                {preview ? (
                                  <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                  />
                                ) : data.iconName ? (
                                  <span className="text-xs font-medium text-muted-foreground text-center px-2">
                                    {data.iconName.substring(0, 10)}
                                  </span>
                                ) : (
                                  <ImageIcon className="w-8 h-8 text-purple-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {fileName || data.iconName || "Mevcut ikon"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {preview ? "Yeni ikon seçildi" : "Mevcut ikon kullanılıyor"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
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
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, onChange)}
                                    className="hidden"
                                    {...field}
                                  />
                                </label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleClearFile(onChange)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Yeni ikon yüklemezseniz mevcut ikon kullanılır
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
                      <Input placeholder="İstatistik başlığını giriniz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Değer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      İstatistik değerini giriniz
                    </p>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/service-stats")}
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
