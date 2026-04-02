import { Link, StyleSheet, Text, View } from "@react-pdf/renderer";

export function PdfFooterBar({
  showFooter,
  leftText,
  showPageNumbers,
  showWatermark,
  watermarkHref,
  watermarkText,
  textColor = "#6B7280",
  linkColor,
}: {
  showFooter: boolean;
  leftText: string;
  showPageNumbers: boolean;
  showWatermark: boolean;
  watermarkHref: string;
  watermarkText: string;
  textColor?: string;
  linkColor?: string;
}) {
  const rightColor = linkColor || textColor;
  return (
    <View fixed style={styles.bottomBar}>
      <View style={styles.bottomCol}>
        <Text
          style={[styles.bottomText, styles.bottomLeft, { color: textColor }]}
        >
          {showFooter ? leftText : ""}
        </Text>
      </View>
      <View style={styles.bottomCol}>
        {showPageNumbers ? (
          <Text
            style={[
              styles.bottomText,
              styles.bottomCenter,
              { color: textColor },
            ]}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        ) : (
          <Text
            style={[
              styles.bottomText,
              styles.bottomCenter,
              { color: textColor },
            ]}
          >
            {""}
          </Text>
        )}
      </View>
      <View style={styles.bottomCol}>
        {showWatermark ? (
          <View style={styles.rightWrap}>
            <Link
              src={watermarkHref}
              style={[styles.bottomLink, { color: rightColor }]}
            >
              {watermarkText}
            </Link>
          </View>
        ) : (
          <Text
            style={[
              styles.bottomText,
              styles.bottomRight,
              { color: textColor },
            ]}
          >
            {""}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomCol: {
    flex: 1,
  },
  bottomText: {
    fontSize: 9,
  },
  bottomLeft: {
    textAlign: "left",
  },
  bottomCenter: {
    textAlign: "center",
  },
  bottomRight: {
    textAlign: "right",
  },
  rightWrap: {
    alignItems: "flex-end",
  },
  bottomLink: {
    fontSize: 9,
    textDecoration: "none",
  },
});
