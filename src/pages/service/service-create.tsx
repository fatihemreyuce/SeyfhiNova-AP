import { useNavigate } from "react-router-dom";
import { useCreateService } from "@/hooks/use-service";
import { useServiceCategory } from "@/hooks/use-category-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Briefcase } from "lucide-react";
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
  categoryId: z.number().min(1, "Kategori seçimi gereklidir"),
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().min(1, "Açıklama gereklidir"),
  orderIndex: z.number().min(0, "Sıra numarası 0 veya daha büyük olmalıdır"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ServiceCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateService();
  const { data: categoriesData, isLoading: categoriesLoading } = useServiceCategory("", 0, 100, "id,asc");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: 0,
      title: "",
      description: "",
      orderIndex: 0,
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/service");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/service")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Servis</h1>
          <p className="text-muted-foreground">
            Yeni bir servis oluşturun
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <CardTitle>Servis Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                      disabled={categoriesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesData?.content.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="Servis başlığını giriniz" {...field} />
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
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Servislerin görüntülenme sırasını belirler
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
              onClick={() => navigate("/service")}
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
