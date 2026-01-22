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
  newPassword: z.string()
    .min(6, "Yeni şifre en az 6 karakter olmalıdır")
    .regex(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
    .regex(/[a-z]/, "Şifre en az bir küçük harf içermelidir")
    .regex(/[0-9]/, "Şifre en az bir rakam içermelidir"),
  confirmPassword: z.string().min(1, "Şifre doğrulama gereklidir"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Şifre güçlülük kontrolü
  const getPasswordStrength = (password: string): { strength: "weak" | "medium" | "strong"; label: string; color: string } => {
    if (password.length === 0) return { strength: "weak", label: "", color: "" };
    if (password.length < 6) return { strength: "weak", label: "Zayıf", color: "text-red-500" };
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    const criteriaCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (criteriaCount >= 3 && password.length >= 8) {
      return { strength: "strong", label: "Güçlü", color: "text-green-500" };
    } else if (criteriaCount >= 2 || password.length >= 6) {
      return { strength: "medium", label: "Orta", color: "text-yellow-500" };
    }
    return { strength: "weak", label: "Zayıf", color: "text-red-500" };
  };

  const newPassword = passwordForm.watch("newPassword");
  const confirmPassword = passwordForm.watch("confirmPassword");
  const passwordStrength = getPasswordStrength(newPassword);

  const handlePasswordChange = (values: PasswordFormValues) => {
    if (id) {
      changePasswordMutation.mutate(
        { 
          id: Number(id), 
          oldPassword: values.oldPassword,
          newPassword: values.newPassword 
        },
        {
          onSuccess: () => {
            setPasswordDialogOpen(false);
            passwordForm.reset();
            setShowOldPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
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
          <ArrowLeft className="h-4 w-4 mr-2 text-primary dark:text-blue-400" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    if (role === "ROLE_ADMIN") {
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300">
        <UserCircle className="h-3 w-3 mr-1" />
        Editör
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/user")}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            <div className="flex items-center gap-3">
              <Dialog 
                open={passwordDialogOpen} 
                onOpenChange={(open) => {
                  setPasswordDialogOpen(open);
                  if (!open) {
                    passwordForm.reset();
                    setShowOldPassword(false);
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-10 px-4 rounded-xl font-medium bg-background hover:bg-muted border-2 transition-all duration-200">
                    <Key className="h-4 w-4 mr-2" />
                    Şifre Değiştir
                  </Button>
                </DialogTrigger>
            <DialogContent className="sm:max-w-[580px] rounded-3xl p-0 gap-0 overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/30">
              {/* Header Section with Gradient */}
              <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent border-b border-border/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center shadow-xl ring-2 ring-primary/10">
                      <Key className="h-8 w-8 text-primary dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-3xl font-bold tracking-tight text-foreground mb-2">
                        Şifre Değiştir
                      </DialogTitle>
                      <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        <span className="font-medium text-foreground/80">{data.username}</span> kullanıcısının şifresini güvenli bir şekilde değiştirin.
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              {/* Form Content */}
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                  className="px-8 py-6 space-y-6"
                >
                  {/* Eski Şifre */}
                  <FormField
                    control={passwordForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2.5">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Eski Şifre
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                              <Lock className="h-5 w-5 text-destructive/70 group-focus-within:text-destructive transition-colors duration-200" />
                            </div>
                            <Input
                              type={showOldPassword ? "text" : "password"}
                              placeholder="Mevcut şifrenizi giriniz"
                              className="h-14 pl-12 pr-14 text-base border-2 border-border/60 bg-background/50 focus:bg-background focus:border-destructive/50 focus:ring-2 focus:ring-destructive/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-muted/50 active:scale-95"
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
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Yeni Şifre */}
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2.5">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Yeni Şifre
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="relative group">
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                <Lock className="h-5 w-5 text-primary/70 group-focus-within:text-primary transition-colors duration-200" />
                              </div>
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Yeni şifrenizi giriniz"
                                className="h-14 pl-12 pr-14 text-base border-2 border-border/60 bg-background/50 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-muted/50 active:scale-95"
                                aria-label={showNewPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            
                            {/* Şifre Güçlülük Göstergesi */}
                            {newPassword && (
                              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Şifre Güçlülüğü:</span>
                                  <span className={`font-semibold ${passwordStrength.color}`}>
                                    {passwordStrength.label}
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${
                                      passwordStrength.strength === "weak"
                                        ? "bg-red-500 w-1/3"
                                        : passwordStrength.strength === "medium"
                                        ? "bg-yellow-500 w-2/3"
                                        : "bg-green-500 w-full"
                                    }`}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Şifre Gereksinimleri */}
                            <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-1.5">
                              <p className="text-xs font-semibold text-foreground mb-1.5">Şifre Gereksinimleri:</p>
                              <div className="grid grid-cols-2 gap-1.5 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                                  <span className={newPassword.length >= 6 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                                    En az 6 karakter
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                                  <span className={/[A-Z]/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                                    Büyük harf
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                                  <span className={/[a-z]/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                                    Küçük harf
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                                  <span className={/[0-9]/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                                    Rakam
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Yeni Şifre Doğrulama */}
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2.5">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Yeni Şifreyi Doğrula
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                              <Lock className={`h-5 w-5 transition-colors duration-200 ${
                                confirmPassword && newPassword === confirmPassword
                                  ? "text-green-500"
                                  : confirmPassword && newPassword !== confirmPassword
                                  ? "text-destructive"
                                  : "text-primary/70 group-focus-within:text-primary"
                              }`} />
                            </div>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Yeni şifrenizi tekrar giriniz"
                              className={`h-14 pl-12 pr-14 text-base border-2 bg-background/50 focus:bg-background transition-all duration-200 rounded-xl shadow-sm hover:shadow-md ${
                                confirmPassword && newPassword === confirmPassword
                                  ? "border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                  : confirmPassword && newPassword !== confirmPassword
                                  ? "border-destructive/50 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                                  : "border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                              }`}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-muted/50 active:scale-95"
                              aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                            {confirmPassword && newPassword === confirmPassword && (
                              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Footer Actions */}
                  <DialogFooter className="gap-3 pt-4 border-t border-border/50 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPasswordDialogOpen(false);
                        passwordForm.reset();
                        setShowOldPassword(false);
                        setShowNewPassword(false);
                        setShowConfirmPassword(false);
                      }}
                      className="h-12 px-8 rounded-xl font-semibold border-2 hover:bg-muted/50 transition-all duration-200 flex-1 sm:flex-none"
                      disabled={changePasswordMutation.isPending}
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending || !passwordForm.formState.isValid}
                      className="h-12 px-8 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {changePasswordMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Değiştiriliyor...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Şifreyi Değiştir
                        </span>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
              <Button 
                onClick={() => navigate(`/user/${id}/edit`)}
                className="h-10 px-4 rounded-xl font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Edit className="h-4 w-4 mr-2 text-white dark:text-white" />
                Düzenle
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section - Profile Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-muted/20 border-2 border-border/50 shadow-2xl p-8 md:p-10">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-muted/50 dark:bg-primary/20 border-2 border-border/50 flex items-center justify-center shadow-lg">
                  <User className="h-12 w-12 md:h-14 md:w-14 text-muted-foreground dark:text-primary" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-md">
                  {getRoleBadge(data.role)}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                    {data.firstName} {data.lastName}
                  </h1>
                  <p className="text-lg text-muted-foreground flex items-center gap-2">
                    <span className="font-mono">@{data.username}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <Badge variant="outline" className="font-mono bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                      ID: #{data.id}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-2 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-card to-muted/30 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Kullanıcı Adı</p>
                  <p className="text-lg font-bold text-foreground">{data.username}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-card to-muted/30 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Rol</p>
                  <div className="mt-1">{getRoleBadge(data.role)}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-card to-muted/30 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">E-posta</p>
                  <p className="text-sm font-semibold text-foreground truncate max-w-[140px]">{data.email}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Hesap Bilgileri */}
          <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-blue-500/5 via-blue-500/3 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                  Hesap Bilgileri
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Kullanıcı Adı */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Kullanıcı Adı
                </label>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-base font-semibold text-foreground">{data.username}</p>
                </div>
              </div>

              {/* E-posta */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-orange-500" />
                  E-posta
                </label>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-base font-semibold text-foreground break-words">{data.email}</p>
                </div>
              </div>

              {/* Rol */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Rol
                </label>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  {getRoleBadge(data.role)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kişisel Bilgiler */}
          <Card className="border-2 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserCircle className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground dark:text-white">
                  Kişisel Bilgiler
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Ad */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground">
                  Ad
                </label>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-base font-semibold text-foreground">{data.firstName}</p>
                </div>
              </div>

              {/* Soyad */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground">
                  Soyad
                </label>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-base font-semibold text-foreground">{data.lastName}</p>
                </div>
              </div>

              {/* Şifre */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-red-500" />
                  Şifre
                </label>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
                  <p className="text-sm text-muted-foreground italic">
                    Şifre güvenlik nedeniyle gösterilmez
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordDialogOpen(true)}
                    className="w-full sm:w-auto border-2 hover:bg-muted/50 transition-all duration-200"
                  >
                    <Key className="h-3 w-3 mr-2" />
                    Şifreyi Değiştir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
