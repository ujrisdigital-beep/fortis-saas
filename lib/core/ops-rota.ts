export interface OnCallSlot {
  applet: string;
  owner: string;
  backup: string;
  hours: string;
}

export const PILOT_ROTA: OnCallSlot[] = [
  { applet: "core", owner: "platform-oncall", backup: "security-oncall", hours: "business-hours-gmt" },
  { applet: "grow", owner: "grow-pilot", backup: "platform-oncall", hours: "business-hours-gmt" },
  { applet: "academy", owner: "academy-pilot", backup: "platform-oncall", hours: "business-hours-gmt" },
  { applet: "discover", owner: "discover-editor", backup: "platform-oncall", hours: "business-hours-gmt" },
  { applet: "govern", owner: "govern-duty", backup: "legal-duty", hours: "business-hours-gmt" },
];

export function rotaFor(applet: string): OnCallSlot | undefined {
  return PILOT_ROTA.find((s) => s.applet === applet);
}
