import { useParams, useNavigate } from "react-router-dom";
import { useGetUserById, useChangePassword } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  Mail,
  User,
  Shield,
  UserCircle,
  Lock,
  Key,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Eski şifre gereklidir"),
  newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetUserById(Number(id));
  const changePasswordMutation = useChangePassword();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handlePasswordChange = (values: PasswordFormValues) => {
    if (id) {
      changePasswordMutation.mutate(
        { id: Number(id), password: values.newPassword },
        {
          onSuccess: () => {
            setPasswordDialogOpen(false);
            passwordForm.reset();
            setShowOldPassword(false);
            setShowNewPassword(false);
          },
        }
      );
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
        <p className="text-muted-foreground mb-4">Kullanıcı bulunamadı.</p>
        <Button variant="outline" onClick={() => navigate("/user")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    if (role === "ROLE_ADMIN") {
      return (
        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700">
        <UserCircle className="h-3 w-3 mr-1" />
        Editör
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/user")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Kullanıcı Detayı
            </h1>
            <p className="text-muted-foreground">
              #{data.id} - {data.username} kullanıcısının detay bilgileri
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog 
            open={passwordDialogOpen} 
            onOpenChange={(open) => {
              setPasswordDialogOpen(open);
              if (!open) {
                passwordForm.reset();
                setShowOldPassword(false);
                setShowNewPassword(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Key className="h-4 w-4 mr-2" />
                Şifre Değiştir
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">Şifre Değiştir</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                      {data.username} kullanıcısının şifresini değiştirin.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                  className="space-y-5 pt-4"
                >
                  {/* Eski Şifre */}
                  <FormField
                    control={passwordForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">
                          Eski Şifre
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors duration-200" />
                            <Input
                              type={showOldPassword ? "text" : "password"}
                              placeholder="Eski şifrenizi giriniz"
                              className="h-12 pl-12 pr-12 text-base border-2 border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1.5 rounded-lg hover:bg-accent"
                              aria-label={showOldPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                            >
                              {showOldPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Yeni Şifre */}
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">
                          Yeni Şifre
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors duration-200" />
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Yeni şifre giriniz (min 6 karakter)"
                              className="h-12 pl-12 pr-12 text-base border-2 border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1.5 rounded-lg hover:bg-accent"
                              aria-label={showNewPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="gap-3 pt-4 border-t border-border/50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPasswordDialogOpen(false);
                        passwordForm.reset();
                        setShowOldPassword(false);
                        setShowNewPassword(false);
                      }}
                      className="h-11 px-6 rounded-xl font-semibold"
                      disabled={changePasswordMutation.isPending}
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="h-11 px-6 rounded-xl font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {changePasswordMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Değiştiriliyor...
                        </span>
                      ) : (
                        "Şifreyi Değiştir"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Button onClick={() => navigate(`/user/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {data.firstName} {data.lastName}
              </CardTitle>
              <p className="text-muted-foreground mt-1">@{data.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hesap Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Hesap Bilgileri</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Kullanıcı Adı
                  </label>
                  <p className="text-base font-medium">{data.username}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-posta
                  </label>
                  <p className="text-base font-medium">{data.email}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Rol
                  </label>
                  <div>{getRoleBadge(data.role)}</div>
                </div>
              </div>
            </div>

            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Kişisel Bilgiler</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Ad
                  </label>
                  <p className="text-base font-medium">{data.firstName}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Soyad
                  </label>
                  <p className="text-base font-medium">{data.lastName}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Şifre
                  </label>
                  <p className="text-sm text-muted-foreground italic">
                    Şifre güvenlik nedeniyle gösterilmez
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    <Key className="h-3 w-3 mr-2" />
                    Şifreyi Değiştir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
