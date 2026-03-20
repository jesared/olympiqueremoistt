"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  KEY_ENTER_COMMAND,
} from "lexical";
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  ListItemNode,
  ListNode,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { Bold, Heading1, Heading2, Italic, Link2, List } from "lucide-react";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();

  const applyHeading = (level: 1 | 2) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $setBlocksType(selection, () => $createHeadingNode(`h${level}`));
    });
  };

  const setParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  const getSelectedLinkUrl = () => {
    let selectedUrl: string | null = null;

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const node = selection.anchor.getNode();
      const parent = node.getParent();

      if ($isLinkNode(node)) {
        selectedUrl = node.getURL();
        return;
      }

      if (parent && $isLinkNode(parent)) {
        selectedUrl = parent.getURL();
      }
    });

    return selectedUrl;
  };

  const LinkPopover = () => {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!open) return;

      setUrl(getSelectedLinkUrl() ?? "");
      inputRef.current?.focus();
    }, [open]);

    const handleAddLink = () => {
      if (!url) return;

      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      setUrl("");
      setOpen(false);
    };

    const handleRemoveLink = () => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      setUrl("");
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" size="sm" variant="outline" className="gap-1">
            <Link2 className="h-4 w-4" aria-hidden="true" />
            Lien
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 space-y-2">
          <input
            ref={inputRef}
            className="w-full rounded-md border px-2 py-1 text-sm"
            placeholder="https://..."
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />

          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleAddLink}>
              Valider
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleRemoveLink}
            >
              Supprimer lien
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="border-input bg-muted/50 flex flex-wrap gap-2 rounded-t-md border p-2">
      <Button type="button" size="sm" variant="outline" onClick={setParagraph}>
        Paragraphe
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold className="h-4 w-4" aria-hidden="true" />
        Gras
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic className="h-4 w-4" aria-hidden="true" />
        Italique
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() => applyHeading(1)}
      >
        <Heading1 className="h-4 w-4" aria-hidden="true" />
        Titre 1
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() => applyHeading(2)}
      >
        <Heading2 className="h-4 w-4" aria-hidden="true" />
        Titre 2
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        <List className="h-4 w-4" aria-hidden="true" />
        Liste
      </Button>

      <LinkPopover />
    </div>
  );
}

function LexicalHtmlSyncPlugin({
  html,
  placeholderText,
}: {
  html: string;
  placeholderText: string;
}) {
  const [editor] = useLexicalComposerContext();
  const lastAppliedRef = useRef<string>("");

  useEffect(() => {
    const next = html || "<p></p>";
    if (next === lastAppliedRef.current) return;

    lastAppliedRef.current = next;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(next, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
      root.selectEnd();
    });
  }, [editor, html, placeholderText]);

  return null;
}

function EnterKeyFixPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent | null) => {
        let handled = false;

        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const anchorNode = selection.anchor.getNode();
          const topLevel = anchorNode.getTopLevelElementOrThrow();

          if (topLevel.getType() !== "heading") return;

          event?.preventDefault();
          const paragraph = $createParagraphNode();
          topLevel.insertAfter(paragraph);
          paragraph.select();
          handled = true;
        });

        return handled;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return null;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const placeholderText = placeholder ?? "Écrivez votre contenu...";
  const initialHtml = value || "<p></p>";
  const lastEmittedHtmlRef = useRef<string>(initialHtml);

  const initialConfig = useMemo(
    () => ({
      namespace: "RichTextEditor",
      nodes: [HeadingNode, ListNode, ListItemNode, LinkNode],
      onError(error: Error) {
        console.error(error);
      },
      theme: {
        text: {
          bold: "font-semibold",
          italic: "italic",
        },
      },
      editable: true,
    }),
    [],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={cn("rounded-md", className)}>
        <LexicalToolbar />
        <div className="border-input bg-background relative rounded-b-md border border-t-0">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                id="content-editor"
                className="lexical min-h-48 px-3 py-2 text-sm focus-visible:outline-none"
                aria-label={placeholderText}
              />
            }
            placeholder={
              <div className="text-muted-foreground pointer-events-none absolute mt-2 px-3 text-sm">
                {placeholderText}
              </div>
            }
            ErrorBoundary={() => null}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <EnterKeyFixPlugin />
          <OnChangePlugin
            onChange={(editorState, editor) => {
              editorState.read(() => {
                const html = $generateHtmlFromNodes(editor, null);
                if (html === lastEmittedHtmlRef.current) return;
                lastEmittedHtmlRef.current = html;
                if (process.env.NODE_ENV !== "production") {
                  console.log("[RichTextEditor] Generated HTML:", html, {
                    hasH1: html.includes("<h1"),
                    hasH2: html.includes("<h2"),
                    hasUl: html.includes("<ul"),
                    hasLi: html.includes("<li"),
                  });
                }
                onChange(html);
              });
            }}
          />
          <LexicalHtmlSyncPlugin
            html={value}
            placeholderText={placeholderText}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
