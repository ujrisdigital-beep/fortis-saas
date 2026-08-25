export interface PasswordPolicyResult {
  ok: boolean;
  reasons: string[];
}

export function evaluatePassword(password: string): PasswordPolicyResult {
  const reasons: string[] = [];
  if (password.length < 12) reasons.push("min_length_12");
  if (!/[a-z]/.test(password)) reasons.push("need_lower");
  if (!/[A-Z]/.test(password)) reasons.push("need_upper");
  if (!/[0-9]/.test(password)) reasons.push("need_digit");
  if (!/[^A-Za-z0-9]/.test(password)) reasons.push("need_symbol");
  const common = ["password", "fortis", "gambia", "123456", "qwerty"];
  if (common.some((w) => password.toLowerCase().includes(w))) reasons.push("too_common");
  return { ok: reasons.length === 0, reasons };
}
