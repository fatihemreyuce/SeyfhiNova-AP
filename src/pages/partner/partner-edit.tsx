import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPartnerById, useUpdatePartner } from "@/hooks/use-partners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Handshake, Upload, X } from "lucide-react";
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
  logo: z.any().optional(),
  name: z.string().min(1, "İsim gereklidir"),
  orderIndex: z.union([
    z.string().transform((val) => val === "" ? 0 : parseInt(val, 10) || 0),
    z.number()
  ]).refine((val) => val >= 0, "Sıra numarası 0 veya daha büyük olmalıdır"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PartnerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetPartnerById(Number(id));
  const updateMutation = useUpdatePartner();
  const [preview, setPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: undefined,
      name: "",
      orderIndex: 0,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        orderIndex: data.orderIndex,
      });
      if (data.logoUrl) {
        const logoUrl = data.logoUrl.replace(/^https:/, 'http:');
        setPreview(logoUrl);
        setFileName(data.logoUrl.split('/').pop() || "");
      }
    }
  }, [data, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File | undefined) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
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
    setLogoFile(null);
    setPreview(null);
    setFileName("");
    onChange(undefined);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = (values: FormValues) => {
    if (id) {
      // Yeni logo seçilmişse logo alanını ekle, seçilmemişse ekleme (backend mevcut logoyu korur)
      // orderIndex'i number'a çevir
      const orderIndex = typeof values.orderIndex === "string" 
        ? (values.orderIndex === "" ? 0 : parseInt(values.orderIndex, 10) || 0)
        : values.orderIndex;
      
      const requestData: any = {
        name: values.name,
        websiteUrl: values.websiteUrl,
        orderIndex: orderIndex,
      };
      
      // Sadece yeni bir logo seçilmişse logo alanını ekle
      if (logoFile) {
        requestData.logo = logoFile;
      }
      
      updateMutation.mutate(
        { id: Number(id), request: requestData },
        {
          onSuccess: () => {
            navigate("/partner");
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
        <p className="text-muted-foreground mb-4">Ortak bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/partner")}>
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
          onClick={() => navigate("/partner")}
          className="self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4 text-foreground dark:text-white" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ortak Düzenle</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Ortağı düzenleyin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary dark:text-blue-400" />
                <CardTitle>Ortak Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!preview && !data.logoUrl ? (
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
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
                                  PNG, JPG, SVG veya GIF (Max. 10MB)
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative group">
                              <div className="flex items-center justify-center w-full h-48 rounded-lg border-2 border-border bg-muted/30 overflow-hidden">
                                <img
                                  src={preview || (data.logoUrl ? data.logoUrl.replace(/^https:/, 'http:') : '')}
                                  alt={data.name}
                                  className="w-full h-full object-contain p-4"
                                />
                              </div>
                              <div className="absolute top-4 right-4">
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
                                  {fileName || data.logoUrl?.split('/').pop() || "Mevcut logo"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {logoFile ? "Yeni logo seçildi" : "Mevcut logo kullanılıyor"}
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
                                  accept="image/*"
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
                      Yeni logo yüklemezseniz mevcut logo kullanılır
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <FormControl>
                      <Input placeholder="Ortak ismini giriniz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sıra Numarası</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0"
                        className="max-w-[150px]"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Sadece rakam ve boş string'e izin ver
                          if (value === "" || /^\d+$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                        value={field.value === undefined || field.value === null ? "" : String(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Ortakların görüntülenme sırasını belirler
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
              onClick={() => navigate("/partner")}
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
