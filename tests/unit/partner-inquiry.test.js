const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizePartnerInquiry,
  validatePartnerInquiry,
  formatPartnerInquiryText,
  buildPartnerInquiryPayload,
  isPartnerInquirySuccess,
  partnerInquiryEndpoint,
  partnerInquiryTo
} = require("../../lib/partner-inquiry.mjs");

test("normalizePartnerInquiry odmítne neplatný e-mail", () => {
  const data = normalizePartnerInquiry({
    name: "Hotel Test",
    type: "hotel",
    typeLabel: "Hotel",
    city: "Opava",
    phone: "+420777600223",
    email: "not-an-email",
    idea: "Shop-in-shop",
    lang: "cs"
  });
  assert.equal(data.email, "");
  assert.equal(validatePartnerInquiry(data), "invalid");
});

test("formatPartnerInquiryText obsahuje všechna pole", () => {
  const data = normalizePartnerInquiry({
    name: "Hotel Test",
    type: "hotel",
    typeLabel: "Hotel",
    city: "Opava",
    phone: "+420777600223",
    email: "partner@example.com",
    idea: "Chci shop-in-shop.",
    lang: "cs"
  });
  const text = formatPartnerInquiryText(data);
  assert.match(text, /Hotel Test/);
  assert.match(text, /Opava/);
  assert.match(text, /partner@example.com/);
  assert.match(text, /Chci shop-in-shop/);
});

test("buildPartnerInquiryPayload míří na Milana a má předmět", () => {
  assert.equal(partnerInquiryTo(), "milan@raclette-original.com");
  assert.match(partnerInquiryEndpoint(), /formsubmit\.co\/ajax\/milan@raclette-original\.com/);
  const data = normalizePartnerInquiry({
    name: "Hotel Test",
    type: "hotel",
    typeLabel: "Hotel",
    city: "Opava",
    phone: "+420777600223",
    email: "partner@example.com",
    idea: "Chci shop-in-shop.",
    lang: "cs"
  });
  const payload = buildPartnerInquiryPayload(data);
  assert.equal(payload.email, "partner@example.com");
  assert.match(payload._subject, /Raclette Point Original/);
  assert.match(payload.message, /Opava/);
});

test("isPartnerInquirySuccess bere FormSubmit i vlastní ok", () => {
  assert.equal(isPartnerInquirySuccess({ ok: true }, { success: "true" }), true);
  assert.equal(isPartnerInquirySuccess({ ok: true }, { ok: true }), true);
  assert.equal(isPartnerInquirySuccess({ ok: false }, { success: "true" }), false);
});
