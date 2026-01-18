import { useParams, useNavigate } from "react-router-dom";
import { useGetContactById } from "@/hooks/use-contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  FileText,
  Hash,
} from "lucide-react";

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetContactById(Number(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground dark:text-foreground/70">Yükleniyor...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground dark:text-foreground/70 mb-4">İletişim kaydı bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/contact")}>
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
            onClick={() => navigate("/contact")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">
              İletişim Detayı
            </h1>
            <p className="text-muted-foreground dark:text-foreground/70">
              #{data.id} - İletişim detay bilgileri
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Kişisel Bilgiler */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Kişisel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground dark:text-foreground/70">
                  ID
                </label>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground dark:text-foreground/60" />
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {data.id}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground dark:text-foreground/70">
                  Ad
                </label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground dark:text-foreground/60" />
                  <p className="text-lg font-semibold dark:text-foreground">{data.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground dark:text-foreground/70">
                  Soyad
                </label>
                <p className="text-lg font-semibold dark:text-foreground">{data.surname}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground dark:text-foreground/70">
                  Telefon
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground dark:text-foreground/60" />
                  <p className="text-lg font-semibold dark:text-foreground">{data.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Mesaj Bilgileri */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">
                  Mesaj Bilgileri
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground dark:text-foreground/70">
                  Konu
                </label>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground dark:text-foreground/60" />
                  <p className="text-lg font-semibold dark:text-foreground">{data.subject}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground dark:text-foreground/70">
                  Açıklama
                </label>
                <div className="rounded-md border p-4 bg-muted/30 min-h-[200px]">
                  {data.description ? (
                    <p className="text-sm leading-relaxed dark:text-foreground/80 whitespace-pre-wrap">
                      {data.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic dark:text-foreground/50">
                      Açıklama bulunmamaktadır
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
