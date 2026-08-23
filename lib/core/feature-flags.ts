export const DEFAULT_FLAGS: Record<string, boolean> = {
  "module.grow.launch": true,
  "module.core.payments.sandbox": true,
  "module.core.payments.live": false,
  "module.grow.paid_ai": false,
  "module.live_data.gbos": true,
  "module.live_data.cbg": true,
  "module.live_data.worldbank": true,
};

export function isFlagEnabled(key: string, overrides: Record<string, boolean> = {}): boolean {
  if (key in overrides) return overrides[key];
  if (process.env[`FORTIS_FLAG_${key.replace(/[.-]/g, "_").toUpperCase()}`] === "true") return true;
  if (process.env[`FORTIS_FLAG_${key.replace(/[.-]/g, "_").toUpperCase()}`] === "false") return false;
  return DEFAULT_FLAGS[key] ?? false;
}

export function assertModuleLaunched(key: string): void {
  if (!isFlagEnabled(key)) {
    throw new Error(`module_not_launched:${key}`);
  }
}
