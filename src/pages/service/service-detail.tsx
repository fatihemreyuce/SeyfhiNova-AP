import { useParams, useNavigate } from "react-router-dom";
import { useGetServiceById } from "@/hooks/use-service";
import { useServiceCategory } from "@/hooks/use-category-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Hash,
  Tag,
  FileText,
  Layers,
  Briefcase,
} from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetServiceById(Number(id));
  const { data: categoriesData } = useServiceCategory("", 0, 100, "id,asc");

  const getCategoryName = (categoryId: number) => {
    const category = categoriesData?.content.find((cat) => cat.id === categoryId);
    return category?.name || `Kategori #${categoryId}`;
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
        <p className="text-muted-foreground mb-4">Servis bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/service")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

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
                onClick={() => navigate("/service")}
                className="h-9 w-9 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <h1 className="text-lg font-semibold text-foreground">
                  Servis Detayı
                </h1>
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/service/${id}/edit`)}
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
                  Servis
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
            {/* Service Info Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <CardHeader className="relative pb-6">
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Servis Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-6">
                {/* Category and Order */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Kategori
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-base px-3 py-1.5 font-semibold mt-2">
                      {getCategoryName(data.categoryId)}
                    </Badge>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Hash className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Sıra Numarası
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-foreground mt-2">
                      #{data.orderIndex}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Detaylı Açıklama
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.description ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground">
                    <div
                      dangerouslySetInnerHTML={{ __html: data.description }}
                      className="rounded-lg p-6 bg-muted/30 border border-border min-h-[200px]"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg p-12 bg-muted/20 border-2 border-dashed border-border flex flex-col items-center justify-center text-center min-h-[200px]">
                    <FileText className="h-12 w-12 text-muted-foreground opacity-40 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Açıklama bulunmamaktadır
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Hızlı Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Servis ID</p>
                      <p className="text-base font-semibold text-foreground">#{data.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Kategori</p>
                      <p className="text-base font-semibold text-foreground">{getCategoryName(data.categoryId)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Sıra</p>
                      <p className="text-base font-semibold text-foreground">#{data.orderIndex}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Preview Card */}
            {data.description && (
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Özet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                    {stripHtml(data.description)}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
