import { useParams, useNavigate } from "react-router-dom";
import { useGetNotificationById, useSendNotification } from "@/hooks/use-notifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Send } from "lucide-react";

export default function NotificationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetNotificationById(Number(id));
  const sendMutation = useSendNotification();

  const handleSend = () => {
    if (id) {
      sendMutation.mutate(Number(id));
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
        <p className="text-muted-foreground mb-4">Bildirim bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/notification")}>
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
            onClick={() => navigate("/notification")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Bildirim Detayı: {data.title}
            </h1>
            <p className="text-muted-foreground">
              #{data.id} - Bildirim detay bilgileri
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSend}
            disabled={sendMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {sendMutation.isPending ? "Gönderiliyor..." : "Gönder"}
          </Button>
          <Button onClick={() => navigate(`/notification/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
        </div>
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
            </CardContent>
          </Card>
        </div>

        {/* Right Column - İçerik */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                İçerik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Detaylı İçerik
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[200px]">
                  {data.content ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.content }}
                      className="prose prose-sm max-w-none dark:prose-invert"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      İçerik bulunmamaktadır
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
