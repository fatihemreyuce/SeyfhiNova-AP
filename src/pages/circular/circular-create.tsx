import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCircular } from "@/hooks/use-circulars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import { ArrowLeft, Save, FileText, Upload, X, File } from "lucide-react";
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
  file: z.any().refine((file) => {
    if (!file) return false;
    if (typeof file === "string") return true;
    if (file && typeof file === "object") {
      return "name" in file && "size" in file;
    }
    return false;
  }, {
    message: "Görsel gereklidir",
  }),
  title: z.string()
    .min(1, "Başlık gereklidir")
    .max(255, "Başlık en fazla 255 karakter olabilir"),
  description: z.string().min(1, "Açıklama gereklidir"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CircularCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateCircular();
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      title: "",
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    }
  };

  const handleClearFile = (onChange: (value: undefined) => void) => {
    onChange(undefined);
    setFileName("");
    setFileSize("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/circular");
      },
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/circular")}
          className="self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4 text-primary dark:text-blue-400" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Yeni Blog</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Yeni bir blog yazısı oluşturun
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary dark:text-blue-400" />
                <CardTitle>Genelge Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Görsel</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!fileName ? (
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
                                  Resim seçmek için tıklayın
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  JPG, PNG, GIF, WebP (Max. 50MB)
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
                                      {fileName}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {fileSize}
                                    </p>
                                  </div>
                                </div>
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
                                  {fileName}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Görsel başarıyla seçildi
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
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
            <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2 text-white" />
              {createMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
