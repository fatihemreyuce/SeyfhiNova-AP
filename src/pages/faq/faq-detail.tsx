import { useParams, useNavigate } from "react-router-dom";
import { useGetFaqById } from "@/hooks/use-faqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Hash,
  Sparkles,
  HelpCircle,
  MessageSquare,
  FileText,
} from "lucide-react";

export default function FaqDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetFaqById(Number(id));

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
            <HelpCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Soru bulunamadı</h3>
            <p className="text-muted-foreground">Aradığınız soru mevcut değil.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/faq")} size="lg">
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
              onClick={() => navigate("/faq")}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all duration-200 self-start sm:self-auto"
            >
              <ArrowLeft className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate(`/faq/${id}/edit`)}
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
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">
                SSS Detayı
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <p className="text-muted-foreground dark:text-muted-foreground/80">
                  Sıkça sorulan soru detay bilgileri
                </p>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/50 dark:bg-muted/70">
                  <Hash className="h-3.5 w-3.5 text-foreground dark:text-white" />
                  <span className="text-sm font-semibold text-foreground dark:text-white">ID: {data.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Temel Bilgiler */}
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
              {/* Soru */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <label className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                    Soru
                  </label>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300">
                  <p className="text-2xl font-bold text-foreground dark:text-white leading-tight">
                    {data.question || (
                      <span className="text-muted-foreground dark:text-muted-foreground/60 italic">
                        Soru girilmemiş
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Sıra Numarası */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Hash className="h-4 w-4 text-primary dark:text-blue-400" />
                  </div>
                  <label className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                    Sıra Numarası
                  </label>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300">
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

          {/* Right Column - Cevap */}
          <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                  Cevap
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300 min-h-[400px]">
                {data.answer ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: data.answer }}
                    className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground dark:prose-headings:text-white prose-p:text-foreground/90 dark:prose-p:text-white/90 prose-strong:text-foreground dark:prose-strong:text-white prose-a:text-primary dark:prose-a:text-primary"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground dark:text-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 italic">
                      Cevap bulunmamaktadır
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
