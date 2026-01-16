import { useParams, useNavigate } from "react-router-dom";
import { useGetServiceById } from "@/hooks/use-service";
import { useServiceCategory } from "@/hooks/use-category-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Briefcase } from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetServiceById(Number(id));
  const { data: categoriesData } = useServiceCategory("", 0, 100, "id,asc");

  const getCategoryName = (categoryId: number) => {
    const category = categoriesData?.content.find((cat) => cat.id === categoryId);
    return category?.name || `Kategori #${categoryId}`;
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
        <p className="text-muted-foreground mb-4">Servis bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/service")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/service")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Servis Detayı</h1>
            <p className="text-muted-foreground">
              Servis detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/service/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Servis Bilgileri</CardTitle>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              ID: {data.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Başlık
              </label>
              <p className="text-lg font-semibold">{data.title}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Kategori
              </label>
              <div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {getCategoryName(data.categoryId)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Sıra Numarası
              </label>
              <div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {data.orderIndex}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Açıklama
            </label>
            <div className="rounded-md border p-4">
              <div
                dangerouslySetInnerHTML={{ __html: data.description }}
                className="prose prose-sm max-w-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
