import { useNavigate } from "react-router-dom";
import { useCreateFaq } from "@/hooks/use-faqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import { ArrowLeft, Save, HelpCircle } from "lucide-react";
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
  question: z.string()
    .min(1, "Soru gereklidir")
    .max(500, "Soru en fazla 500 karakter olabilir"),
  answer: z.string().min(1, "Cevap gereklidir"),
  orderIndex: z.union([
    z.string().transform((val) => val === "" ? 0 : parseInt(val, 10) || 0),
    z.number()
  ]).refine((val) => val >= 0, "Sıra numarası 0 veya daha büyük olmalıdır"),
});

type FormValues = z.infer<typeof formSchema>;

export default function FaqCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateFaq();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      orderIndex: 0,
    },
  });

  const onSubmit = (values: FormValues) => {
    // orderIndex'i number'a çevir
    const orderIndex = typeof values.orderIndex === "string" 
      ? (values.orderIndex === "" ? 0 : parseInt(values.orderIndex, 10) || 0)
      : values.orderIndex;
    
    createMutation.mutate({ ...values, orderIndex }, {
      onSuccess: () => {
        navigate("/faq");
      },
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/faq")}
          className="self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4 text-primary dark:text-blue-400" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Yeni Soru</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Yeni bir sıkça sorulan soru oluşturun
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary dark:text-blue-400" />
                <CardTitle>Soru Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soru</FormLabel>
                    <FormControl>
                      <div className="space-y-1">
                        <Input 
                          placeholder="Soruyu giriniz" 
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
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cevap</FormLabel>
                    <FormControl>
                      <TinyMCEEditor
                        value={field.value}
                        onChange={field.onChange}
                        maxWords={100000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sıra Numarası</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0"
                        className="max-w-[150px]"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Sadece rakam ve boş string'e izin ver
                          if (value === "" || /^\d+$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                        value={field.value === undefined || field.value === null ? "" : String(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Soruların görüntülenme sırasını belirler
                    </p>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/faq")}
              className="w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2 text-white" />
              {createMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
