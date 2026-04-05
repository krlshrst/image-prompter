export function toXML(data: Record<string, unknown>): string {
  const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function vToXML(key: string, val: unknown, ind: number): string {
    const pad = " ".repeat(ind);
    if (Array.isArray(val)) return `${pad}<${key}>\n${val.map(v => `${pad}  <item>${esc(v)}</item>`).join("\n")}\n${pad}</${key}>`;
    if (val !== null && typeof val === "object") return `${pad}<${key}>\n${Object.entries(val as Record<string, unknown>).map(([k, v]) => vToXML(k, v, ind + 2)).join("\n")}\n${pad}</${key}>`;
    return `${pad}<${key}>${esc(val)}</${key}>`;
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<ImagePrompts>\n`;
  for (const [ai, params] of Object.entries(data)) {
    const tag = ai.replace(/\s+/g, "");
    xml += `  <${tag}>\n${Object.entries(params as Record<string, unknown>).map(([k, v]) => vToXML(k, v, 4)).join("\n")}\n  </${tag}>\n`;
  }
  return xml + `</ImagePrompts>`;
}
