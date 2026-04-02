export function resolveCssVarColor(varName: string) {
  if (typeof document === "undefined") return undefined;
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  el.style.top = "-9999px";
  el.style.color = `var(${varName})`;
  document.body.appendChild(el);
  const color = getComputedStyle(el).color;
  document.body.removeChild(el);
  return color || undefined;
}
