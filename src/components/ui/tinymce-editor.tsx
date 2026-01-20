import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";

// TinyMCE CSS'lerini import et
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";

interface TinyMCEEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  disabled?: boolean;
  maxWords?: number;
}

export function TinyMCEEditor({
  value,
  onChange,
  height = 400,
  disabled = false,
  maxWords,
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);
  const [wordCount, setWordCount] = useState(0);

  // Kelime sayısını hesapla
  const countWords = (html: string): number => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html || "";
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  };

  useEffect(() => {
    setWordCount(countWords(value));
  }, [value]);

  const handleEditorChange = (content: string) => {
    if (maxWords) {
      const words = countWords(content);
      
      if (words > maxWords) {
        // Kelime sınırını aştıysa, eski içeriği koru
        return;
      }
      setWordCount(words);
    }
    onChange(content);
  };

  return (
    <div className="space-y-2">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          language: "tr",
          license_key: "gpl",
          promotion: false,
          branding: false,
          base_url: "/tinymce",
          suffix: ".min",
          wordcount_countregex: /[\w\u2019\'-]+/g,
          setup: (editor) => {
            if (maxWords) {
              editor.on("keydown", (e) => {
                const text = editor.getContent({ format: "text" });
                const words = text.trim().split(/\s+/).filter(word => word.length > 0);
                const wordCount = words.length;
                
                // Eğer sınır aşıldıysa ve yeni karakter ekleniyorsa, engelle
                if (wordCount >= maxWords) {
                  // Sadece seçili metin yoksa ve yeni karakter ekleniyorsa engelle
                  const selection = editor.selection.getContent({ format: "text" });
                  if (!selection && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    // Backspace, Delete, Arrow keys gibi tuşlara izin ver
                    if (!["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
                      e.preventDefault();
                      return false;
                    }
                  }
                }
              });
              
              // Paste event'ini de kontrol et
              editor.on("paste", (e) => {
                const text = editor.getContent({ format: "text" });
                const words = text.trim().split(/\s+/).filter(word => word.length > 0);
                const wordCount = words.length;
                
                if (wordCount >= maxWords) {
                  e.preventDefault();
                  return false;
                }
              });
            }
          },
        } as any}
      />
      {maxWords && (
        <div className={`text-xs text-right px-2 ${
          wordCount > maxWords 
            ? "text-destructive font-semibold" 
            : wordCount > maxWords * 0.9 
            ? "text-orange-500" 
            : "text-muted-foreground"
        }`}>
          {wordCount.toLocaleString("tr-TR")} / {maxWords.toLocaleString("tr-TR")} kelime
          {wordCount > maxWords && " (Sınır aşıldı!)"}
        </div>
      )}
    </div>
  );
}
