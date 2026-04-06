"use client";

"use client";

import {
  Calendar,
  IndianRupee,
  Link2,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  Text,
  Wifi,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { RequiredLabel } from "@/components/shared/RequiredLabel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQrCodeStore } from "@/features/qr-code-editor/store/qr-code.store";
import type {
  EventOutputFormat,
  QrCodeType,
  WifiEncryption,
} from "@/features/qr-code-editor/types/qr-code.types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="text-xs text-destructive mt-1">{message}</div>;
}

export function QrContentSection() {
  const doc = useQrCodeStore((s) => s.doc);
  const updateDoc = useQrCodeStore((s) => s.updateDoc);
  const errors = useQrCodeStore((s) => s.errors);
  const clearErrors = useQrCodeStore((s) => s.clearErrors);

  const types = [
    { value: "url", label: "URL", Icon: Link2 },
    { value: "upi", label: "UPI Payment", Icon: IndianRupee },
    { value: "wifi", label: "Wi‑Fi", Icon: Wifi },
    { value: "email", label: "Email", Icon: Mail },
    { value: "phone", label: "Phone", Icon: Phone },
    { value: "sms", label: "SMS", Icon: MessageSquare },
    { value: "twitter", label: "Twitter", Icon: Share2 },
    { value: "tweet", label: "Tweet", Icon: Share2 },
    { value: "event", label: "Event", Icon: Calendar },
    { value: "raw", label: "Raw Data", Icon: Text },
  ] as const satisfies ReadonlyArray<{
    value: QrCodeType;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }>;

  return (
    <div className="space-y-4">
      <Label className="text-base">Content</Label>

      <div className="space-y-2">
        <Label>QR Type</Label>
        <div className="flex flex-wrap gap-2">
          {types.map(({ value, label, Icon }) => {
            const selected = doc.type === value;
            return (
              <Button
                key={value}
                type="button"
                variant={selected ? "default" : "outline"}
                onClick={() => updateDoc({ type: value })}
                className="rounded-full"
              >
                <Icon className="h-4 w-4 mr-2" />
                <span>{label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {doc.type === "raw" ? (
        <div className="space-y-2">
          <RequiredLabel htmlFor="rawText">Raw Data</RequiredLabel>
          <Textarea
            id="rawText"
            value={doc.rawText}
            onChange={(e) => {
              clearErrors(["rawText"]);
              updateDoc({ rawText: e.target.value });
            }}
            rows={5}
            aria-invalid={!!errors.rawText}
          />
          <FieldError message={errors.rawText} />
        </div>
      ) : null}

      {doc.type === "url" ? (
        <div className="space-y-2">
          <RequiredLabel htmlFor="url">URL</RequiredLabel>
          <Input
            id="url"
            value={doc.url}
            onChange={(e) => {
              clearErrors(["url"]);
              updateDoc({ url: e.target.value });
            }}
            aria-invalid={!!errors.url}
          />
          <FieldError message={errors.url} />
        </div>
      ) : null}

      {doc.type === "upi" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="upiVpa">UPI ID</RequiredLabel>
            <Input
              id="upiVpa"
              value={doc.upiVpa}
              onChange={(e) => {
                clearErrors(["upiVpa"]);
                updateDoc({ upiVpa: e.target.value });
              }}
              aria-invalid={!!errors.upiVpa}
            />
            <FieldError message={errors.upiVpa} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upiPayeeName">Payee Name</Label>
            <Input
              id="upiPayeeName"
              value={doc.upiPayeeName}
              onChange={(e) => updateDoc({ upiPayeeName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="upiAmount">Amount (INR)</RequiredLabel>
            <Input
              id="upiAmount"
              inputMode="decimal"
              value={doc.upiAmount}
              onChange={(e) => {
                clearErrors(["upiAmount"]);
                updateDoc({ upiAmount: e.target.value });
              }}
              aria-invalid={!!errors.upiAmount}
            />
            <FieldError message={errors.upiAmount} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upiNote">Note</Label>
            <Input
              id="upiNote"
              value={doc.upiNote}
              onChange={(e) => updateDoc({ upiNote: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {doc.type === "phone" ? (
        <div className="space-y-2">
          <RequiredLabel htmlFor="phoneNumber">Phone Number</RequiredLabel>
          <Input
            id="phoneNumber"
            value={doc.phoneNumber}
            onChange={(e) => {
              clearErrors(["phoneNumber"]);
              updateDoc({ phoneNumber: e.target.value });
            }}
            aria-invalid={!!errors.phoneNumber}
          />
          <FieldError message={errors.phoneNumber} />
        </div>
      ) : null}

      {doc.type === "sms" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="smsNumber">Phone Number</RequiredLabel>
            <Input
              id="smsNumber"
              value={doc.smsNumber}
              onChange={(e) => {
                clearErrors(["smsNumber"]);
                updateDoc({ smsNumber: e.target.value });
              }}
              aria-invalid={!!errors.smsNumber}
            />
            <FieldError message={errors.smsNumber} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smsBody">Message</Label>
            <Textarea
              id="smsBody"
              value={doc.smsBody}
              onChange={(e) => updateDoc({ smsBody: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      ) : null}

      {doc.type === "twitter" ? (
        <div className="space-y-2">
          <RequiredLabel htmlFor="twitterHandle">Twitter Handle</RequiredLabel>
          <Input
            id="twitterHandle"
            value={doc.twitterHandle}
            onChange={(e) => {
              clearErrors(["twitterHandle"]);
              updateDoc({ twitterHandle: e.target.value });
            }}
            aria-invalid={!!errors.twitterHandle}
          />
          <FieldError message={errors.twitterHandle} />
        </div>
      ) : null}

      {doc.type === "tweet" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="tweetText">Tweet Text</Label>
            <Textarea
              id="tweetText"
              value={doc.tweetText}
              onChange={(e) => updateDoc({ tweetText: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tweetUrl">URL</Label>
            <Input
              id="tweetUrl"
              value={doc.tweetUrl}
              onChange={(e) => updateDoc({ tweetUrl: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {doc.type === "wifi" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="wifiSsid">Wi‑Fi Name</RequiredLabel>
            <Input
              id="wifiSsid"
              value={doc.wifiSsid}
              onChange={(e) => {
                clearErrors(["wifiSsid"]);
                updateDoc({ wifiSsid: e.target.value });
              }}
              aria-invalid={!!errors.wifiSsid}
            />
            <FieldError message={errors.wifiSsid} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wifiEncryption">Security</Label>
            <Select
              value={doc.wifiEncryption}
              onValueChange={(val) =>
                updateDoc({ wifiEncryption: val as WifiEncryption })
              }
            >
              <SelectTrigger id="wifiEncryption" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA / WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">No password</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {doc.wifiEncryption !== "nopass" ? (
            <div className="space-y-2">
              <RequiredLabel htmlFor="wifiPassword">
                Wi‑Fi Password
              </RequiredLabel>
              <Input
                id="wifiPassword"
                value={doc.wifiPassword}
                onChange={(e) => {
                  clearErrors(["wifiPassword"]);
                  updateDoc({ wifiPassword: e.target.value });
                }}
                aria-invalid={!!errors.wifiPassword}
              />
              <FieldError message={errors.wifiPassword} />
            </div>
          ) : null}
          <div className="flex items-center space-x-2">
            <Switch
              id="wifiHidden"
              checked={doc.wifiHidden}
              onCheckedChange={(c) => updateDoc({ wifiHidden: c })}
            />
            <Label htmlFor="wifiHidden">Hidden Network</Label>
          </div>
        </div>
      ) : null}

      {doc.type === "email" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="emailTo">To</RequiredLabel>
            <Input
              id="emailTo"
              value={doc.emailTo}
              onChange={(e) => {
                clearErrors(["emailTo"]);
                updateDoc({ emailTo: e.target.value });
              }}
              aria-invalid={!!errors.emailTo}
            />
            <FieldError message={errors.emailTo} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailSubject">Subject</Label>
            <Input
              id="emailSubject"
              value={doc.emailSubject}
              onChange={(e) => updateDoc({ emailSubject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailBody">Body</Label>
            <Textarea
              id="emailBody"
              value={doc.emailBody}
              onChange={(e) => updateDoc({ emailBody: e.target.value })}
              rows={5}
            />
          </div>
        </div>
      ) : null}

      {doc.type === "event" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventOutputFormat">Output Format</Label>
            {(() => {
              const options = [
                { label: "iCalendar (.ics)", value: "ical" },
                { label: "Google Calendar Link", value: "google" },
              ] as const satisfies ReadonlyArray<{
                label: string;
                value: EventOutputFormat;
              }>;
              const selected =
                options.find((o) => o.value === doc.eventOutputFormat)?.label ??
                options[0].label;
              return (
                <Select
                  value={selected}
                  onValueChange={(val) =>
                    updateDoc({
                      eventOutputFormat:
                        options.find((o) => o.label === val)?.value ?? "ical",
                    })
                  }
                >
                  <SelectTrigger id="eventOutputFormat" className="w-full">
                    <SelectValue />
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

          <div className="flex items-center space-x-2">
            <Switch
              id="eventAllDay"
              checked={doc.eventAllDay}
              onCheckedChange={(c) => updateDoc({ eventAllDay: c })}
            />
            <Label htmlFor="eventAllDay">All Day</Label>
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="eventTitle">Title</RequiredLabel>
            <Input
              id="eventTitle"
              value={doc.eventTitle}
              onChange={(e) => {
                clearErrors(["eventTitle"]);
                updateDoc({ eventTitle: e.target.value });
              }}
              aria-invalid={!!errors.eventTitle}
            />
            <FieldError message={errors.eventTitle} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventLocation">Location</Label>
            <Input
              id="eventLocation"
              value={doc.eventLocation}
              onChange={(e) => updateDoc({ eventLocation: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDescription">Description</Label>
            <Textarea
              id="eventDescription"
              value={doc.eventDescription}
              onChange={(e) =>
                updateDoc({ eventDescription: e.target.value })
              }
              rows={4}
            />
          </div>

          {doc.eventAllDay ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel htmlFor="eventStartDate">
                  Start Date
                </RequiredLabel>
                <Input
                  id="eventStartDate"
                  type="date"
                  value={doc.eventStart ? doc.eventStart.slice(0, 10) : ""}
                  onChange={(e) => {
                    clearErrors(["eventStart"]);
                    updateDoc({
                      eventStart: e.target.value ? `${e.target.value}T00:00` : "",
                    });
                  }}
                  aria-invalid={!!errors.eventStart}
                />
                <FieldError message={errors.eventStart} />
              </div>
              <div className="space-y-2">
                <RequiredLabel htmlFor="eventEndDate">End Date</RequiredLabel>
                <Input
                  id="eventEndDate"
                  type="date"
                  value={doc.eventEnd ? doc.eventEnd.slice(0, 10) : ""}
                  onChange={(e) => {
                    clearErrors(["eventEnd"]);
                    updateDoc({
                      eventEnd: e.target.value ? `${e.target.value}T00:00` : "",
                    });
                  }}
                  aria-invalid={!!errors.eventEnd}
                />
                <FieldError message={errors.eventEnd} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel htmlFor="eventStart">Start</RequiredLabel>
                <Input
                  id="eventStart"
                  type="datetime-local"
                  value={doc.eventStart}
                  onChange={(e) => {
                    clearErrors(["eventStart"]);
                    updateDoc({ eventStart: e.target.value });
                  }}
                  aria-invalid={!!errors.eventStart}
                />
                <FieldError message={errors.eventStart} />
              </div>
              <div className="space-y-2">
                <RequiredLabel htmlFor="eventEnd">End</RequiredLabel>
                <Input
                  id="eventEnd"
                  type="datetime-local"
                  value={doc.eventEnd}
                  onChange={(e) => {
                    clearErrors(["eventEnd"]);
                    updateDoc({ eventEnd: e.target.value });
                  }}
                  aria-invalid={!!errors.eventEnd}
                />
                <FieldError message={errors.eventEnd} />
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div className="pt-2 space-y-4">
        <Label className="text-base">Logo (Optional)</Label>
        <ImagePicker
          accept="image/*"
          value={doc.logoDataUrl}
          fileLabel="Upload logo"
          onChange={(next) => updateDoc({ logoDataUrl: next })}
        />

        {doc.logoDataUrl ? (
          <div className="space-y-2">
            <Label htmlFor="logoScale">Logo Size</Label>
            {(() => {
              const options = [
                { label: "Small (0.5×)", value: 0.2 },
                { label: "Medium (1×)", value: 0.3 },
                { label: "Large (1.5×)", value: 0.45 },
                { label: "Extra Large (2×)", value: 0.6 },
              ] as const;
              const selected =
                options.find((o) => o.value === doc.style.logoSize)?.label ??
                "Medium (1×)";
              return (
            <Select
              value={selected}
              onValueChange={(val) =>
                updateDoc({
                  style: {
                    logoSize:
                      options.find((o) => o.label === val)?.value ?? 0.3,
                  },
                })
              }
            >
              <SelectTrigger id="logoScale" className="w-full">
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
        ) : null}
      </div>
    </div>
  );
}
