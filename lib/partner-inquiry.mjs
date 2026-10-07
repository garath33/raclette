const PARTNER_EMAIL = "milan@raclette-original.com";
const SUBJECT = "Raclette Point Original — spolupráce";

const LIMITS = {
  name: 120,
  type: 40,
  city: 80,
  phone: 40,
  email: 120,
  idea: 2000,
  typeLabel: 80,
  lang: 8
};

const TYPE_VALUES = new Set([
  "restaurant",
  "hotel",
  "bar",
  "winebar",
  "catering",
  "other"
]);

export function partnerInquiryEndpoint() {
  return "https://formsubmit.co/ajax/" + PARTNER_EMAIL;
}

export function partnerInquiryTo() {
  return PARTNER_EMAIL;
}

function trimField(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

export function normalizePartnerInquiry(body) {
  const data = {
    name: trimField(body?.name, LIMITS.name),
    type: trimField(body?.type, LIMITS.type),
    typeLabel: trimField(body?.typeLabel, LIMITS.typeLabel),
    city: trimField(body?.city, LIMITS.city),
    phone: trimField(body?.phone, LIMITS.phone),
    email: trimField(body?.email, LIMITS.email),
    idea: trimField(body?.idea, LIMITS.idea),
    lang: trimField(body?.lang, LIMITS.lang).toLowerCase(),
    website: trimField(body?.website, 200)
  };
  if (!TYPE_VALUES.has(data.type)) data.type = "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) data.email = "";
  return data;
}

export function validatePartnerInquiry(data) {
  if (data.website) return "spam";
  const required = ["name", "type", "city", "phone", "email", "idea"];
  for (const key of required) {
    if (!data[key]) return "invalid";
  }
  return null;
}

export function formatPartnerInquiryText(data) {
  const typeLine = data.typeLabel || data.type;
  return [
    "Nová poptávka z webu Raclette Point Original",
    "",
    "Název: " + data.name,
    "Typ provozovny: " + typeLine,
    "Město: " + data.city,
    "Telefon: " + data.phone,
    "E-mail: " + data.email,
    data.lang ? "Jazyk formuláře: " + data.lang : "",
    "",
    "Představa:",
    data.idea
  ].filter(Boolean).join("\n");
}

export function buildPartnerInquiryPayload(data) {
  return {
    name: data.name,
    email: data.email,
    _replyto: data.email,
    _subject: SUBJECT,
    _template: "table",
    _captcha: "false",
    typ: data.typeLabel || data.type,
    mesto: data.city,
    telefon: data.phone,
    jazyk: data.lang || "",
    predstava: data.idea,
    message: formatPartnerInquiryText(data)
  };
}

export function isPartnerInquirySuccess(response, payload) {
  if (!response || !response.ok) return false;
  if (payload && (payload.ok === true || payload.success === true || payload.success === "true")) {
    return true;
  }
  return false;
}
