import { useNavigate } from "react-router-dom";
import { useOfficialPages } from "@/hooks/use-offical-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  FileText,
  Copy,
  Hash,
  ExternalLink,
  List,
  Sparkles,
  CheckCircle2,
  File,
} from "lucide-react";
import { toast } from "sonner";

export default function OfficialPageDetail() {
  const navigate = useNavigate();
  
  // Resmi sayfayı çek
  const { data: officialPage, isLoading } = useOfficialPages();

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

  if (!officialPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Resmi sayfa bulunamadı</h3>
            <p className="text-muted-foreground">Resmi sayfa mevcut değil.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/official-page")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
            Geri Dön
          </Button>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/official-page")}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate(`/official-page/edit`)}
                className="h-10 px-4 rounded-xl font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Edit className="h-4 w-4 mr-2 text-white dark:text-white" />
                Düzenle
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">
                Resmi Sayfa Detayı
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <p className="text-muted-foreground dark:text-muted-foreground/80">
                  Resmi sayfa detay bilgileri
                </p>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/50 dark:bg-muted/70">
                  <Hash className="h-3.5 w-3.5 text-foreground dark:text-white" />
                  <span className="text-sm font-semibold text-foreground dark:text-white">ID: {officialPage.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Temel Bilgiler ve Kalite Politikası */}
          <div className="space-y-6">
            {/* Temel Bilgiler */}
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
                {/* Açıklama */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <label className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                      Açıklama
                    </label>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300 min-h-[200px]">
                    {officialPage.description ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: officialPage.description }}
                        className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground dark:prose-headings:text-white prose-p:text-foreground/90 dark:prose-p:text-white/90 prose-strong:text-foreground dark:prose-strong:text-white prose-a:text-primary dark:prose-a:text-primary"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-center">
                        <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-blue-500" />
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

            {/* Kalite Politikası */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-green-500/5 via-green-500/3 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 dark:from-green-500/30 dark:to-green-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <List className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                      Kalite Politikası
                    </CardTitle>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg">
                    {(officialPage as any).qualityPolitics?.length || 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
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
                          className="p-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 group/item"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-gradient-to-r from-primary to-primary/90 text-white border-0 px-3 py-1 text-xs font-semibold">
                                  Sıra: {typeof policy.orderNumber === "string" ? parseInt(policy.orderNumber, 10) : policy.orderNumber}
                                </Badge>
                              </div>
                              <div
                                dangerouslySetInnerHTML={{ __html: policy.text }}
                                className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground dark:prose-headings:text-white prose-p:text-foreground/90 dark:prose-p:text-white/90 prose-strong:text-foreground dark:prose-strong:text-white prose-a:text-primary dark:prose-a:text-primary text-sm leading-relaxed"
                              />
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleCopyText(policy.text, "Kalite politikası")
                              }
                              className="flex-shrink-0 h-9 w-9 rounded-xl hover:bg-accent dark:hover:bg-accent/80 opacity-0 group-hover/item:opacity-100 transition-opacity"
                              title="Kopyala"
                            >
                              <Copy className="h-4 w-4 text-foreground dark:text-white" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                      <List className="h-8 w-8 text-muted-foreground dark:text-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 italic">
                      Kalite politikası bulunmamaktadır
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Belgeler */}
          <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group h-fit">
            <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <File className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    Belgeler
                  </CardTitle>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg">
                  {officialPage.documents?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {officialPage.documents && officialPage.documents.length > 0 ? (
                <div className="space-y-3">
                  {officialPage.documents.map((document) => {
                    const assetUrl = document.asset?.replace(/^https:/, "http:") || document.asset;
                    return (
                      <div
                        key={document.id}
                        className="p-4 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 group/item"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-primary dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground dark:text-white truncate mb-1">
                                {document.name || `Belge #${document.id}`}
                              </p>
                              {assetUrl && (
                                <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 truncate">
                                  {assetUrl}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            {assetUrl && (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    handleCopyText(assetUrl, "Belge URL")
                                  }
                                  className="h-9 w-9 rounded-xl hover:bg-accent dark:hover:bg-accent/80"
                                  title="Kopyala"
                                >
                                  <Copy className="h-4 w-4 text-foreground dark:text-white" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  asChild
                                  className="h-9 w-9 rounded-xl hover:bg-accent dark:hover:bg-accent/80"
                                  title="Yeni sekmede aç"
                                >
                                  <a
                                    href={assetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-4 w-4 text-foreground dark:text-white" />
                                  </a>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                    <File className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 italic">
                    Belge bulunmamaktadır
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
