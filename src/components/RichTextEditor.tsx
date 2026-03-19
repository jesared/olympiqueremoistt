"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Heading1, Heading2, Italic, Link2, List } from "lucide-react";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

type ToolbarState = {
  bold: boolean;
  italic: boolean;
  h1: boolean;
  h2: boolean;
  list: boolean;
  link: boolean;
};

const INITIAL_STATE: ToolbarState = {
  bold: false,
  italic: false,
  h1: false,
  h2: false,
  list: false,
  link: false,
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbarState, setToolbarState] = useState<ToolbarState>(INITIAL_STATE);

  const refreshToolbarState = () => {
    const selection = window.getSelection();
    let hasLink = false;

    if (selection?.anchorNode) {
      const element =
        selection.anchorNode instanceof Element
          ? selection.anchorNode
          : selection.anchorNode.parentElement;

      hasLink = Boolean(element?.closest("a"));
    }

    setToolbarState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      h1: document.queryCommandValue("formatBlock") === "h1",
      h2: document.queryCommandValue("formatBlock") === "h2",
      list: document.queryCommandState("insertUnorderedList"),
      link: hasLink,
    });
  };

  useEffect(() => {
    const element = editorRef.current;

    if (!element) return;

    if (element.innerHTML !== value) {
      element.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    const handleSelectionChange = () => refreshToolbarState();

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? "");
    refreshToolbarState();
  };

  const handleLink = () => {
    if (toolbarState.link) {
      runCommand("unlink");
      return;
    }

    const url = window.prompt("URL du lien", "https://");

    if (!url) return;

    runCommand("createLink", url.trim());
  };

  return (
    <div className={cn("rounded-md", className)}>
      <div className="border-input bg-muted/50 flex flex-wrap gap-2 rounded-t-md border p-2">
        <Button
          type="button"
          size="sm"
          variant={toolbarState.bold ? "default" : "outline"}
          className="gap-1"
          onClick={() => runCommand("bold")}
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
          Gras
        </Button>

        <Button
          type="button"
          size="sm"
          variant={toolbarState.italic ? "default" : "outline"}
          className="gap-1"
          onClick={() => runCommand("italic")}
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
          Italique
        </Button>

        <Button
          type="button"
          size="sm"
          variant={toolbarState.h1 ? "default" : "outline"}
          className="gap-1"
          onClick={() => runCommand("formatBlock", "h1")}
        >
          <Heading1 className="h-4 w-4" aria-hidden="true" />
          Titre 1
        </Button>

        <Button
          type="button"
          size="sm"
          variant={toolbarState.h2 ? "default" : "outline"}
          className="gap-1"
          onClick={() => runCommand("formatBlock", "h2")}
        >
          <Heading2 className="h-4 w-4" aria-hidden="true" />
          Titre 2
        </Button>

        <Button
          type="button"
          size="sm"
          variant={toolbarState.list ? "default" : "outline"}
          className="gap-1"
          onClick={() => runCommand("insertUnorderedList")}
        >
          <List className="h-4 w-4" aria-hidden="true" />
          Liste
        </Button>

        <Button
          type="button"
          size="sm"
          variant={toolbarState.link ? "default" : "outline"}
          className="gap-1"
          onClick={handleLink}
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
          Lien
        </Button>
      </div>

      <div
        ref={editorRef}
        id="content-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        className="prose prose-zinc dark:prose-invert border-input bg-background min-h-48 max-w-none rounded-b-md border border-t-0 px-3 py-2 text-sm focus-visible:outline-none"
        data-placeholder={placeholder ?? "Écrivez votre contenu..."}
      />
    </div>
  );
}
