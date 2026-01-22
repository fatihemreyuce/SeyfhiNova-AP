import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetNotificationById, useSendNotification } from "@/hooks/use-notifications";
import { useGetUserMe } from "@/hooks/use-user";
import { login } from "@/services/auth-services";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  Send,
  Hash,
  Sparkles,
  Bell,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function NotificationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetNotificationById(Number(id));
  const sendMutation = useSendNotification();
  const { data: userMe } = useGetUserMe();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordToSend, setPasswordToSend] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

  const handleSend = () => {
    setPasswordDialogOpen(true);
  };

  const confirmSend = async () => {
    if (!id || !passwordToSend.trim()) {
      return;
    }

    if (!userMe?.email) {
      toast.error("Kullanıcı bilgisi alınamadı. Lütfen sayfayı yenileyin.");
      return;
    }

    setPasswordError("");
    setIsVerifyingPassword(true);

    try {
      // Şifre doğrulaması için login endpoint'ini kullan
      await login({
        email: userMe.email,
        password: passwordToSend,
      });

      // Şifre doğru, bildirimi gönder
      sendMutation.mutate(Number(id), {
        onSuccess: () => {
          setPasswordDialogOpen(false);
          setPasswordToSend("");
          setShowPassword(false);
          setPasswordError("");
        },
        onError: () => {
          // Bildirim gönderme hatası
          setPasswordError("");
        },
      });
    } catch (error: any) {
      // Şifre yanlış
      setPasswordError("Şifre yanlış. Lütfen tekrar deneyin.");
      setPasswordToSend("");
    } finally {
      setIsVerifyingPassword(false);
    }
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
            <Bell className="h-12 w-12 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Bildirim bulunamadı</h3>
            <p className="text-muted-foreground">Aradığınız bildirim mevcut değil.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/notification")} size="lg">
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
              onClick={() => navigate("/notification")}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all duration-200 self-start sm:self-auto"
            >
              <ArrowLeft className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="h-10 px-4 rounded-xl font-medium border-2 hover:bg-muted transition-all duration-200 w-full sm:w-auto"
              >
                <Send className="h-4 w-4 mr-2 text-foreground dark:text-white" />
                {sendMutation.isPending ? "Gönderiliyor..." : "Gönder"}
              </Button>
              <Button 
                onClick={() => navigate(`/notification/${id}/edit`)}
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
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">
                Bildirim Detayı
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
              {/* Başlık */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <label className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wide">
                    Başlık
                  </label>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300">
                  <p className="text-2xl font-bold text-foreground dark:text-white leading-tight">
                    {data.title || (
                      <span className="text-muted-foreground dark:text-muted-foreground/60 italic">
                        Başlık girilmemiş
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - İçerik */}
          <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                  İçerik
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/60 dark:to-muted/40 border-2 border-border/50 dark:border-border/70 group-hover:border-primary/50 dark:group-hover:border-primary/60 transition-all duration-300 min-h-[300px]">
                {data.content ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: data.content }}
                    className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground dark:prose-headings:text-white prose-p:text-foreground/90 dark:prose-p:text-white/90 prose-strong:text-foreground dark:prose-strong:text-white prose-a:text-primary dark:prose-a:text-primary"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 dark:bg-muted/70 flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 italic">
                      İçerik bulunmamaktadır
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onOpenChange={(open) => {
          setPasswordDialogOpen(open);
          if (!open) {
            setPasswordToSend("");
            setShowPassword(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Şifre Onayı</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Bildirimi göndermek için şifrenizi giriniz.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi giriniz"
                  value={passwordToSend}
                  onChange={(e) => {
                    setPasswordToSend(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && passwordToSend.trim() && !isVerifyingPassword) {
                      confirmSend();
                    }
                  }}
                  className={`pl-10 pr-10 h-12 text-base ${
                    passwordError ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 font-medium mt-1">{passwordError}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPasswordDialogOpen(false);
                setPasswordToSend("");
                setShowPassword(false);
                setPasswordError("");
              }}
              disabled={sendMutation.isPending || isVerifyingPassword}
            >
              İptal
            </Button>
            <Button
              onClick={confirmSend}
              disabled={!passwordToSend.trim() || sendMutation.isPending || isVerifyingPassword}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              <Send className="h-4 w-4 mr-2" />
              {isVerifyingPassword
                ? "Doğrulanıyor..."
                : sendMutation.isPending
                ? "Gönderiliyor..."
                : "Gönder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
