import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSettings } from "@/hooks/use-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import { ArrowLeft, Save, Settings, Upload, X, Mail, Phone, MapPin, Globe, Instagram, Linkedin, FileText, Cookie, Shield } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  phoneNumber: z.string()
    .min(1, "Telefon numarası gereklidir")
    .max(20, "Telefon numarası en fazla 20 karakter olabilir"),
  email: z.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .min(1, "E-posta gereklidir")
    .max(255, "E-posta en fazla 255 karakter olabilir"),
  instagramUrl: z.string()
    .max(500, "Instagram URL en fazla 500 karakter olabilir")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z.string()
    .max(500, "LinkedIn URL en fazla 500 karakter olabilir")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Adres gereklidir"),
  privacyText: z.string().min(1, "Gizlilik metni gereklidir"),
  privacyPolicy: z.string().min(1, "Gizlilik politikası gereklidir"),
  contactFormText: z.string().min(1, "İletişim formu metni gereklidir"),
  cookiePolicy: z.string().min(1, "Çerez politikası gereklidir"),
  siteLogo: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Site logosu gereklidir",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateSettings();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      email: "",
      instagramUrl: "",
      linkedinUrl: "",
      address: "",
      privacyText: "",
      privacyPolicy: "",
      contactFormText: "",
      cookiePolicy: "",
      siteLogo: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = (onChange: (value: undefined) => void) => {
    onChange(undefined);
    setPreview(null);
    setFileName("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/settings");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Yeni Ayar
              </h1>
            </div>
            <p className="text-muted-foreground ml-13">
              Yeni bir site ayarı oluşturun
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Temel Bilgiler */}
          <Card className="border-2 border-border/50 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>Temel Bilgiler</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteLogo"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Site Logosu</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!preview ? (
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, onChange)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              {...field}
                            />
                            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                              <div className="flex flex-col items-center justify-center pt-8 pb-8">
                                <Upload className="w-12 h-12 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <p className="mb-2 text-sm font-semibold text-foreground">
                                  Logo seçmek için tıklayın
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, SVG veya GIF (Max. 10MB)
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative group">
                              <div className="flex items-center justify-center w-full h-48 rounded-lg border-2 border-border bg-muted/30 overflow-hidden">
                                <img
                                  src={preview}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="absolute top-4 right-4">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleClearFile(onChange)}
                                  className="opacity-90 hover:opacity-100"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {fileName || "Seçilen dosya"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Logo başarıyla seçildi
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        E-posta
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-1">
                          <Input 
                            type="email" 
                            placeholder="ornek@email.com" 
                            maxLength={255}
                            {...field} 
                          />
                          <p className="text-xs text-muted-foreground text-right">
                            {field.value?.length || 0} / 255 karakter
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefon Numarası
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-1">
                          <Input 
                            type="tel" 
                            placeholder="+90 555 123 45 67" 
                            maxLength={20}
                            {...field} 
                          />
                          <p className="text-xs text-muted-foreground text-right">
                            {field.value?.length || 0} / 20 karakter
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adres
                    </FormLabel>
                    <FormControl>
                      <TinyMCEEditor
                        value={field.value}
                        onChange={field.onChange}
                        height={200}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Sosyal Medya */}
          <Card className="border-2 border-border/50 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>Sosyal Medya</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram URL
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-1">
                        <Input 
                          type="url" 
                          placeholder="https://instagram.com/kullaniciadi" 
                          maxLength={500}
                          {...field} 
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {field.value?.length || 0} / 500 karakter
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn URL
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-1">
                        <Input 
                          type="url" 
                          placeholder="https://linkedin.com/company/sirket" 
                          maxLength={500}
                          {...field} 
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {field.value?.length || 0} / 500 karakter
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Metin İçerikleri */}
          <Card className="border-2 border-border/50 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Metin İçerikleri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="privacyText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gizlilik Metni</FormLabel>
                    <FormControl>
                      <TinyMCEEditor
                        value={field.value}
                        onChange={field.onChange}
                        maxWords={100000}
                        height={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacyPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Gizlilik Politikası
                    </FormLabel>
                    <FormControl>
                      <TinyMCEEditor
                        value={field.value}
                        onChange={field.onChange}
                        maxWords={100000}
                        height={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactFormText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İletişim Formu Metni</FormLabel>
                    <FormControl>
                      <TinyMCEEditor
                        value={field.value}
                        onChange={field.onChange}
                        maxWords={100000}
                        height={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cookiePolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Cookie className="h-4 w-4" />
                      Çerez Politikası
                    </FormLabel>
                    <FormControl>
                      <TinyMCEEditor
                        value={field.value}
                        onChange={field.onChange}
                        maxWords={100000}
                        height={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/settings")}
            >
              İptal
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
