import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  QrCodeDoc,
  QrCodeStyle,
  QrCodeType,
} from "@/features/qr-code-editor/types/qr-code.types";
import { SITE_URL } from "@/lib/site";

type QrCodeUpdate = Partial<Omit<QrCodeDoc, "style">> & {
  style?: Partial<QrCodeStyle>;
};

type QrDownloadExtension = "png" | "svg" | "jpeg" | "webp" | "tiff";

type QrColorSpace = "rgb" | "cmyk";

type DownloadApi = {
  download: (args: {
    extension: QrDownloadExtension;
    size: number;
    colorSpace: QrColorSpace;
    name?: string;
  }) => Promise<void>;
};

type ExportSettings = {
  extension: QrDownloadExtension;
  size: number;
  colorSpace: QrColorSpace;
};

interface QrCodeState {
  doc: QrCodeDoc;
  exportSettings: ExportSettings;
  errors: Record<string, string>;
  setDoc: (doc: QrCodeDoc) => void;
  updateDoc: (updates: QrCodeUpdate) => void;
  resetDoc: () => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: (keys?: string[]) => void;
  setExportSettings: (updates: Partial<ExportSettings>) => void;
  registerDownloadApi: (api?: DownloadApi) => void;
  download: (fileName?: string) => Promise<void>;
}

function createDefaultStyle(): QrCodeStyle {
  return {
    size: 320,
    margin: 8,
    renderType: "svg",
    shape: "square",
    errorCorrectionLevel: "Q",
    dotsType: "square",
    dotsColor: "#000000",
    backgroundColor: "#ffffff",
    cornersSquareType: "square",
    cornersSquareColor: "#000000",
    cornersDotType: "square",
    cornersDotColor: "#000000",
    logoSize: 0.45,
    logoMargin: 8,
    hideBackgroundDots: true,
  };
}

function createDefaultDoc(overrides?: Partial<QrCodeDoc>): QrCodeDoc {
  const now = new Date();
  const base: QrCodeDoc = {
    id: crypto.randomUUID(),
    type: "url",
    rawText: "",
    url: SITE_URL,
    phoneNumber: "",
    smsNumber: "",
    smsBody: "",
    twitterHandle: "",
    tweetText: "",
    tweetUrl: "",
    wifiSsid: "",
    wifiPassword: "",
    wifiEncryption: "WPA",
    wifiHidden: false,
    emailTo: "",
    emailSubject: "",
    emailBody: "",
    eventTitle: "",
    eventLocation: "",
    eventDescription: "",
    eventStart: "",
    eventEnd: "",
    eventAllDay: false,
    eventOutputFormat: "ical",
    upiVpa: "",
    upiPayeeName: "",
    upiAmount: "",
    upiNote: "",
    logoDataUrl: undefined,
    captionTitle: "",
    captionDescription: "",
    showActionDetails: false,
    style: createDefaultStyle(),
    createdAt: now,
    updatedAt: now,
  };
  return {
    ...base,
    ...overrides,
    style: { ...base.style, ...overrides?.style },
  };
}

function normalizeDoc(doc: QrCodeDoc): QrCodeDoc {
  const type: QrCodeType = doc.type || "url";
  const createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();
  const updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : createdAt;
  const allowedLogoSizes = [0.2, 0.3, 0.45, 0.6];
  const normalizedLogoSize =
    allowedLogoSizes.find((s) => s === doc.style?.logoSize) ?? 0.45;
  return {
    ...doc,
    id: doc.id || crypto.randomUUID(),
    type,
    url: doc.url || SITE_URL,
    captionTitle: doc.captionTitle || "",
    captionDescription: doc.captionDescription || "",
    showActionDetails:
      (doc as unknown as { showActionDetails?: boolean }).showActionDetails ??
      (doc as unknown as { showDetails?: boolean }).showDetails ??
      false,
    upiVpa: (doc as unknown as { upiVpa?: string }).upiVpa || "",
    upiPayeeName:
      (doc as unknown as { upiPayeeName?: string }).upiPayeeName || "",
    upiAmount: (doc as unknown as { upiAmount?: string }).upiAmount || "",
    upiNote: (doc as unknown as { upiNote?: string }).upiNote || "",
    style: {
      ...createDefaultStyle(),
      ...(doc.style || {}),
      logoSize: normalizedLogoSize,
      logoMargin: 8,
      hideBackgroundDots: true,
    },
    createdAt,
    updatedAt,
  };
}

export const useQrCodeStore = create<QrCodeState>()(
  persist(
    (set, get) => {
      let downloadApi: DownloadApi | undefined;
      return {
        doc: createDefaultDoc(),
        exportSettings: { extension: "png", size: 768, colorSpace: "rgb" },
        errors: {},
        setDoc: (doc) => set({ doc: normalizeDoc(doc) }),
        updateDoc: (updates) =>
          set((state) => ({
            doc: {
              ...state.doc,
              ...updates,
              style: { ...state.doc.style, ...(updates.style || {}) },
            },
          })),
        resetDoc: () =>
          set((state) => ({
            doc: createDefaultDoc(),
            errors: {},
            exportSettings: {
              ...state.exportSettings,
              size: 768,
            },
          })),
        setErrors: (errors) => set({ errors }),
        clearErrors: (keys) =>
          set((state) => {
            if (!keys || keys.length === 0) return { errors: {} };
            const next = { ...state.errors };
            keys.forEach((k) => {
              delete next[k];
            });
            return { errors: next };
          }),
        setExportSettings: (updates) =>
          set((state) => ({
            exportSettings: { ...state.exportSettings, ...updates },
          })),
        registerDownloadApi: (api) => {
          downloadApi = api;
        },
        download: async (fileName) => {
          const api = downloadApi;
          if (!api) return;
          const { extension, size, colorSpace } = get().exportSettings;
          await api.download({
            extension,
            size,
            colorSpace,
            name: fileName || "qr-code",
          });
        },
      };
    },
    {
      name: "invoice-forge-active-qr-code",
      version: 4,
      partialize: (state) => ({
        doc: state.doc,
        exportSettings: state.exportSettings,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.doc) return;
        state.setDoc(state.doc);
        state.setExportSettings({
          colorSpace:
            (state.exportSettings as unknown as { colorSpace?: QrColorSpace })
              .colorSpace ?? "rgb",
        });
      },
    },
  ),
);
