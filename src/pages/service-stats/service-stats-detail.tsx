import { useParams, useNavigate } from "react-router-dom";
import { useGetServiceStatsById } from "@/hooks/use-service-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, BarChart3, Image as ImageIcon, ExternalLink } from "lucide-react";

export default function ServiceStatsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetServiceStatsById(Number(id));

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

  // URL'deki https'i http'ye çevir
  const iconUrl = data.iconName?.replace(/^https:/, 'http:') || data.iconName;

  return (
    <div className="space-y-6">
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
            <h1 className="text-3xl font-bold tracking-tight">İstatistik Detayı</h1>
            <p className="text-muted-foreground">
              Servis istatistiği detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/service-stats/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>İstatistik Bilgileri</CardTitle>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              ID: {data.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Başlık
              </label>
              <p className="text-lg font-semibold">{data.title}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Değer
              </label>
              <div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {data.numberValue}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              İkon
            </label>
            {data.iconName ? (
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Icon Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-lg border-2 border-border bg-muted/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
                          {iconUrl && (iconUrl.startsWith('http') || iconUrl.startsWith('/')) ? (
                            <img
                              src={iconUrl}
                              alt={data.title}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Eğer resim yüklenemezse fallback göster
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                                      <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                      <span class="text-xs">Resim yüklenemedi</span>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                              <ImageIcon className="w-12 h-12 mb-2" />
                              <span className="text-xs">İkon</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors pointer-events-none" />
                      </div>
                    </div>

                    {/* Icon Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-sm font-medium text-foreground">İkon Önizleme</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">İkon URL:</p>
                        <div className="flex items-center gap-2 group/url">
                          <a
                            href={iconUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 truncate flex-1 min-w-0"
                          >
                            {iconUrl}
                          </a>
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/url:text-primary transition-colors flex-shrink-0" />
                        </div>
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
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">İkon bulunmamaktadır</p>
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
