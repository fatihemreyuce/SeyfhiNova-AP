import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSliderById } from "@/hooks/use-sliders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Edit,
  Images,
  ExternalLink,
  Copy,
  Maximize2,
  Hash,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function SliderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSliderById(Number(id));
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // URL'deki https'i http'ye çevir
  const imageUrl = data?.imageUrl?.replace(/^https:/, "http:") || data?.imageUrl;

  const handleCopyUrl = async () => {
    if (imageUrl) {
      try {
        await navigator.clipboard.writeText(imageUrl);
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
        <p className="text-muted-foreground mb-4">Slider bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/slider")}>
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
            onClick={() => navigate("/slider")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Slider Detayı: {data.title}
            </h1>
            <p className="text-muted-foreground">
              #{data.id} - Slider detay bilgileri
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/slider/${id}/edit`)}>
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
                  Açıklama
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[100px]">
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

        {/* Right Column - Medya ve Düzen */}
        <div className="space-y-6">
          {/* Image Preview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Medya ve Düzen
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Görsel Önizleme
                </label>
                {imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/")) ? (
                  <div className="relative group">
                    <div className="w-full h-64 rounded-lg border-2 border-border bg-muted/30 overflow-hidden shadow-sm flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={data.title}
                        className="w-full h-full object-contain"
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
                        <Images className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Görsel bulunmamaktadır
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sıra Numarası */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Sıra Numarası
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/5">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{data.orderIndex}</div>
                </div>
              </div>

              {/* Görsel Yolu */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Görsel Yolu
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={imageUrl || ""}
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
                  {imageUrl && (
                    <Button
                      size="icon"
                      variant="outline"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={imageUrl}
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
