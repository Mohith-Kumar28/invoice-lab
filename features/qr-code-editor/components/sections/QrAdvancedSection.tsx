"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useQrCodeStore } from "@/features/qr-code-editor/store/qr-code.store";
import type { QrErrorCorrectionLevel } from "@/features/qr-code-editor/types/qr-code.types";

export function QrAdvancedSection() {
  const doc = useQrCodeStore((s) => s.doc);
  const updateDoc = useQrCodeStore((s) => s.updateDoc);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">QR Settings</Label>

        <div className="space-y-2">
          <Label htmlFor="qrEcc">Error Correction Level</Label>
          {(() => {
            const options = [
              { label: "Low (7%)", value: "L" },
              { label: "Medium (15%)", value: "M" },
              { label: "High (25%)", value: "Q" },
              { label: "Maximum (30%)", value: "H" },
            ] as const;
            const selected =
              options.find((o) => o.value === doc.style.errorCorrectionLevel)
                ?.label ?? "High (25%)";
            return (
          <Select
            value={selected}
            onValueChange={(val) =>
              updateDoc({
                style: {
                  errorCorrectionLevel:
                    (options.find((o) => o.label === val)?.value ??
                      "Q") as QrErrorCorrectionLevel,
                },
              })
            }
          >
            <SelectTrigger id="qrEcc" className="w-full">
              <SelectValue placeholder="Choose error correction level" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.label}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            );
          })()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base" htmlFor="showActionDetails">
            Show QR Action Details
          </Label>
          <Switch
            id="showActionDetails"
            checked={doc.showActionDetails}
            onCheckedChange={(c) => updateDoc({ showActionDetails: c })}
          />
        </div>

        {doc.showActionDetails ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="captionTitle">Title</Label>
              <Input
                id="captionTitle"
                value={doc.captionTitle}
                onChange={(e) => updateDoc({ captionTitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="captionDescription">Description</Label>
              <Textarea
                id="captionDescription"
                value={doc.captionDescription}
                onChange={(e) => updateDoc({ captionDescription: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
