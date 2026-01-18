import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUsefulInformationById } from "@/hooks/use-useful-information";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  FileText,
  Download,
  ExternalLink,
  File,
  Copy,
  Hash,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function UsefulInformationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetUsefulInformationById(Number(id));
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

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

  const handleOpenFileModal = () => {
    if (fileUrl) {
      setIsFileModalOpen(true);
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
        <p className="text-muted-foreground mb-4">Kullanışlı bilgi bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/useful-information")}>
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
            onClick={() => navigate("/useful-information")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Kullanışlı Bilgi Detayı
            </h1>
            <p className="text-muted-foreground">
              #{data.id} - Kullanışlı bilgi detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/useful-information/${id}/edit`)}>
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
                  ID
                </label>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {data.id}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Başlık
                </label>
                <p className="text-xl font-bold">{data.title}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Özet
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[80px]">
                  {data.excerpt ? (
                    <p className="text-sm leading-relaxed">{data.excerpt}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Özet bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Açıklama
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[200px]">
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
                          Dosya mevcut
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-64 rounded-lg border-2 border-dashed border-border bg-muted/30">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        Dosya bulunmamaktadır
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Actions */}
              {fileUrl && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Dosya İşlemleri
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyUrl}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      URL Kopyala
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenFileModal}
                      className="flex-shrink-0"
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Büyüt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Yeni Sekmede Aç
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="h-4 w-4 mr-2" />
                        İndir
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* File Modal */}
      <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dosya: {fileName}</DialogTitle>
            <DialogDescription>
              Dosya önizlemesi güvenlik nedeniyle burada gösterilemiyor. Dosyayı görüntülemek için yeni sekmede açın veya indirin.
            </DialogDescription>
          </DialogHeader>
          {fileUrl && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
                <File className="w-16 h-16 text-primary mb-4" />
                <p className="text-sm font-medium text-foreground mb-2">
                  {fileName}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Yeni Sekmede Aç
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-4 w-4 mr-2" />
                      İndir
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
