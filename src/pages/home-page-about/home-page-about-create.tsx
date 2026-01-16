import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateHomePageAbout } from "@/hooks/use-home-page-about";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  leftTitle: z.string().min(1, "Sol başlık gereklidir"),
  leftDescription: z.string().min(1, "Sol açıklama gereklidir"),
  rightTitle: z.string().min(1, "Sağ başlık gereklidir"),
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
          <h1 className="text-3xl font-bold tracking-tight">Yeni Ekle</h1>
          <p className="text-muted-foreground">
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
                        <Input placeholder="Sol başlık giriniz" {...field} />
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
                        <Input placeholder="Sağ başlık giriniz" {...field} />
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
            <Button type="submit" disabled={createMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
