import { useNavigate } from "react-router-dom";
import { useCreateHomePageAbout } from "@/hooks/use-home-page-about";
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

export default function HomePageAboutCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateHomePageAbout();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leftTitle: "",
      leftDescription: "",
      rightTitle: "",
      rightDescription: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/home-page-about");
      },
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/home-page-about")}
          className="self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Yeni Ekle</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Yeni ana sayfa hakkında kaydı oluşturun
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

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/home-page-about")}
              className="w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
