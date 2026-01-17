import { useParams, useNavigate } from "react-router-dom";
import { useGetCircularById } from "@/hooks/use-circulars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, Download, ExternalLink, File } from "lucide-react";

export default function CircularDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCircularById(Number(id));

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
        <p className="text-muted-foreground mb-4">Genelge bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/circular")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  // URL'deki https'i http'ye çevir
  const fileUrl = data.fileUrl?.replace(/^https:/, 'http:') || data.fileUrl;
  const fileName = fileUrl?.split('/').pop() || "Dosya";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/circular")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Genelge Detayı</h1>
            <p className="text-muted-foreground">
              Genelge detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/circular/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Genelge Bilgileri</CardTitle>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              ID: {data.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Başlık
            </label>
            <p className="text-lg font-semibold">{data.title}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Açıklama
            </label>
            <div className="mt-2 rounded-md border p-4 bg-muted/30">
              <div
                dangerouslySetInnerHTML={{ __html: data.description }}
                className="prose prose-sm max-w-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Dosya
            </label>
            {data.fileUrl ? (
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <div className="flex items-center justify-center w-full h-48 rounded-lg border-2 border-border bg-muted/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center">
                              <File className="w-12 h-12 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-foreground">
                                {fileName}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Genelge dosyası
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-sm font-medium text-foreground">Dosya Bilgileri</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Dosya URL:</p>
                        <div className="flex items-center gap-2 group/url">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 truncate flex-1 min-w-0"
                          >
                            {fileUrl}
                          </a>
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/url:text-primary transition-colors flex-shrink-0" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                          <Download className="h-4 w-4" />
                          Dosyayı İndir
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-border bg-muted/30">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Dosya bulunmamaktadır</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
