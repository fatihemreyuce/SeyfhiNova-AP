import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/use-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Settings,
  ExternalLink,
  Copy,
  Maximize2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Linkedin,
  FileText,
  Cookie,
  Shield,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function SettingsDetail() {
  const navigate = useNavigate();
  const { data, isLoading } = useSettings();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // URL'deki https'i http'ye çevir
  const logoUrl = data?.siteLogo || data?.siteLogoUrl;
  const imageUrl = logoUrl?.replace(/^https:/, "http:") || logoUrl;

  const handleCopyUrl = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} panoya kopyalandı`);
    } catch (err) {
      toast.error(`${label} kopyalanamadı`);
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
        <p className="text-muted-foreground mb-4">Ayar bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/settings/create")}>
          Ayar Oluştur
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary dark:text-blue-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Ayarlar
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground ml-13">
            Site ayar bilgilerini görüntüleyin ve yönetin
          </p>
        </div>
        <Button 
          onClick={() => navigate(`/settings/edit`)}
          className="shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
        >
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Temel Bilgiler */}
        <div className="space-y-6">
          <Card className="border-2 border-border/50 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary dark:text-blue-400" />
                <span>Temel Bilgiler</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-500" />
                  Site Logosu
                </label>
                {imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/")) ? (
                  <div className="relative group">
                    <div className="w-full h-56 rounded-xl border-2 border-border/50 bg-gradient-to-br from-background to-muted/20 overflow-hidden shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl">
                      <img
                        src={imageUrl}
                        alt="Site Logo"
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                                <svg class="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-sm">Görsel yüklenemedi</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Büyüt
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-56 rounded-xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center transition-colors">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center border-2 border-dashed border-border">
                        <Settings className="h-10 w-10 text-blue-500 opacity-50" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Logo bulunmamaktadır
                      </p>
                    </div>
                  </div>
                )}
                {imageUrl && (
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-background/50">
                    <Input
                      value={imageUrl}
                      readOnly
                      className="font-mono text-xs flex-1 truncate border-0 bg-transparent p-0 h-auto"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopyUrl(imageUrl, "Logo URL")}
                      className="h-8 w-8 shrink-0"
                      title="Kopyala"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                      className="h-8 w-8 shrink-0"
                      title="Yeni sekmede aç"
                    >
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-orange-500" />
                  E-posta
                </label>
                {data.email ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-background/50">
                    <p className="text-base font-medium flex-1 truncate">{data.email}</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopyUrl(data.email, "E-posta")}
                      className="h-8 w-8 shrink-0"
                      title="Kopyala"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic p-3 rounded-lg border bg-muted/30">-</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  Telefon Numarası
                </label>
                {data.phoneNumber ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-background/50">
                    <p className="text-base font-medium flex-1 truncate">{data.phoneNumber}</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopyUrl(data.phoneNumber, "Telefon")}
                      className="h-8 w-8 shrink-0"
                      title="Kopyala"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic p-3 rounded-lg border bg-muted/30">-</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Adres
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[80px]">
                  {data.address ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.address }}
                      className="prose prose-sm max-w-none dark:prose-invert"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Adres bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sosyal Medya */}
          <Card className="border-2 border-border/50 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary dark:text-blue-400" />
                Sosyal Medya
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  Instagram URL
                </label>
                {data.instagramUrl ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-background/50">
                    <Input
                      value={data.instagramUrl}
                      readOnly
                      className="font-mono text-xs flex-1 truncate border-0 bg-transparent p-0 h-auto"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopyUrl(data.instagramUrl, "Instagram URL")}
                      className="h-8 w-8 shrink-0"
                      title="Kopyala"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                      className="h-8 w-8 shrink-0"
                      title="Yeni sekmede aç"
                    >
                      <a
                        href={data.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic p-3 rounded-lg border bg-muted/30">-</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  LinkedIn URL
                </label>
                {data.linkedinUrl ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg border bg-background/50">
                    <Input
                      value={data.linkedinUrl}
                      readOnly
                      className="font-mono text-xs flex-1 truncate border-0 bg-transparent p-0 h-auto"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopyUrl(data.linkedinUrl, "LinkedIn URL")}
                      className="h-8 w-8 shrink-0"
                      title="Kopyala"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                      className="h-8 w-8 shrink-0"
                      title="Yeni sekmede aç"
                    >
                      <a
                        href={data.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic p-3 rounded-lg border bg-muted/30">-</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Metin İçerikleri */}
        <div className="space-y-6">
          <Card className="border-2 border-border/50 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary dark:text-blue-400" />
                Metin İçerikleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Gizlilik Metni
                </label>
                <div className="rounded-lg border-2 border-border/50 p-5 bg-gradient-to-br from-background to-muted/20 shadow-sm min-h-[120px]">
                  {data.privacyText ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.privacyText }}
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic flex items-center justify-center h-full">
                      Gizlilik metni bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Gizlilik Politikası
                </label>
                <div className="rounded-lg border-2 border-border/50 p-5 bg-gradient-to-br from-background to-muted/20 shadow-sm min-h-[120px]">
                  {data.privacyPolicy ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.privacyPolicy }}
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic flex items-center justify-center h-full">
                      Gizlilik politikası bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  İletişim Formu Metni
                </label>
                <div className="rounded-lg border-2 border-border/50 p-5 bg-gradient-to-br from-background to-muted/20 shadow-sm min-h-[120px]">
                  {data.contactFormText ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.contactFormText }}
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic flex items-center justify-center h-full">
                      İletişim formu metni bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Cookie className="h-4 w-4 text-amber-500" />
                  Çerez Politikası
                </label>
                <div className="rounded-lg border-2 border-border/50 p-5 bg-gradient-to-br from-background to-muted/20 shadow-sm min-h-[120px]">
                  {data.cookiePolicy ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.cookiePolicy }}
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic flex items-center justify-center h-full">
                      Çerez politikası bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarih Bilgileri */}
          <Card className="border-2 border-border/50 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary dark:text-blue-400" />
                Oluşturma Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2 p-4 rounded-lg bg-muted/20 border border-border/30">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Oluşturulma Tarihi
                </label>
                <p className="text-base font-medium">
                  {data.createdAt ? new Date(data.createdAt).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  }) : "-"}
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-muted/20 border border-border/30">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Güncellenme Tarihi
                </label>
                <p className="text-base font-medium">
                  {data.updatedAt ? new Date(data.updatedAt).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  }) : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && imageUrl && (
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
              src={imageUrl}
              alt="Site Logo"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
