import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSliderById, useUpdateSlider } from "@/hooks/use-sliders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import { ArrowLeft, Save, Images, Upload, X } from "lucide-react";
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
  image: z.any().optional(),
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().min(1, "Açıklama gereklidir"),
  orderIndex: z.number().min(0, "Sıra numarası 0 veya daha büyük olmalıdır"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SliderEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSliderById(Number(id));
  const updateMutation = useUpdateSlider();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      title: "",
      description: "",
      orderIndex: 0,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        description: data.description,
        orderIndex: data.orderIndex,
      });
      if (data.imageUrl) {
        const imageUrl = data.imageUrl.replace(/^https:/, 'http:');
        setPreview(imageUrl);
        setFileName(data.imageUrl.split('/').pop() || "");
      }
    }
  }, [data, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File | undefined) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
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
    setImageFile(null);
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
      const requestData = {
        ...values,
        image: imageFile || (data?.imageUrl && !imageFile ? data.imageUrl : ""),
      };
      updateMutation.mutate(
        { id: Number(id), request: requestData },
        {
          onSuccess: () => {
            navigate("/slider");
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
        <p className="text-muted-foreground mb-4">Slider bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/slider")}>
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
          onClick={() => navigate("/slider")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Slider Düzenle</h1>
          <p className="text-muted-foreground">
            Slider'ı düzenleyin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />
                <CardTitle>Slider Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Görsel</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!preview && !data.imageUrl ? (
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, onChange)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              {...field}
                            />
                            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                              <div className="flex flex-col items-center justify-center pt-8 pb-8">
                                <Upload className="w-12 h-12 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
                              <div className="flex items-center justify-center w-full h-64 rounded-lg border-2 border-border bg-muted/30 overflow-hidden">
                                <img
                                  src={preview || (data.imageUrl ? data.imageUrl.replace(/^https:/, 'http:') : '')}
                                  alt={data.title}
                                  className="w-full h-full object-contain"
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
                                  {fileName || data.imageUrl?.split('/').pop() || "Mevcut görsel"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {imageFile ? "Yeni görsel seçildi" : "Mevcut görsel kullanılıyor"}
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
                      Yeni görsel yüklemezseniz mevcut görsel kullanılır
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
                      <Input placeholder="Slider başlığını giriniz" {...field} />
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
                      />
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
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Slider'ların görüntülenme sırasını belirler
                    </p>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/slider")}
            >
              İptal
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
