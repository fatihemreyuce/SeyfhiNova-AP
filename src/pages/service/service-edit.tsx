import { useParams, useNavigate } from "react-router-dom";
import { useGetServiceById, useUpdateService } from "@/hooks/use-service";
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
import type { ServiceResponse } from "@/types/services.types";
import type { ServiceCategoryResponse } from "@/types/service.category.types";

const formSchema = z.object({
  categoryId: z.number().min(1, "Kategori seçimi gereklidir"),
  title: z.string()
    .min(1, "Başlık gereklidir")
    .max(255, "Başlık en fazla 255 karakter olabilir"),
  description: z.string().min(1, "Açıklama gereklidir"),
  orderIndex: z.union([
    z.string().transform((val) => val === "" ? 0 : parseInt(val, 10) || 0),
    z.number()
  ]).refine((val) => val >= 0, "Sıra numarası 0 veya daha büyük olmalıdır"),
});

type FormValues = z.infer<typeof formSchema>;

/** Form sadece data + kategoriler hazırken mount edilir; defaultValues ile kategori seçili gelir */
function ServiceEditForm({
  data,
  categories,
  serviceId,
  onSuccess,
  updateMutation,
}: {
  data: ServiceResponse;
  categories: ServiceCategoryResponse[];
  serviceId: number;
  onSuccess: () => void;
  updateMutation: ReturnType<typeof useUpdateService>;
}) {
  const categoryId = data.categoryId ?? data.category?.id ?? 0;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: categoryId > 0 ? categoryId : 0,
      title: data.title,
      description: data.description,
      orderIndex: data.orderIndex,
    },
  });

  const onSubmit = (values: FormValues) => {
    const orderIndex = typeof values.orderIndex === "string"
      ? (values.orderIndex === "" ? 0 : parseInt(values.orderIndex, 10) || 0)
      : values.orderIndex;
    updateMutation.mutate(
      { id: serviceId, request: { ...values, orderIndex } },
      { onSuccess }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary dark:text-blue-400" />
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
                    value={field.value && field.value > 0 ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
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
                    <div className="space-y-1">
                      <Input
                        placeholder="Servis başlığını giriniz"
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
                        if (value === "" || /^\d+$/.test(value)) field.onChange(value);
                      }}
                      value={field.value === undefined || field.value === null ? "" : String(field.value)}
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
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">
          <Button type="button" variant="outline" onClick={onSuccess} className="w-full sm:w-auto">
            İptal
          </Button>
          <Button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2 text-white" />
            {updateMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function ServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceId = Number(id);
  const { data, isLoading } = useGetServiceById(serviceId);
  const { data: categoriesData, isLoading: categoriesLoading } = useServiceCategory("", 0, 100, "id,asc");
  const updateMutation = useUpdateService();

  // API'den gelen kategori: categoryId veya category.id (servis/hooks aynı kalır)
  const categoryIdFromData = data?.categoryId ?? data?.category?.id;
  const dataWithCategoryId =
    categoryIdFromData != null && categoryIdFromData > 0
      ? { ...data!, categoryId: categoryIdFromData }
      : data!;

  if (isLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Servis bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/service")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const categories = categoriesData?.content ?? [];

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/service")}
          className="self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4 text-primary dark:text-blue-400" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Servis Düzenle</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Servisi düzenleyin
          </p>
        </div>
      </div>
      <ServiceEditForm
        data={dataWithCategoryId}
        categories={categories}
        serviceId={serviceId}
        onSuccess={() => navigate("/service")}
        updateMutation={updateMutation}
      />
    </div>
  );
}
