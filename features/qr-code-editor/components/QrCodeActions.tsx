"use client";

import { Archive, Check, Download, FilePlus, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buildQrFileName, withQrFileVariant } from "@/features/qr-code-editor/lib/qr-filename";
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

  return (
    <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border/40 p-3 sm:p-4 flex items-center shadow-sm overflow-x-auto gap-2 no-scrollbar shrink-0">
      <Sheet open={savedOpen} onOpenChange={setSavedOpen}>
        <SheetTrigger
          render={
            <Button variant="outline">
              <Archive className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Saved QRs</span>
            </Button>
          }
        />
        <SheetContent
          side="left"
          className="w-[400px] sm:w-[540px] p-0 flex flex-col"
        >
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Last 50 QRs</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <SavedQrCodesList onSelect={() => setSavedOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 ml-auto pl-2 shrink-0">
        <div className="text-sm text-muted-foreground mr-2 flex items-center">
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

        <Button variant="secondary" onClick={() => resetDoc()}>
          <FilePlus className="h-4 w-4 sm:mr-2" />
          <span>New</span>
        </Button>

        <DropdownMenu open={downloadOpen} onOpenChange={setDownloadOpen}>
          <DropdownMenuTrigger
            render={
              <Button variant="default">
                <Download className="h-4 w-4 sm:mr-2" />
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
                    onClick={() => {
                      if (!validate()) return;
                      trackDownloadClick("png");
                      setExportSettings({ extension: "png" });
                      setDownloadOpen(false);
                      download(
                        withQrFileVariant(
                          buildQrFileName(doc),
                          exportSettings.colorSpace,
                        ),
                      );
                    }}
                  >
                    PNG
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (!validate()) return;
                      trackDownloadClick("jpeg");
                      setExportSettings({ extension: "jpeg" });
                      setDownloadOpen(false);
                      download(
                        withQrFileVariant(
                          buildQrFileName(doc),
                          exportSettings.colorSpace,
                        ),
                      );
                    }}
                  >
                    JPEG
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (!validate()) return;
                      trackDownloadClick("tiff");
                      setExportSettings({ extension: "tiff" });
                      setDownloadOpen(false);
                      download(
                        withQrFileVariant(
                          buildQrFileName(doc),
                          exportSettings.colorSpace,
                        ),
                      );
                    }}
                  >
                    TIFF
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (!validate()) return;
                      trackDownloadClick("svg");
                      setExportSettings({ extension: "svg" });
                      setDownloadOpen(false);
                      download(
                        withQrFileVariant(
                          buildQrFileName(doc),
                          exportSettings.colorSpace,
                        ),
                      );
                    }}
                  >
                    SVG
                  </Button>
                </div>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
