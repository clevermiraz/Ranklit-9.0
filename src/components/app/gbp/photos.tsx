"use client";

/* eslint-disable @next/next/no-img-element -- library photos are data URLs held in the mock store */

import { useRef, useState, useTransition } from "react";
import clsx from "clsx";
import { ImagePlus, LoaderCircle, Send, Trash2, Upload } from "lucide-react";
import { addPhotoAction, deletePhotoAction } from "@/app/actions/gbp";
import { useAction, useToast } from "@/components/app/toast";
import { Badge, btn, Card, EmptyState, formatDate } from "@/components/app/ui";
import { ConfirmDialog } from "./modal";
import { fileToDataUrl } from "./image";
import type { GbpPhoto } from "./logic";

/** Downscales files in the browser and adds them to the library. Resolves with the added photos. */
export function useUpload() {
  const { push } = useToast();
  const [pending, start] = useTransition();
  const upload = (files: FileList | File[] | null, onDone?: (photos: GbpPhoto[]) => void) => {
    const list = Array.from(files ?? []);
    if (!list.length) return;
    start(async () => {
      const added: GbpPhoto[] = [];
      for (const file of list) {
        try {
          const src = await fileToDataUrl(file);
          const r = await addPhotoAction(file.name.replace(/\.[a-z0-9]+$/i, ""), src);
          if (r.error) push({ kind: "error", text: r.error });
          else if (r.photo) added.push(r.photo);
        } catch (e) {
          push({ kind: "error", text: e instanceof Error ? e.message : "Upload failed." });
        }
      }
      if (added.length) push({ kind: "ok", text: added.length === 1 ? `Added “${added[0].name}” to your library.` : `Added ${added.length} photos to your library.` });
      onDone?.(added);
    });
  };
  return { upload, uploading: pending };
}

export function PhotoLibrary({ photos, usage, onUse }: { photos: GbpPhoto[]; usage: Record<string, number>; onUse: (src: string) => void }) {
  const { upload, uploading } = useUpload();
  const { run, pending } = useAction();
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [toDelete, setToDelete] = useState<GbpPhoto | null>(null);

  return (
    <div className="space-y-4">
      <Card
        className={clsx("flex flex-wrap items-center gap-4 border-2 border-dashed transition-colors", drag ? "border-fuchsia-400 bg-fuchsia-50/50" : "border-[#e4dcef]")}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files);
        }}
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
          {uploading ? <LoaderCircle className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">Photo library</p>
          <p className="text-sm text-ink/60">Drop photos here or upload from your computer. Your agent rotates through these, never reusing a photo from the last 5 posts.</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => {
            upload(e.target.files);
            e.target.value = "";
          }} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={btn.fuchsia}>
          <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload photos"}
        </button>
      </Card>

      {photos.length === 0 ? (
        <Card>
          <EmptyState icon={ImagePlus} tone="fuchsia" title="No photos yet" text="Upload job photos, your storefront or your team. Posts with photos get more clicks." />
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <figure key={p.id} className="group overflow-hidden rounded-2xl border border-[#ece6f4] bg-white">
              <div className="relative aspect-[4/3] bg-[#f5f2f9]">
                <img src={p.src} alt={p.name} className="size-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {p.sample && <Badge tone="gray">Sample</Badge>}
                  {usage[p.src] ? <Badge tone="fuchsia">Used in {usage[p.src]}</Badge> : null}
                </div>
              </div>
              <figcaption className="flex items-center gap-1 p-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{p.name}</span>
                  <span className="block text-xs text-ink/45" suppressHydrationWarning>
                    Added {formatDate(p.addedAt)}
                  </span>
                </span>
                <button type="button" onClick={() => onUse(p.src)} className="grid size-8 place-items-center rounded-lg text-fuchsia-700 hover:bg-fuchsia-50" title="Use in a post" aria-label={`Use ${p.name} in a post`}>
                  <Send className="size-4" />
                </button>
                <button type="button" onClick={() => setToDelete(p)} className="grid size-8 place-items-center rounded-lg text-ink/45 hover:bg-red-50 hover:text-red-600" title="Delete" aria-label={`Delete ${p.name}`}>
                  <Trash2 className="size-4" />
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && run(() => deletePhotoAction(toDelete.id), () => setToDelete(null))}
        pending={pending}
        danger
        title="Delete this photo?"
        text={`“${toDelete?.name}” will be removed from your library. Posts that already use it keep their image.`}
        confirmLabel="Delete photo"
      />
    </div>
  );
}
