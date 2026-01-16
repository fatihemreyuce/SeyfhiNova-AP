import { useParams, useNavigate } from "react-router-dom";
import { useGetHomePageAboutById } from "@/hooks/use-home-page-about";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";

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
            <h1 className="text-3xl font-bold tracking-tight">Detay</h1>
            <p className="text-muted-foreground">
              Ana sayfa hakkında detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/home-page-about/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sol Bölüm</CardTitle>
              <Badge variant="outline">ID: {data.id}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Başlık
              </label>
              <p className="mt-1 text-lg font-semibold">{data.leftTitle}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Açıklama
              </label>
              <div className="mt-2 rounded-md border p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: data.leftDescription }}
                  className="prose prose-sm max-w-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sağ Bölüm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Başlık
              </label>
              <p className="mt-1 text-lg font-semibold">{data.rightTitle}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Açıklama
              </label>
              <div className="mt-2 rounded-md border p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: data.rightDescription }}
                  className="prose prose-sm max-w-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
