import { useParams, useNavigate } from "react-router-dom";
import { useGetCircularById } from "@/hooks/use-circulars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Edit,
  FileText,
  Download,
  ExternalLink,
  File,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

export default function CircularDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCircularById(Number(id));

  // URL'deki https'i http'ye çevir
  const fileUrl = data?.fileUrl?.replace(/^https:/, "http:") || data?.fileUrl;
  const fileName = fileUrl?.split("/").pop() || "Dosya";

  const handleCopyUrl = async () => {
    if (fileUrl) {
      try {
        await navigator.clipboard.writeText(fileUrl);
        toast.success("Dosya URL panoya kopyalandı");
      } catch (err) {
        toast.error("URL kopyalanamadı");
      }
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
        <p className="text-muted-foreground mb-4">Genelge bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/circular")}>
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
            onClick={() => navigate("/circular")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Genelge Detayı: {data.title}
            </h1>
            <p className="text-muted-foreground">
              #{data.id} - Genelge detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/circular/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Temel Bilgiler */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Temel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Başlık
                </label>
                <p className="text-xl font-bold">{data.title}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Açıklama
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[100px]">
                  {data.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.description }}
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

        {/* Right Column - Dosya ve İşlemler */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Dosya ve İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Dosya Önizleme
                </label>
                {fileUrl ? (
                  <div className="flex items-center justify-center w-full h-64 rounded-lg border-2 border-border bg-muted/30 overflow-hidden shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center">
                        <File className="w-12 h-12 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {fileName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Genelge dosyası
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dosya bulunmamaktadır
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* File URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Dosya Yolu
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={fileUrl || ""}
                    readOnly
                    className="font-mono text-sm truncate pr-10"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {fileUrl && (
                    <Button
                      size="icon"
                      variant="outline"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Download Button */}
              {fileUrl && (
                <div className="pt-2">
                  <Button
                    className="w-full"
                    asChild
                  >
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Dosyayı İndir
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
