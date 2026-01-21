import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetServiceStatsById } from "@/hooks/use-service-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Maximize2,
  X,
  TrendingUp,
  Hash,
  CheckCircle2,
  Link2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function ServiceStatsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetServiceStatsById(Number(id));
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // URL'deki https'i http'ye çevir
  const iconUrl = data?.iconName?.replace(/^https:/, "http:") || data?.iconName;

  const handleCopyUrl = async () => {
    if (iconUrl) {
      try {
        await navigator.clipboard.writeText(iconUrl);
        toast.success("URL panoya kopyalandı");
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
            <TrendingUp className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">İstatistik bulunamadı</h3>
            <p className="text-muted-foreground">Aradığınız istatistik mevcut değil.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/service-stats")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Listeye Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/service-stats")}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all duration-200 self-start sm:self-auto"
            >
              <ArrowLeft className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate(`/service-stats/${id}/edit`)}
                className="h-10 px-4 rounded-xl font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
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
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">
                Servis İstatistik Detayı
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

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Value Card */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-blue-500/5 via-blue-500/3 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    İstatistik Değeri
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-8 pb-8">
                <div className="flex items-baseline gap-4">
                  <div className="text-7xl font-extrabold bg-gradient-to-br from-primary via-primary/90 to-purple-600 bg-clip-text text-transparent">
                    {data.numberValue}
                  </div>
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground/80 font-medium uppercase tracking-wide">
                    birim
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    Detay Bilgileri
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide mb-1">Başlık</p>
                      <p className="text-xl font-bold text-foreground dark:text-white">{data.title}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide mb-1">Sayısal Değer</p>
                      <p className="text-3xl font-bold text-foreground dark:text-white">{data.numberValue}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Media */}
          <div className="space-y-6">
            {/* Icon Preview Card */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-green-500/5 via-green-500/3 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 dark:from-green-500/30 dark:to-green-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    İkon Önizleme
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {iconUrl && (iconUrl.startsWith("http") || iconUrl.startsWith("/")) ? (
                  <div className="relative group/preview">
                    <div className="aspect-square w-full rounded-2xl border-2 border-border/50 dark:border-border/70 bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 overflow-hidden shadow-lg group-hover/preview:border-primary/50 dark:group-hover/preview:border-primary/60 transition-all duration-300 flex items-center justify-center p-8">
                      <img
                        src={iconUrl}
                        alt={data.title}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover/preview:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex flex-col items-center justify-center w-full h-full text-muted-foreground dark:text-muted-foreground/60">
                                <svg class="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-sm font-medium">İkon yüklenemedi</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-4 right-4 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm bg-background/90 hover:bg-background border-2"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <Maximize2 className="h-4 w-4 mr-2 text-foreground dark:text-white" />
                      Büyüt
                    </Button>
                    {iconUrl && (
                      <Badge className="absolute top-4 left-4 bg-green-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        İkon Mevcut
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square w-full rounded-2xl border-2 border-dashed border-border/50 dark:border-border/70 bg-gradient-to-br from-muted/30 to-muted/10 dark:from-muted/50 dark:to-muted/30 flex items-center justify-center group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-20 h-20 rounded-2xl bg-muted/50 dark:bg-muted/70 flex items-center justify-center border-2 border-border/50">
                        <ImageIcon className="h-10 w-10 text-muted-foreground dark:text-muted-foreground/60" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80 mb-1">
                          İkon bulunmamaktadır
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/60">
                          İkon yüklemek için düzenle butonunu kullanın
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Icon URL Card */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-green-500/5 via-green-500/3 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 dark:from-green-500/30 dark:to-green-600/20 flex items-center justify-center shadow-lg">
                    <Link2 className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    İkon Yolu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={iconUrl || ""}
                      readOnly
                      className="font-mono text-sm pr-24 h-12 rounded-xl border-2 bg-muted/30 dark:bg-muted/50 border-border/50 dark:border-border/70"
                    />
                    {iconUrl && (
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
                            href={iconUrl}
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
                {iconUrl && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground/80 pl-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span>İkon başarıyla yüklendi</span>
                  </div>
                )}
                {!iconUrl && (
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground/60 italic pl-2">
                    İkon yolu bulunmamaktadır
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-0 shadow-none">
          <div className="relative">
            <Button
              size="icon"
              variant="secondary"
              className="absolute -top-12 right-0 rounded-full bg-background/90 dark:bg-background/90 hover:bg-background dark:hover:bg-background shadow-xl border-2 z-10"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            {iconUrl && (
              <div className="bg-background/95 dark:bg-background/95 backdrop-blur-xl rounded-2xl p-4 border-2 shadow-2xl">
                <img
                  src={iconUrl}
                  alt={data.title}
                  className="max-h-[85vh] max-w-full object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
