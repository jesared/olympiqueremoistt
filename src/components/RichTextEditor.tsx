"use client";

import { useEffect, useMemo, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $isListNode,
  ListItemNode,
  ListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { Bold, Heading1, Heading2, Italic, List } from "lucide-react";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";

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

  const toggleBulletList = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const top = anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(top)) {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      }
    });
  };

  return (
    <div className="border-input bg-muted/50 flex flex-wrap gap-2 rounded-t-md border p-2">
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
        onClick={toggleBulletList}
      >
        <List className="h-4 w-4" aria-hidden="true" />
        Liste
      </Button>
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
      nodes: [HeadingNode, ListNode, ListItemNode],
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
                className={cn(
                  "lexical prose prose-zinc dark:prose-invert min-h-48 max-w-none px-3 py-2 text-sm focus-visible:outline-none",
                )}
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
          <OnChangePlugin
            onChange={(editorState, editor) => {
              editorState.read(() => {
                const html = $generateHtmlFromNodes(editor, null);
                if (html === lastEmittedHtmlRef.current) return;
                lastEmittedHtmlRef.current = html;
                onChange(html);
              });
            }}
          />
          <LexicalHtmlSyncPlugin html={value} placeholderText={placeholderText} />
        </div>
      </div>
    </LexicalComposer>
  );
}
