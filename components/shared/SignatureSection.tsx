"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import SignaturePad from "signature_pad";
import { FilePicker } from "@/components/shared/FilePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type SignatureMode = "draw" | "type" | "upload";

export function SignatureSection({
  enabled,
  onEnabledChange,
  role,
  onRoleChange,
  mode,
  onModeChange,
  typed,
  onTypedChange,
  imageData,
  onImageDataChange,
}: {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  role: string;
  onRoleChange: (value: string) => void;
  mode: SignatureMode;
  onModeChange: (mode: SignatureMode) => void;
  typed: string;
  onTypedChange: (value: string) => void;
  imageData?: string;
  onImageDataChange: (value?: string) => void;
}) {
  const canvasWrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const padRef = React.useRef<SignaturePad | null>(null);
  const autoSaveTimeoutRef = React.useRef<number | null>(null);

  const resizeCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
    const existing = padRef.current;
    const signatureData =
      existing && !existing.isEmpty() ? existing.toData() : null;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = wrap.clientWidth;
    if (!width) return;
    const height = wrap.clientHeight || 200;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
    }
    if (existing) {
      existing.clear();
      if (signatureData) existing.fromData(signatureData);
    }
  }, []);

  React.useEffect(() => {
    if (!enabled || mode !== "draw") return;
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas) return;
    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255,255,255)",
      penColor: "rgb(17,24,39)",
      minWidth: 1,
      maxWidth: 2.5,
    });
    padRef.current = pad;
    const onEndStroke = () => {
      const p = padRef.current;
      if (!p || p.isEmpty()) return;
      if (autoSaveTimeoutRef.current)
        window.clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = window.setTimeout(() => {
        const next = padRef.current?.toDataURL("image/png");
        if (next) onImageDataChange(next);
      }, 150);
    };
    pad.addEventListener("endStroke", onEndStroke);

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        resizeCanvas();
      });
    });

    let ro: ResizeObserver | undefined;
    if (wrap && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(wrap);
    }
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
      if (autoSaveTimeoutRef.current)
        window.clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
      padRef.current?.removeEventListener("endStroke", onEndStroke);
      padRef.current?.off();
      padRef.current = null;
    };
  }, [enabled, resizeCanvas, mode, onImageDataChange]);

  const clearDraw = () => {
    padRef.current?.clear();
    onImageDataChange(undefined);
  };

  const handleSignatureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageDataChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border p-4 rounded-lg">
        <div className="space-y-0.5">
          <Label className="text-base">Show Signature</Label>
          <div className="text-sm text-muted-foreground">
            Include a signature block at the bottom of the document
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Signatory Role / Designation</Label>
            <Input
              placeholder="Owner / Manager / Authorized Signatory"
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={mode === "draw" ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange("draw")}
              type="button"
            >
              Draw
            </Button>
            <Button
              variant={mode === "type" ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange("type")}
              type="button"
            >
              Type
            </Button>
            <Button
              variant={mode === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange("upload")}
              type="button"
            >
              Upload
            </Button>
          </div>

          {mode === "draw" ? (
            <div className="space-y-2">
              <Label>Draw Signature</Label>
              <div
                ref={canvasWrapRef}
                className="h-[200px] rounded-lg border bg-white overflow-hidden md:h-[220px]"
              >
                <canvas ref={canvasRef} className="w-full h-full touch-none" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Auto-saves after each stroke.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDraw}
                  type="button"
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : null}

          {mode === "type" ? (
            <div className="space-y-2">
              <Label>Type Signature</Label>
              <Input
                placeholder="Your signature"
                value={typed}
                onChange={(e) => onTypedChange(e.target.value)}
              />
              <div className="border rounded-lg bg-muted/10 p-3 h-[140px] flex items-center justify-center">
                <div className="font-serif italic text-3xl text-foreground/80 truncate max-w-full">
                  {typed || "Your Signature"}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  type="button"
                  onClick={() => onModeChange("type")}
                  disabled={!typed}
                >
                  Use Typed
                </Button>
              </div>
            </div>
          ) : null}

          {mode === "upload" ? (
            <div className="space-y-2">
              <Label>Upload Signature</Label>
              <FilePicker
                accept="image/png, image/jpeg, image/jpg"
                onFile={(file) => {
                  handleSignatureUpload(file);
                  onModeChange("upload");
                }}
                fileLabel={imageData ? "Image selected" : "No file chosen"}
              />
              {imageData ? (
                <div className="border rounded-lg p-3 bg-muted/20">
                  <div className="text-xs text-muted-foreground mb-2">
                    Selected image
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative h-12 w-32 bg-white rounded-md p-1 border overflow-hidden">
                      <Image
                        src={imageData}
                        alt="Signature"
                        fill
                        className="object-contain"
                        sizes="128px"
                        unoptimized
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onImageDataChange(undefined)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
