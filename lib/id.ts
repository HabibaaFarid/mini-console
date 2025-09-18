import { randomBytes } from "crypto";

export function generateSystemId(): string {
  return `pay_${randomBytes(6).toString("hex")}`;
}

export function generatePublicId(): string {
  return randomBytes(12).toString("hex");
}
