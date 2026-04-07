import sharp from "sharp";

export const runtime = "nodejs";

function sanitizeFileName(name: string) {
  const base = (name || "qr-code").trim() || "qr-code";
  return base.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const svg = body?.svg;
  const format = body?.format;
  const colorSpace = body?.colorSpace;
  const width = Number(body?.width);
  const height = Number(body?.height);
  const name = sanitizeFileName(String(body?.name ?? "qr-code"));

  if (typeof svg !== "string" || svg.length === 0) {
    return Response.json({ error: "svg is required" }, { status: 400 });
  }
  if (svg.length > 2_000_000) {
    return Response.json({ error: "svg is too large" }, { status: 413 });
  }
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return Response.json({ error: "width and height are required" }, { status: 400 });
  }
  if (width < 1 || height < 1 || width > 4096 || height > 4096) {
    return Response.json({ error: "width/height out of range" }, { status: 400 });
  }
  if (colorSpace !== "cmyk" && colorSpace !== "rgb") {
    return Response.json({ error: "invalid colorSpace" }, { status: 400 });
  }
  if (format !== "jpeg" && format !== "tiff" && format !== "png") {
    return Response.json({ error: "invalid format" }, { status: 400 });
  }
  if (colorSpace === "cmyk" && format === "png") {
    return Response.json(
      { error: "CMYK PNG is not supported. Use JPEG or TIFF." },
      { status: 400 },
    );
  }

  const outExt = format === "jpeg" ? "jpg" : format === "tiff" ? "tif" : "png";
  const mime =
    format === "jpeg"
      ? "image/jpeg"
      : format === "tiff"
        ? "image/tiff"
        : "image/png";

  try {
    let img = sharp(Buffer.from(svg), { density: 300 })
      .resize(Math.round(width), Math.round(height), { fit: "fill" })
      .flatten({ background: "#ffffff" });

    img = colorSpace === "cmyk" ? img.toColourspace("cmyk") : img.toColourspace("srgb");

    if (format === "jpeg") {
      img = img.jpeg({ quality: 95, mozjpeg: true });
    } else if (format === "tiff") {
      img = img.tiff({ compression: "lzw" });
    } else {
      img = img.png();
    }

    const buf = await img.toBuffer();
    return new Response(new Uint8Array(buf), {
      headers: {
        "content-type": mime,
        "cache-control": "no-store",
        "content-disposition": `attachment; filename="${name}.${outExt}"`,
      },
    });
  } catch {
    return Response.json({ error: "conversion_failed" }, { status: 500 });
  }
}
