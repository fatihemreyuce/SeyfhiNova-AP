import { useParams, useNavigate } from "react-router-dom";
import { useNotificationSubs } from "@/hooks/use-notifications-subs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, User } from "lucide-react";
import { useMemo } from "react";

export default function NotificationSubDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Tüm sayfaları çek ve ID ile bul
  const { data, isLoading } = useNotificationSubs(0, 1000, "id,asc");
  
  const notificationSub = useMemo(() => {
    if (!data?.content) return null;
    return data.content.find((item) => item.id === Number(id));
  }, [data, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (!notificationSub) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">
          Bildirim aboneliği bulunamadı.
        </p>
        <Button variant="outline" onClick={() => navigate("/notification-sub")}>
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
            onClick={() => navigate("/notification-sub")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Bildirim Aboneliği Detayı: {notificationSub.name} {notificationSub.surname}
            </h1>
            <p className="text-muted-foreground">
              #{notificationSub.id} - Bildirim aboneliği detay bilgileri
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Kişi Bilgileri */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Kişi Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Ad Soyad
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/5">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xl font-bold">
                    {notificationSub.name} {notificationSub.surname}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  E-posta
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/5">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-lg font-semibold">{notificationSub.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Abonelik Bilgileri */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Abonelik Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Abonelik ID
                </label>
                <div>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    #{notificationSub.id}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Durum
                </label>
                <div>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    Aktif
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
