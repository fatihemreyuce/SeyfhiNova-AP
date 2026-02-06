import { useParams, useNavigate } from "react-router-dom";
import { useGetCircularById } from "@/hooks/use-circulars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Link2,
  Sparkles,
  CheckCircle2,
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
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground text-lg font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Duyuru bulunamadı</h3>
            <p className="text-muted-foreground">Aradığınız duyuru mevcut değil.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/circular")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
            Listeye Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/circular")}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all duration-200 self-start sm:self-auto"
            >
              <ArrowLeft className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate(`/circular/${id}/edit`)}
                className="h-10 px-4 rounded-xl font-medium bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                <Edit className="h-4 w-4 mr-2 text-white dark:text-white" />
                Düzenle
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-primary dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">
                Duyuru Detayı
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <p className="text-muted-foreground dark:text-muted-foreground/80">
                  {data.title}
                </p>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/50 dark:bg-muted/70">
                  <Hash className="h-3.5 w-3.5 text-foreground dark:text-white" />
                  <span className="text-sm font-semibold text-foreground dark:text-white">ID: {data.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Temel Bilgiler */}
          <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-blue-500/5 via-blue-500/3 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                  Temel Bilgiler
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Başlık */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary dark:text-blue-400" />
                  </div>
                  <label className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                    Başlık
                  </label>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300">
                  <p className="text-2xl font-bold text-foreground dark:text-white leading-tight">
                    {data.title || (
                      <span className="text-muted-foreground dark:text-muted-foreground/60 italic">
                        Başlık girilmemiş
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Açıklama */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary dark:text-blue-400" />
                  </div>
                  <label className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                    Açıklama
                  </label>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300 min-h-[300px]">
                  {data.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.description }}
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground dark:prose-headings:text-white prose-p:text-foreground/90 dark:prose-p:text-white/90 prose-strong:text-foreground dark:prose-strong:text-white prose-a:text-primary dark:prose-a:text-primary"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
                      <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground dark:text-muted-foreground/60" />
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 italic">
                        Açıklama bulunmamaktadır
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Dosya ve İşlemler */}
          <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <File className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                  Görsel ve İşlemler
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Görsel Önizleme */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <File className="h-4 w-4 text-primary dark:text-blue-400" />
                  </div>
                  <label className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                    Görsel Önizleme
                  </label>
                </div>
                {fileUrl ? (
                  <div className="relative w-full h-80 rounded-2xl border-2 border-border/50 dark:border-border/70 bg-muted/30 dark:bg-muted/40 overflow-hidden flex items-center justify-center group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300 shadow-lg">
                    <img
                      src={fileUrl}
                      alt={fileName || "Blog görseli"}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-green-500/90 text-white border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Görsel Mevcut
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-80 rounded-2xl border-2 border-dashed border-border/50 dark:border-border/70 bg-gradient-to-br from-muted/30 to-muted/10 dark:from-muted/50 dark:to-muted/30 flex items-center justify-center group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-20 h-20 rounded-2xl bg-muted/50 dark:bg-muted/70 flex items-center justify-center border-2 border-border/50">
                        <FileText className="h-10 w-10 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80 mb-1">
                          Görsel bulunmamaktadır
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/60">
                          Görsel yüklemek için düzenle butonunu kullanın
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dosya Yolu */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Link2 className="h-4 w-4 text-primary dark:text-blue-400" />
                  </div>
                  <label className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                    Dosya Yolu
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={fileUrl || ""}
                      readOnly
                      className="font-mono text-sm pr-24 h-12 rounded-xl border-2 bg-muted/30 dark:bg-muted/50 border-border/50 dark:border-border/70"
                    />
                    {fileUrl && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCopyUrl}
                          className="h-8 w-8 rounded-lg hover:bg-accent dark:hover:bg-accent/80"
                          title="Kopyala"
                        >
                          <Copy className="h-4 w-4 text-foreground dark:text-white" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          asChild
                          className="h-8 w-8 rounded-lg hover:bg-accent dark:hover:bg-accent/80"
                          title="Yeni sekmede aç"
                        >
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 text-foreground dark:text-white" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {!fileUrl && (
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground/60 italic pl-10">
                    Dosya yolu bulunmamaktadır
                  </p>
                )}
              </div>

              {/* Download Button */}
              {fileUrl && (
                <Button
                  className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="h-4 w-4 mr-2 text-white" />
                    Görseli İndir
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
