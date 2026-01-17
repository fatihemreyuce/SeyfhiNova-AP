import { useParams, useNavigate } from "react-router-dom";
import { useGetReferanceById } from "@/hooks/use-referance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Award, ExternalLink } from "lucide-react";

export default function ReferanceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetReferanceById(Number(id));

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
        <p className="text-muted-foreground mb-4">Referans bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/referance")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  // URL'deki https'i http'ye çevir
  const logoUrl = data.logoUrl?.replace(/^https:/, 'http:') || data.logoUrl;
  const websiteUrl = data.websiteUrl?.replace(/^https:/, 'http:') || data.websiteUrl;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/referance")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Referans Detayı</h1>
            <p className="text-muted-foreground">
              Referans detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/referance/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <CardTitle>Referans Bilgileri</CardTitle>
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
                İsim
              </label>
              <p className="text-lg font-semibold">{data.name}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Sıra Numarası
              </label>
              <div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {data.orderIndex}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Web Sitesi
            </label>
            {data.websiteUrl ? (
              <div>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2 inline-flex"
                >
                  <span>{websiteUrl}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <p className="text-muted-foreground">-</p>
            )}
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
              Logo
            </label>
            {data.logoUrl ? (
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    {/* Logo Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <div className="w-full h-64 rounded-lg border-2 border-border bg-muted/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
                          {logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/')) ? (
                            <img
                              src={logoUrl}
                              alt={data.name}
                              className="w-full h-full object-contain p-8"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                                      <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                      <span class="text-sm">Logo yüklenemedi</span>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                              <Award className="w-16 h-16 mb-2" />
                              <span className="text-sm">Logo</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors pointer-events-none" />
                      </div>
                    </div>

                    {/* Logo Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-sm font-medium text-foreground">Logo URL</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Logo Dosyası:</p>
                        <div className="flex items-center gap-2 group/url">
                          <a
                            href={logoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 truncate flex-1 min-w-0"
                          >
                            {logoUrl}
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
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Logo bulunmamaktadır</p>
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
