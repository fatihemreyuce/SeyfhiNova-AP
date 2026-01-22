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
  Briefcase,
  Sparkles,
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
            <Briefcase className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Servis bulunamadı</h3>
            <p className="text-muted-foreground">Aradığınız servis mevcut değil.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/service")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
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
              onClick={() => navigate("/service")}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all duration-200 self-start sm:self-auto"
            >
              <ArrowLeft className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate(`/service/${id}/edit`)}
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
              <Briefcase className="h-6 w-6 text-primary dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">
                Servis Detayı
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
            {/* Service Info Card */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-blue-500/5 via-blue-500/3 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    Servis Bilgileri
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Category and Order */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 border-2 border-primary/20 dark:border-primary/30 group-hover:border-primary/40 dark:group-hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-primary dark:text-blue-400" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80">
                        Kategori
                      </p>
                    </div>
                    <Badge className="text-base px-4 py-2 font-semibold bg-gradient-to-r from-primary to-primary/90 text-white border-0 shadow-lg">
                      {getCategoryName(data.categoryId)}
                    </Badge>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 border-2 border-primary/20 dark:border-primary/30 group-hover:border-primary/40 dark:group-hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Hash className="h-5 w-5 text-primary dark:text-blue-400" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80">
                        Sıra Numarası
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center border-2 border-primary/30 shadow-lg">
                        <Hash className="h-8 w-8 text-primary dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-foreground dark:text-white">
                          {data.orderIndex}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 mt-1">
                          Sıralama pozisyonu
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    Detaylı Açıklama
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {data.description ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300 min-h-[300px]">
                    <div
                      dangerouslySetInnerHTML={{ __html: data.description }}
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground dark:prose-headings:text-white prose-p:text-foreground/90 dark:prose-p:text-white/90 prose-strong:text-foreground dark:prose-strong:text-white prose-a:text-primary dark:prose-a:text-primary"
                    />
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 dark:from-muted/50 dark:to-muted/30 border-2 border-dashed border-border/50 dark:border-border/70 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-20 h-20 rounded-2xl bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4 border-2 border-border/50">
                      <FileText className="h-10 w-10 text-muted-foreground dark:text-muted-foreground/60" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80">
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
            <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-green-500/5 via-green-500/3 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 dark:from-green-500/30 dark:to-green-600/20 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                    Hızlı Bilgiler
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border border-border/50 dark:border-border/70">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Hash className="h-5 w-5 text-primary dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 mb-1 uppercase tracking-wide">Servis ID</p>
                      <p className="text-lg font-bold text-foreground dark:text-white">#{data.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border border-border/50 dark:border-border/70">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-primary dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 mb-1 uppercase tracking-wide">Kategori</p>
                      <p className="text-lg font-bold text-foreground dark:text-white truncate">{getCategoryName(data.categoryId)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border border-border/50 dark:border-border/70">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Hash className="h-5 w-5 text-primary dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 mb-1 uppercase tracking-wide">Sıra</p>
                      <p className="text-lg font-bold text-foreground dark:text-white">#{data.orderIndex}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
