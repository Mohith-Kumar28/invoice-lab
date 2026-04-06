"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPickerField } from "@/features/qr-code-editor/components/ColorPickerField";
import { useQrCodeStore } from "@/features/qr-code-editor/store/qr-code.store";
import type {
  QrCornersDotType,
  QrCornersSquareType,
  QrDotsType,
  QrShape,
} from "@/features/qr-code-editor/types/qr-code.types";

export function QrStyleSection() {
  const doc = useQrCodeStore((s) => s.doc);
  const updateDoc = useQrCodeStore((s) => s.updateDoc);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">Basic</Label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="qrPreviewSize">Preview Size</Label>
            {(() => {
              const options = [
                { label: "Small", value: 256 },
                { label: "Medium", value: 320 },
                { label: "Large", value: 384 },
              ] as const;
              const selected =
                options.find((o) => o.value === doc.style.size)?.label ?? "Medium";
              return (
            <Select
              value={selected}
              onValueChange={(val) =>
                updateDoc({
                  style: { size: options.find((o) => o.label === val)?.value ?? 320 },
                })
              }
            >
              <SelectTrigger id="qrPreviewSize" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.label} value={o.label}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              );
            })()}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qrMargin">Border Spacing</Label>
            {(() => {
              const options = [
                { label: "Tight", value: 0 },
                { label: "Normal", value: 8 },
                { label: "Spacious", value: 16 },
              ] as const;
              const selected =
                options.find((o) => o.value === doc.style.margin)?.label ?? "Normal";
              return (
            <Select
              value={selected}
              onValueChange={(val) =>
                updateDoc({
                  style: {
                    margin: options.find((o) => o.label === val)?.value ?? 8,
                  },
                })
              }
            >
              <SelectTrigger id="qrMargin" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.label} value={o.label}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              );
            })()}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qrShape">Shape</Label>
          <Select
            value={doc.style.shape}
            onValueChange={(val) =>
              updateDoc({ style: { shape: val as QrShape } })
            }
          >
            <SelectTrigger id="qrShape" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPickerField
            id="dotsColor"
            label="Dots Color"
            value={doc.style.dotsColor}
            onChange={(v) => updateDoc({ style: { dotsColor: v } })}
          />
          <ColorPickerField
            id="backgroundColor"
            label="Background Color"
            value={doc.style.backgroundColor}
            onChange={(v) => updateDoc({ style: { backgroundColor: v } })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Patterns</Label>

        <div className="space-y-2">
          <Label htmlFor="dotsType">Dots Style</Label>
          <Select
            value={doc.style.dotsType}
            onValueChange={(val) =>
              updateDoc({ style: { dotsType: val as QrDotsType } })
            }
          >
            <SelectTrigger id="dotsType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="dots">Dots</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
              <SelectItem value="classy">Classy</SelectItem>
              <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cornerSquareType">Corner Square Style</Label>
            <Select
              value={doc.style.cornersSquareType}
              onValueChange={(val) =>
                updateDoc({
                  style: { cornersSquareType: val as QrCornersSquareType },
                })
              }
            >
              <SelectTrigger id="cornerSquareType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dot">Dot</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="classy">Classy</SelectItem>
                <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cornerDotType">Corner Dot Style</Label>
            <Select
              value={doc.style.cornersDotType}
              onValueChange={(val) =>
                updateDoc({
                  style: { cornersDotType: val as QrCornersDotType },
                })
              }
            >
              <SelectTrigger id="cornerDotType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dot">Dot</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="classy">Classy</SelectItem>
                <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPickerField
            id="cornersSquareColor"
            label="Corner Square Color"
            value={doc.style.cornersSquareColor}
            onChange={(v) => updateDoc({ style: { cornersSquareColor: v } })}
          />
          <ColorPickerField
            id="cornersDotColor"
            label="Corner Dot Color"
            value={doc.style.cornersDotColor}
            onChange={(v) => updateDoc({ style: { cornersDotColor: v } })}
          />
        </div>
      </div>
    </div>
  );
}
