import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
}

export function DeleteModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Silmeyi Onayla",
  description = "Bu işlem geri alınamaz. Bu öğe kalıcı olarak silinecektir.",
  itemName,
  loading = false,
}: DeleteModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = itemName ? confirmText.trim() === itemName.trim() : false;

  useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/5">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1 space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-left">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-left text-muted-foreground">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {itemName && (
          <div className="mx-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Silinecek öğe:
                </p>
                <p className="text-sm font-semibold text-foreground break-words">
                  "{itemName}"
                </p>
              </div>
            </div>
          </div>
        )}

        {itemName && (
          <div className="mx-2 space-y-2">
            <Label htmlFor="confirm-delete" className="text-sm font-medium">
              Silmeyi onaylamak için öğe adını yazın:
            </Label>
            <Input
              id="confirm-delete"
              type="text"
              placeholder={itemName}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={loading}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter" && isConfirmed && !loading) {
                  onConfirm();
                }
              }}
            />
            {confirmText && !isConfirmed && (
              <p className="text-xs text-destructive">
                Öğe adı eşleşmiyor. Lütfen tam olarak "{itemName}" yazın.
              </p>
            )}
          </div>
        )}

        <div className="mx-2 rounded-lg border border-amber-200/50 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/30 p-3">
          <p className="text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>
              Lütfen bu işlemin geri alınamaz olduğunu unutmayın. Silmek istediğinizden emin misiniz?
            </span>
          </p>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel 
            disabled={loading}
            className="sm:mr-2"
            onClick={() => setConfirmText("")}
          >
            İptal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading || (itemName ? !isConfirmed : false)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Siliniyor...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Evet, Sil
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
