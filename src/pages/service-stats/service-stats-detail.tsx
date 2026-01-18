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
  BarChart3,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Maximize2,
  Hash,
  X,
  TrendingUp,
} from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/service-stats")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              İstatistik Detayı: {data.title}
            </h1>
            <p className="text-muted-foreground">
              #{data.id} - Servis istatistiği detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/service-stats/${id}/edit`)}>
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
                  Değer
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/5">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{data.numberValue}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - İkon ve Medya */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                İkon ve Medya
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Icon Preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  İkon Önizleme
                </label>
                {iconUrl && (iconUrl.startsWith("http") || iconUrl.startsWith("/")) ? (
                  <div className="relative group">
                    <div className="w-full h-64 rounded-lg border-2 border-border bg-muted/30 overflow-hidden shadow-sm flex items-center justify-center">
                      <img
                        src={iconUrl}
                        alt={data.title}
                        className="w-full h-full object-contain p-8"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                                <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-sm">İkon yüklenemedi</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Büyüt
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        İkon bulunmamaktadır
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Icon URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  İkon Yolu
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={iconUrl || ""}
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
                  {iconUrl && (
                    <Button
                      size="icon"
                      variant="outline"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={iconUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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
