"use client";

import {
  Archive,
  Check,
  Copy,
  Download,
  FilePlus,
  Loader2,
  Share2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToolActionsBar } from "@/components/tools/ToolActionsBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  buildQrFileName,
  withQrFileVariant,
} from "@/features/qr-code-editor/lib/qr-filename";
import { encodeQrToUrlParam } from "@/features/qr-code-editor/lib/share-qr";
import { useQrCodeStore } from "@/features/qr-code-editor/store/qr-code.store";
import type { QrCodeDoc } from "@/features/qr-code-editor/types/qr-code.types";
import { SavedQrCodesList } from "@/features/saved-items/qr-codes/SavedQrCodesList";
import { useSavedQrCodesStore } from "@/features/saved-items/qr-codes/saved-qr-codes.store";
import { useAutoSave } from "@/hooks/useAutoSave";
import { trackEvent } from "@/lib/analytics";

export function QrCodeActions() {
  const doc = useQrCodeStore((s) => s.doc);
  const resetDoc = useQrCodeStore((s) => s.resetDoc);
  const download = useQrCodeStore((s) => s.download);
  const exportSettings = useQrCodeStore((s) => s.exportSettings);
  const setExportSettings = useQrCodeStore((s) => s.setExportSettings);
  const setErrors = useQrCodeStore((s) => s.setErrors);
  const clearErrors = useQrCodeStore((s) => s.clearErrors);

  const { saveItem } = useSavedQrCodesStore();
  const [savedOpen, setSavedOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const hasTrackedToolOpen = useRef(false);

  const handleAutoSave = useCallback(
    (q: QrCodeDoc) => {
      saveItem(q);
    },
    [saveItem],
  );

  const saveStatus = useAutoSave({
    value: doc,
    onSave: handleAutoSave,
    enabled: !!doc.id,
  });

  useEffect(() => {
    if (hasTrackedToolOpen.current) return;
    hasTrackedToolOpen.current = true;
    trackEvent("tool_opened", {
      tool: "qr_code_generator",
      qr_type: doc.type,
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }, [doc.type]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (doc.type === "raw" && !doc.rawText.trim())
      nextErrors.rawText = "Raw data is required.";
    if (doc.type === "url" && !doc.url.trim())
      nextErrors.url = "URL is required.";
    if (doc.type === "phone" && !doc.phoneNumber.trim())
      nextErrors.phoneNumber = "Phone number is required.";
    if (doc.type === "sms" && !doc.smsNumber.trim())
      nextErrors.smsNumber = "Phone number is required.";
    if (doc.type === "twitter" && !doc.twitterHandle.trim())
      nextErrors.twitterHandle = "Twitter handle is required.";
    if (doc.type === "tweet" && !doc.tweetText.trim() && !doc.tweetUrl.trim())
      nextErrors.tweetText = "Enter a tweet text or URL.";
    if (doc.type === "wifi") {
      if (!doc.wifiSsid.trim()) nextErrors.wifiSsid = "Wi‑Fi name is required.";
      if (doc.wifiEncryption !== "nopass" && !doc.wifiPassword.trim())
        nextErrors.wifiPassword = "Wi‑Fi password is required.";
    }
    if (doc.type === "email" && !doc.emailTo.trim())
      nextErrors.emailTo = "Recipient email is required.";
    if (doc.type === "event") {
      if (!doc.eventTitle.trim())
        nextErrors.eventTitle = "Event title is required.";
      if (!doc.eventStart.trim())
        nextErrors.eventStart = "Start time is required.";
      if (!doc.eventEnd.trim()) nextErrors.eventEnd = "End time is required.";
    }
    if (doc.type === "upi") {
      if (!doc.upiVpa.trim()) nextErrors.upiVpa = "UPI ID is required.";
      const amount = Number(doc.upiAmount);
      if (!Number.isFinite(amount) || amount <= 0)
        nextErrors.upiAmount = "Amount must be greater than 0.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.dispatchEvent(new CustomEvent("qr:showErrors"));
      return false;
    }
    clearErrors();
    return true;
  };

  const trackDownloadClick = (extension: string) => {
    trackEvent("download_clicked", {
      tool: "qr_code_generator",
      file_type: extension,
      qr_type: doc.type,
      size: exportSettings.size,
      color_space: exportSettings.colorSpace,
      show_action_details: doc.showActionDetails,
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  const handleDownload = async (extension: "png" | "jpeg" | "tiff" | "svg") => {
    if (!validate()) {
      trackEvent("download_failed", {
        tool: "qr_code_generator",
        file_type: extension,
        status: "validation_failed",
        error_type: "validation",
        qr_type: doc.type,
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
      return;
    }

    trackDownloadClick(extension);
    setExportSettings({ extension });
    setDownloadOpen(false);

    try {
      await download(
        withQrFileVariant(buildQrFileName(doc), exportSettings.colorSpace),
      );
      trackEvent("download_succeeded", {
        tool: "qr_code_generator",
        file_type: extension,
        qr_type: doc.type,
        size: exportSettings.size,
        color_space: exportSettings.colorSpace,
        show_action_details: doc.showActionDetails,
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
    } catch {
      trackEvent("download_failed", {
        tool: "qr_code_generator",
        file_type: extension,
        status: "generation_failed",
        error_type: "qr_export",
        qr_type: doc.type,
        size: exportSettings.size,
        color_space: exportSettings.colorSpace,
        show_action_details: doc.showActionDetails,
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
    }
  };

  useEffect(() => {
    const onPreviewDownload = () => {
      const ext = exportSettings.extension || "png";
      void handleDownload(ext);
    };
    window.addEventListener("tool:previewDownload", onPreviewDownload);
    return () =>
      window.removeEventListener("tool:previewDownload", onPreviewDownload);
  }, [exportSettings.extension, handleDownload]);

  const buildShareUrl = () => {
    const u = new URL(window.location.href);
    u.searchParams.delete("s");
    const encoded = encodeQrToUrlParam(doc);
    u.searchParams.set("s", encoded);
    u.hash = "";
    return u.toString();
  };

  const handleShare = async () => {
    const url = buildShareUrl();
    setShareUrl(url);
    setCopied(false);
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        const nav = navigator as Navigator & {
          share?: (data: ShareData) => Promise<void>;
        };
        if (typeof nav.share === "function") {
          await nav.share({ url, title: "QR code" });
        }
        return;
      } catch {}
    }
    setShareOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <ToolActionsBar>
      <ToolActionsBar.Left>
        <Sheet open={savedOpen} onOpenChange={setSavedOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4" />
                <span className="sm:hidden">Saved</span>
                <span className="hidden sm:inline">Saved QRs</span>
              </Button>
            }
          />
          <SheetContent
            side="left"
            className="w-[88vw] max-w-[540px] p-0 flex flex-col"
          >
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Last 50 QRs</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <SavedQrCodesList onSelect={() => setSavedOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </ToolActionsBar.Left>

      <ToolActionsBar.Middle>
        <div className="hidden md:flex text-sm text-muted-foreground items-center min-h-9 px-1">
          {saveStatus === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </>
          ) : null}
          {saveStatus === "saved" ? (
            <>
              <Check className="h-4 w-4 mr-1 text-green-500" />
              Saved
            </>
          ) : null}
        </div>

        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleShare}
          aria-label="Share QR"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </ToolActionsBar.Middle>
      <ToolActionsBar.Right>
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share QR</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input readOnly value={shareUrl} />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Close
              </DialogClose>
              <Button onClick={handleCopy} variant="default">
                {copied ? (
                  <Check className="h-4 w-4 sm:mr-2" />
                ) : (
                  <Copy className="h-4 w-4 sm:mr-2" />
                )}
                <span>{copied ? "Copied" : "Copy link"}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="secondary" size="sm" onClick={() => resetDoc()}>
          <FilePlus className="h-4 w-4" />
          <span>New</span>
        </Button>

        <DropdownMenu open={downloadOpen} onOpenChange={setDownloadOpen}>
          <DropdownMenuTrigger
            render={
              <Button variant="default" size="sm">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            }
          />
          <DropdownMenuContent className="w-[240px]" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Download Size</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={String(exportSettings.size)}
                onValueChange={(val) =>
                  setExportSettings({ size: Number.parseInt(val, 10) || 512 })
                }
              >
                <DropdownMenuRadioItem value="256">
                  Small (256 px)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="512">
                  Medium (512 px)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="768">
                  Large (768 px)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1024">
                  Extra Large (1024 px)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel>Color Space</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={exportSettings.colorSpace}
                onValueChange={(val) =>
                  setExportSettings({
                    colorSpace: val === "cmyk" ? "cmyk" : "rgb",
                  })
                }
              >
                <DropdownMenuRadioItem value="rgb">RGB</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="cmyk">
                  CMYK (SVG/TIFF)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel>Download Format</DropdownMenuLabel>
              <div className="px-1.5 py-1">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={exportSettings.colorSpace === "cmyk"}
                    onClick={() => void handleDownload("png")}
                  >
                    PNG
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => void handleDownload("jpeg")}
                  >
                    JPEG
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => void handleDownload("tiff")}
                  >
                    TIFF
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => void handleDownload("svg")}
                  >
                    SVG
                  </Button>
                </div>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolActionsBar.Right>
    </ToolActionsBar>
  );
}
