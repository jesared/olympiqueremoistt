"use client";

import { Input } from "~/components/ui/input";

type ImageUploadProps = {
  value: string;
  onUploaded: (url: string) => void;
};

export function ImageUpload({ value, onUploaded }: ImageUploadProps) {
  return (
    <div className="grid gap-2">
      <Input
        type="url"
        placeholder="https://..."
        value={value}
        onChange={(event) => onUploaded(event.target.value)}
      />
    </div>
  );
}
