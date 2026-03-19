"use client";

import { useState } from "react";

import RichTextEditor from "~/components/RichTextEditor";

export function PostCreateFormContentField() {
  const [content, setContent] = useState("");

  return (
    <div className="grid gap-2">
      <label htmlFor="content-editor" className="text-sm font-medium">
        Contenu
      </label>
      <input type="hidden" name="content" value={content} required />
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Rédigez votre actualité..."
        className="w-full"
      />
    </div>
  );
}
