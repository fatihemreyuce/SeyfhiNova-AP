import { useParams, useNavigate } from "react-router-dom";
import { useGetHomePageAboutById, useUpdateHomePageAbout } from "@/hooks/use-home-page-about";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import { ArrowLeft, Save } from "lucide-react";
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
import { useEffect } from "react";

const formSchema = z.object({
  leftTitle: z.string()
    .min(1, "Sol başlık gereklidir")
    .max(255, "Sol başlık en fazla 255 karakter olabilir"),
  leftDescription: z.string().min(1, "Sol açıklama gereklidir"),
  rightTitle: z.string()
    .min(1, "Sağ başlık gereklidir")
    .max(255, "Sağ başlık en fazla 255 karakter olabilir"),
  rightDescription: z.string().min(1, "Sağ açıklama gereklidir"),
});

type FormValues = z.infer<typeof formSchema>;

export default function HomePageAboutEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetHomePageAboutById(Number(id));
  const updateMutation = useUpdateHomePageAbout();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leftTitle: "",
      leftDescription: "",
      rightTitle: "",
      rightDescription: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        leftTitle: data.leftTitle,
        leftDescription: data.leftDescription,
        rightTitle: data.rightTitle,
        rightDescription: data.rightDescription,
      });
    }
  }, [data, form]);

  const onSubmit = (values: FormValues) => {
    if (id) {
      updateMutation.mutate(
        { id: Number(id), request: values },
        {
          onSuccess: () => {
            navigate("/home-page-about");
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
        <p className="text-muted-foreground mb-4">Kayıt bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/home-page-about")}>
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
          onClick={() => navigate("/home-page-about")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Düzenle</h1>
          <p className="text-muted-foreground">
            Ana sayfa hakkında kaydını düzenleyin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sol Bölüm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="leftTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sol Başlık</FormLabel>
                      <FormControl>
                        <div className="space-y-1">
                          <Input 
                            placeholder="Sol başlık giriniz" 
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
                  name="leftDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sol Açıklama</FormLabel>
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

            <Card>
              <CardHeader>
                <CardTitle>Sağ Bölüm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="rightTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sağ Başlık</FormLabel>
                      <FormControl>
                        <div className="space-y-1">
                          <Input 
                            placeholder="Sağ başlık giriniz" 
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
                  name="rightDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sağ Açıklama</FormLabel>
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
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/home-page-about")}
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
