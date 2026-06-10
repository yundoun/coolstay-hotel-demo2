"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  label?: string;
}

export function ImageUploadZone({ images, onChange, max = 5, label = "이미지" }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newUrls: string[] = [];
    const remaining = max - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    for (const file of toUpload) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        newUrls.push(url);
      }
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  }, [images, onChange, max]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="text-sm font-medium text-neutral-700 mb-2">{label} (최대 {max}장)</p>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((src, i) => (
            <div key={i} className="relative w-24 h-24 rounded overflow-hidden border border-neutral-200 group">
              <Image src={src} alt={`${i + 1}`} fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < max && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.accept = "image/*";
            input.onchange = () => handleFiles(input.files);
            input.click();
          }}
        >
          <Upload className="w-6 h-6 mx-auto text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-500">
            {uploading ? "업로드 중..." : "클릭 또는 드래그하여 이미지 추가"}
          </p>
        </div>
      )}
    </div>
  );
}
