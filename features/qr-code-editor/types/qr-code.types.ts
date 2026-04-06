export type QrCodeType =
  | "raw"
  | "url"
  | "phone"
  | "sms"
  | "twitter"
  | "tweet"
  | "wifi"
  | "email"
  | "event"
  | "upi";

export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type QrRenderType = "svg" | "canvas";
export type QrShape = "square" | "circle";

export type QrDotsType =
  | "square"
  | "dots"
  | "rounded"
  | "extra-rounded"
  | "classy"
  | "classy-rounded";

export type QrCornersSquareType =
  | "none"
  | "square"
  | "dot"
  | "rounded"
  | "extra-rounded"
  | "dots"
  | "classy"
  | "classy-rounded";

export type QrCornersDotType =
  | "none"
  | "square"
  | "dot"
  | "rounded"
  | "extra-rounded"
  | "dots"
  | "classy"
  | "classy-rounded";

export type EventOutputFormat = "ical" | "google";

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface QrCodeStyle {
  size: number;
  margin: number;
  renderType: QrRenderType;
  shape: QrShape;
  errorCorrectionLevel: QrErrorCorrectionLevel;
  dotsType: QrDotsType;
  dotsColor: string;
  backgroundColor: string;
  cornersSquareType: QrCornersSquareType;
  cornersSquareColor: string;
  cornersDotType: QrCornersDotType;
  cornersDotColor: string;
  logoSize: number;
  logoMargin: number;
  hideBackgroundDots: boolean;
}

export interface QrCodeDoc {
  id: string;
  type: QrCodeType;

  rawText: string;
  url: string;

  phoneNumber: string;

  smsNumber: string;
  smsBody: string;

  twitterHandle: string;

  tweetText: string;
  tweetUrl: string;

  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: WifiEncryption;
  wifiHidden: boolean;

  emailTo: string;
  emailSubject: string;
  emailBody: string;

  eventTitle: string;
  eventLocation: string;
  eventDescription: string;
  eventStart: string;
  eventEnd: string;
  eventAllDay: boolean;
  eventOutputFormat: EventOutputFormat;

  upiVpa: string;
  upiPayeeName: string;
  upiAmount: string;
  upiNote: string;

  logoDataUrl?: string;
  captionTitle: string;
  captionDescription: string;
  showActionDetails: boolean;
  style: QrCodeStyle;

  createdAt: Date;
  updatedAt: Date;
}
