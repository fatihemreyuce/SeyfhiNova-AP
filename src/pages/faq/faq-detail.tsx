import { useParams, useNavigate } from "react-router-dom";
import { useGetFaqById } from "@/hooks/use-faqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, HelpCircle } from "lucide-react";

export default function FaqDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetFaqById(Number(id));

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
        <p className="text-muted-foreground mb-4">Soru bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/faq")}>
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
            onClick={() => navigate("/faq")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Soru Detayı</h1>
            <p className="text-muted-foreground">
              Sıkça sorulan soru detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/faq/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle>Soru Bilgileri</CardTitle>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              ID: {data.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Soru
            </label>
            <p className="text-lg font-semibold">{data.question}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Cevap
            </label>
            <div className="mt-2 rounded-md border p-4 bg-muted/30">
              <div
                dangerouslySetInnerHTML={{ __html: data.answer }}
                className="prose prose-sm max-w-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
