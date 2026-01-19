import { useParams, useNavigate } from "react-router-dom";
import { useGetHomePageAboutById } from "@/hooks/use-home-page-about";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";

export default function HomePageAboutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetHomePageAboutById(Number(id));

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home-page-about")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ana Sayfa Hakkında Detayı
            </h1>
            <p className="text-muted-foreground">
              #{data.id} - Ana sayfa hakkında detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/home-page-about/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Sol Bölüm */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Sol Bölüm
                </CardTitle>
                <Badge variant="outline">ID: {data.id}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Başlık
                </label>
                <p className="text-xl font-bold">{data.leftTitle}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Açıklama
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[200px]">
                  {data.leftDescription ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.leftDescription }}
                      className="prose prose-sm max-w-none dark:prose-invert"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Açıklama bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sağ Bölüm */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Sağ Bölüm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Başlık
                </label>
                <p className="text-xl font-bold">{data.rightTitle}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Açıklama
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[200px]">
                  {data.rightDescription ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.rightDescription }}
                      className="prose prose-sm max-w-none dark:prose-invert"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Açıklama bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
