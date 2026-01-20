import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetServiceStatsById } from "@/hooks/use-service-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FileText,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">İstatistik bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/service-stats")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-8">
      {/* Header Section */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/service-stats")}
                className="h-9 w-9 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <h1 className="text-lg font-semibold text-foreground">
                  İstatistik Detayı
                </h1>
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/service-stats/${id}/edit`)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Düzenle
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge 
                  variant="outline" 
                  className="font-mono text-xs bg-primary/10 text-primary border-primary/20 px-2.5 py-0.5"
                >
                  ID: {data.id}
                </Badge>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Servis İstatistiği
                </span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                {data.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <CardHeader className="relative pb-6">
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                  </div>
                  İstatistik Değeri
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-baseline gap-3">
                  <div className="text-6xl font-extrabold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {data.numberValue}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    birim
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Detay Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Başlık</p>
                        <p className="text-base font-semibold text-foreground">{data.title}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Sayısal Değer</p>
                        <p className="text-base font-semibold text-foreground">{data.numberValue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Media */}
          <div className="space-y-6">
            {/* Icon Preview Card */}
            <Card className="border shadow-md overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  İkon Önizleme
                </CardTitle>
              </CardHeader>
              <CardContent>
                {iconUrl && (iconUrl.startsWith("http") || iconUrl.startsWith("/")) ? (
                  <div className="relative group">
                    <div className="aspect-square w-full rounded-lg border-2 border-border bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40 overflow-hidden shadow-inner">
                      <img
                        src={iconUrl}
                        alt={data.title}
                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                                <svg class="w-12 h-12 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-xs font-medium">Yüklenemedi</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Büyüt
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-square w-full rounded-lg border-2 border-dashed border-border bg-muted/20 flex items-center justify-center">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground opacity-40" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">
                        İkon yok
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Icon URL Card */}
            <Card className="border shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  İkon Yolu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={iconUrl || ""}
                    readOnly
                    className="font-mono text-xs bg-muted/30 border-2 focus-visible:ring-0"
                  />
                  <div className="flex gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyUrl}
                      className="h-9 w-9 border-2 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                      title="Kopyala"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {iconUrl && (
                      <Button
                        size="icon"
                        variant="outline"
                        asChild
                        className="h-9 w-9 border-2 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                        title="Yeni sekmede aç"
                      >
                        <a
                          href={iconUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                {iconUrl && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    İkon başarıyla yüklendi
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && iconUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] group">
            <Button
              size="icon"
              variant="secondary"
              className="absolute -top-12 right-0 rounded-full bg-background/90 hover:bg-background shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={iconUrl}
              alt={data.title}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
