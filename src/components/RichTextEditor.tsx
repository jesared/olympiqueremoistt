"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading1, Heading2, Italic, List } from "lucide-react";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc dark:prose-invert min-h-48 max-w-none px-3 py-2 text-sm focus-visible:outline-none",
        "data-placeholder": placeholder ?? "Écrivez votre contenu...",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();

    if (value !== currentHtml) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  const runCommand = (command: () => void) => {
    if (!editor) return;

    command();
    onChange(editor.getHTML());
  };

  return (
    <div className={cn("rounded-md", className)}>
      <div className="border-input bg-muted/50 flex flex-wrap gap-2 rounded-t-md border p-2">
        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("bold") ? "default" : "outline"}
          className="gap-1"
          onClick={() =>
            runCommand(() => {
              editor?.chain().focus().toggleBold().run();
            })
          }
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
          Gras
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("italic") ? "default" : "outline"}
          className="gap-1"
          onClick={() =>
            runCommand(() => {
              editor?.chain().focus().toggleItalic().run();
            })
          }
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
          Italique
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("heading", { level: 1 }) ? "default" : "outline"}
          className="gap-1"
          onClick={() =>
            runCommand(() => {
              editor?.chain().focus().toggleHeading({ level: 1 }).run();
            })
          }
        >
          <Heading1 className="h-4 w-4" aria-hidden="true" />
          Titre 1
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("heading", { level: 2 }) ? "default" : "outline"}
          className="gap-1"
          onClick={() =>
            runCommand(() => {
              editor?.chain().focus().toggleHeading({ level: 2 }).run();
            })
          }
        >
          <Heading2 className="h-4 w-4" aria-hidden="true" />
          Titre 2
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("bulletList") ? "default" : "outline"}
          className="gap-1"
          onClick={() =>
            runCommand(() => {
              editor?.chain().focus().toggleBulletList().run();
            })
          }
        >
          <List className="h-4 w-4" aria-hidden="true" />
          Liste
        </Button>
      </div>

      <div className="border-input bg-background rounded-b-md border border-t-0">
        <EditorContent editor={editor} id="content-editor" />
      </div>
    </div>
  );
}
