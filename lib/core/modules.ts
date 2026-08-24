import { isFlagEnabled } from "./feature-flags";
import { APPLET_SCORECARDS, type AppletId, type Maturity } from "../qa/module-readiness";

export type ModuleLaunch = {
  id: AppletId;
  name: string;
  href: string;
  flag: string;
  launched: boolean;
  maturity: Maturity;
  summary: string;
  paidSku?: string;
};

export const MODULE_LAUNCH: ModuleLaunch[] = [
  {
    id: "core",
    name: "FORTIS CORE",
    href: "/onboarding",
    flag: "module.core.control_plane",
    launched: isFlagEnabled("module.core.control_plane"),
    maturity: "pilot",
    summary: "Accounts, policy, entitlements, transfer rail.",
  },
  {
    id: "grow",
    name: "FORTIS GROW",
    href: "/grow/workspace",
    flag: "module.grow.launch",
    launched: isFlagEnabled("module.grow.launch"),
    maturity: "pilot",
    summary: "Free preview diagnostic. Full blueprint GMD 250 by transfer.",
    paidSku: "price_grow_diagnostic_gmd_v1",
  },
  {
    id: "academy",
    name: "FORTIS ACADEMY",
    href: "/academy",
    flag: "module.academy.credentials",
    launched: isFlagEnabled("module.academy.credentials"),
    maturity: "pilot",
    summary: "Learn free. Signed credentials after paid assessment.",
    paidSku: "price_academy_assessment_gmd_v1",
  },
  {
    id: "discover",
    name: "DISCOVER GAMBIA",
    href: "/discover",
    flag: "module.discover.listings",
    launched: isFlagEnabled("module.discover.listings"),
    maturity: "preview",
    summary: "Verified listings only. Ticket sales stay closed until organiser KYB + PSP.",
  },
  {
    id: "govern",
    name: "FORTIS GOVERN",
    href: "/ombudsman",
    flag: "module.govern.intake",
    launched: isFlagEnabled("module.govern.intake"),
    maturity: "preview",
    summary: "Free public ombudsman intake, hosted on their behalf. No automated judgment.",
  },
  {
    id: "partner",
    name: "FORTIS PARTNER",
    href: "/partner",
    flag: "module.partner.directory",
    launched: isFlagEnabled("module.partner.directory"),
    maturity: "preview",
    summary: "Partner directory + KYB machine. Public commerce inventory stays empty.",
  },
];

export function launchedModules(): ModuleLaunch[] {
  return MODULE_LAUNCH.filter((m) => m.launched);
}

export function scorecardAligned(): boolean {
  return APPLET_SCORECARDS.every((s) => MODULE_LAUNCH.some((m) => m.id === s.applet));
}
