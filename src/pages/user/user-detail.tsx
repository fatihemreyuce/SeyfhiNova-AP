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
  Hash,
  AtSign,
  FileText,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-8">
      {/* Header Section */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/user")}
                className="h-9 w-9 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <h1 className="text-lg font-semibold text-foreground">
                  Kullanıcı Detayı
                </h1>
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
                  <Button variant="outline" className="gap-2">
                    <Key className="h-4 w-4" />
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
              <Button 
                onClick={() => navigate(`/user/${id}/edit`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Düzenle
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <CardContent className="relative p-8">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl">
                    <User className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-4 border-card shadow-lg"></div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge 
                      variant="outline" 
                      className="font-mono text-xs bg-primary/10 text-primary border-primary/20 px-2.5 py-0.5"
                    >
                      ID: {data.id}
                    </Badge>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Kullanıcı
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                    {data.firstName} {data.lastName}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AtSign className="h-4 w-4" />
                    <span className="text-lg">@{data.username}</span>
                  </div>
                </div>
                <div className="pt-2">
                  {getRoleBadge(data.role)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Account Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Hesap Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Kullanıcı Adı
                        </p>
                        <p className="text-base font-semibold text-foreground">{data.username}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          E-posta
                        </p>
                        <p className="text-base font-semibold text-foreground break-all">{data.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between py-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Rol
                        </p>
                        <div>{getRoleBadge(data.role)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Kişisel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Ad
                        </p>
                        <p className="text-base font-semibold text-foreground">{data.firstName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Soyad
                        </p>
                        <p className="text-base font-semibold text-foreground">{data.lastName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between py-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Şifre
                        </p>
                        <p className="text-sm text-muted-foreground italic mb-2">
                          Şifre güvenlik nedeniyle gösterilmez
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" />
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
                      <p className="text-xs font-medium text-muted-foreground mb-1">Kullanıcı ID</p>
                      <p className="text-base font-semibold text-foreground">#{data.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Kullanıcı Adı</p>
                      <p className="text-base font-semibold text-foreground">@{data.username}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Rol</p>
                      <div>{getRoleBadge(data.role)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">E-posta</p>
                      <p className="text-base font-semibold text-foreground truncate">{data.email}</p>
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
