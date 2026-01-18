import { useNavigate } from "react-router-dom";
import { useOfficialPages } from "@/hooks/use-offical-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  FileText,
  Copy,
  Maximize2,
  Hash,
  X,
  Download,
  ExternalLink,
  List,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OfficialPageDetail() {
  const navigate = useNavigate();
  
  // Resmi sayfayı çek
  const { data: officialPage, isLoading } = useOfficialPages();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (!officialPage) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Resmi sayfa bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/official-page")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} panoya kopyalandı`);
    } catch (err) {
      toast.error(`${label} kopyalanamadı`);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/official-page")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Resmi Sayfa Detayı
            </h1>
            <p className="text-muted-foreground">
              #{officialPage.id} - Resmi sayfa detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/official-page/edit`)}>
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
                    {officialPage.id}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Açıklama
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[150px]">
                  {officialPage.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: officialPage.description }}
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

          {/* Kalite Politikası */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">
                  Kalite Politikası ({(officialPage as any).qualityPolitics?.length || 0})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {(officialPage as any).qualityPolitics && (officialPage as any).qualityPolitics.length > 0 ? (
                <div className="space-y-4">
                  {(officialPage as any).qualityPolitics
                    .sort((a: any, b: any) => {
                      const aOrder = typeof a.orderNumber === "string" ? parseInt(a.orderNumber, 10) : a.orderNumber;
                      const bOrder = typeof b.orderNumber === "string" ? parseInt(b.orderNumber, 10) : b.orderNumber;
                      return aOrder - bOrder;
                    })
                    .map((policy: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-md border p-4 bg-muted/30"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                Sıra: {typeof policy.orderNumber === "string" ? parseInt(policy.orderNumber, 10) : policy.orderNumber}
                              </Badge>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {policy.text}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              handleCopyText(policy.text, "Kalite politikası")
                            }
                            className="flex-shrink-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Kalite politikası bulunmamaktadır
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Belgeler */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">
                  Belgeler ({officialPage.documents?.length || 0})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {officialPage.documents && officialPage.documents.length > 0 ? (
                <div className="space-y-3">
                  {officialPage.documents.map((document) => {
                    const assetUrl = document.asset?.replace(/^https:/, "http:") || document.asset;
                    return (
                      <div
                        key={document.id}
                        className="flex items-center justify-between gap-3 rounded-md border p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {document.name || `Belge #${document.id}`}
                            </p>
                            {assetUrl && (
                              <p className="text-xs text-muted-foreground truncate">
                                {assetUrl}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {assetUrl && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  handleCopyText(assetUrl, "Belge URL")
                                }
                                className="h-8 w-8"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                asChild
                                className="h-8 w-8"
                              >
                                <a
                                  href={assetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Belge bulunmamaktadır
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
