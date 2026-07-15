"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

type FileDropzoneProps = {
  accept: string;
  hint: string;
  maxFiles: number;
  maxSizeMb: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
};

export function FileDropzone({
  accept,
  hint,
  maxFiles,
  maxSizeMb,
  files,
  onFilesChange,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSelect = (selected: FileList | null) => {
    if (!selected || selected.length === 0) {
      return;
    }

    const maxBytes = maxSizeMb * 1024 * 1024;
    const incoming = Array.from(selected);
    const tooLarge = incoming.find((file) => file.size > maxBytes);

    if (tooLarge) {
      setMessage(`"${tooLarge.name}" exceeds the ${maxSizeMb}MB limit.`);
      return;
    }

    const combined = [...files, ...incoming].slice(0, maxFiles);
    setMessage(null);
    onFilesChange(combined);
  };

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 px-4 py-6 text-center transition-colors hover:border-[#2B6CB0]/60 hover:bg-slate-50"
      >
        <UploadCloud className="size-6 text-slate-400" />
        <span className="text-sm text-slate-500">
          Drag &amp; drop or{" "}
          <span className="font-medium text-[#2B6CB0]">click to upload</span>
        </span>
        <span className="text-xs text-slate-400">{hint}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(event) => handleSelect(event.target.files)}
      />

      {message ? <p className="text-xs text-red-600">{message}</p> : null}

      {files.length > 0 ? (
        <ul className="space-y-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => handleRemove(index)}
                className="ml-2 shrink-0 text-slate-400 transition-colors hover:text-red-600"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
