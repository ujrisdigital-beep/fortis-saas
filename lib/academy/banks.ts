import type { ServerQuestion } from "./assess";
import { DEMO_BANK } from "./assess";

const DIGITAL_LITERACY: ServerQuestion[] = [
  {
    id: "dl-q1",
    prompt: "Digital literacy is best described as the ability to:",
    options: [
      "Type quickly on any keyboard",
      "Find, evaluate, create and share information with digital tools",
      "Own the newest smartphone",
      "Write computer programs",
    ],
    correctIndex: 1,
  },
  {
    id: "dl-q2",
    prompt: "A stranger on WhatsApp asks for your mobile-money OTP. You should:",
    options: ["Send it so they can 'verify your account'", "Never share it and hang up", "Share only the last two digits", "Post it in the family group"],
    correctIndex: 1,
  },
  {
    id: "dl-q3",
    prompt: "Which DigComp area is about judging whether a forwarded story is reliable?",
    options: ["Information and data literacy", "Hardware repair", "Cryptocurrency trading", "Video encoding"],
    correctIndex: 0,
  },
];

const MOBILE_MONEY: ServerQuestion[] = [
  {
    id: "mm-q1",
    prompt: "Before you confirm a transfer you should check:",
    options: ["Only the amount", "Name, amount and reference", "Only the network signal", "The colour of the app"],
    correctIndex: 1,
  },
  {
    id: "mm-q2",
    prompt: "A FORTIS Academy pass on mobile money means:",
    options: ["You are a licensed payment provider", "You can explain safe wallet use", "FORTIS holds customer float", "You may issue e-money"],
    correctIndex: 1,
  },
];

const CYBER: ServerQuestion[] = [
  {
    id: "cy-q1",
    prompt: "The most common local digital crime pattern this syllabus highlights is:",
    options: ["Satellite jamming", "Mobile-money and SIM-swap fraud", "ATM skimming only", "Printer firmware attacks"],
    correctIndex: 1,
  },
  {
    id: "cy-q2",
    prompt: "Your email is the 'master key' because:",
    options: ["It is faster than SMS", "Password resets for other accounts go there", "Banks prefer email OTPs", "It cannot be phished"],
    correctIndex: 1,
  },
];

const PHOTO: ServerQuestion[] = [
  {
    id: "ph-q1",
    prompt: "The first photography improvement for a phone shoot is usually:",
    options: ["Buying a drone", "Cleaning the lens and facing the light", "Adding a heavy filter", "Shooting straight into the sun at noon"],
    correctIndex: 1,
  },
  {
    id: "ph-q2",
    prompt: "Photographing a child at a ceremony for a paid post requires:",
    options: ["Nothing if the light is good", "Consent from a guardian and dignity in the frame", "Only a watermark", "A drone permit"],
    correctIndex: 1,
  },
];

const MEDIA: ServerQuestion[] = [
  {
    id: "dm-q1",
    prompt: "A usable short promo starts with:",
    options: ["A trending audio you do not own", "Audience, one message, call to action", "A 12-minute uncut take", "Stock footage with no rights"],
    correctIndex: 1,
  },
  {
    id: "dm-q2",
    prompt: "Captions on a WhatsApp-sized video mainly help:",
    options: ["Search engines only", "Viewers who watch without sound and low data", "The camera sensor", "Battery life"],
    correctIndex: 1,
  },
];

const GRAPHIC: ServerQuestion[] = [
  {
    id: "gr-q1",
    prompt: "For a one-page flyer, hierarchy means:",
    options: ["Using as many fonts as possible", "The eye hits the offer before the fine print", "Centring every line", "Maximum clip-art"],
    correctIndex: 1,
  },
  {
    id: "gr-q2",
    prompt: "A legal free-tool chain for vectors and rasters is:",
    options: ["A cracked copy of Photoshop", "Inkscape + GIMP (or similar OSS)", "Screenshotting someone else's poster", "WordArt only"],
    correctIndex: 1,
  },
];

const MARKETING: ServerQuestion[] = [
  {
    id: "mk-q1",
    prompt: "A complete offer sentence names:",
    options: ["Only the price", "Who it is for, what changes, and the cost", "Every social network", "A celebrity"],
    correctIndex: 1,
  },
  {
    id: "mk-q2",
    prompt: "The useful weekly measure for a Serekunda shop is closer to:",
    options: ["Vanity follower count only", "Enquiries and sales you can count", "How many filters you used", "Boosted reach with no landing offer"],
    correctIndex: 1,
  },
  {
    id: "mk-q3",
    prompt: "Google Digital Garage content in FORTIS Academy is:",
    options: ["Copied into our player", "An external link — their cert stays theirs", "Re-issued as a FORTIS blockchain badge", "Required before any other course"],
    correctIndex: 1,
  },
];

const WEB: ServerQuestion[] = [
  {
    id: "web-q1",
    prompt: "A mobile-first page should include:",
    options: ["A Flash intro", "A viewport meta tag and readable tap targets", "Auto-playing 4K video", "Horizontal scroll of 2000px"],
    correctIndex: 1,
  },
  {
    id: "web-q2",
    prompt: "The canonical free syllabus FORTIS cites for HTML/CSS is:",
    options: ["A random TikTok", "MDN Learn Web Development", "A paid bootcamp brochure", "View-source of a bank site"],
    correctIndex: 1,
  },
];

const DATA: ServerQuestion[] = [
  {
    id: "da-q1",
    prompt: "A clean sales sheet stores:",
    options: ["All sales in one cell", "One sale per row with date, item, qty, amount", "Screenshots of chats only", "A photo of a notebook"],
    correctIndex: 1,
  },
  {
    id: "da-q2",
    prompt: "SUM is used to:",
    options: ["Change the font", "Add a column of numbers", "Send WhatsApp", "Encrypt the file"],
    correctIndex: 1,
  },
];

const CUSTOMER: ServerQuestion[] = [
  {
    id: "cs-q1",
    prompt: "A first written reply should include:",
    options: ["Only an emoji", "Name, issue, next step, time", "The customer's password hint", "A political argument"],
    correctIndex: 1,
  },
  {
    id: "cs-q2",
    prompt: "A customer pastes an OTP in chat. You should:",
    options: ["Use it to log in and 'help'", "Tell them never to share it and delete the message", "Forward it to the group", "Ask for the PIN as well"],
    correctIndex: 1,
  },
];

const AGRI: ServerQuestion[] = [
  {
    id: "ag-q1",
    prompt: "A useful digital field note records:",
    options: ["A motivational quote", "Date, plot, input, yield", "Only the weather meme", "Someone else's harvest photo"],
    correctIndex: 1,
  },
  {
    id: "ag-q2",
    prompt: "Weather advice in FORTIS must be:",
    options: ["Invented if the feed is down", "Dated and sourced, or marked unavailable", "Always 'rain tomorrow'", "Sold as a CBG product"],
    correctIndex: 1,
  },
];

const SOLAR: ServerQuestion[] = [
  {
    id: "so-q1",
    prompt: "Energy typically flows:",
    options: ["Load → battery → sun", "Sun → panel → controller → battery → load", "Inverter → sun → phone", "Grid → panel → cloud"],
    correctIndex: 1,
  },
  {
    id: "so-q2",
    prompt: "A FORTIS solar-literacy pass allows you to:",
    options: ["Wire a neighbour's mains legally", "Explain the chain and know when to call a licensed electrician", "Issue NAWEC connections", "Skip earthing"],
    correctIndex: 1,
  },
];

const ENTERPRISE: ServerQuestion[] = [
  {
    id: "en-q1",
    prompt: "A price that lasts must cover:",
    options: ["Materials only", "Materials, data, transport and your time", "Whatever a competitor tweets", "Zero, to get followers"],
    correctIndex: 1,
  },
  {
    id: "en-q2",
    prompt: "A FORTIS Academy enterprise outline is:",
    options: ["A GRA tax clearance", "A learning path, not a business licence", "A bank guarantee", "A government tender"],
    correctIndex: 1,
  },
];

const BY_PROGRAM: Record<string, ServerQuestion[]> = {
  default: DEMO_BANK,
  "digital-literacy": DIGITAL_LITERACY,
  "mobile-money": MOBILE_MONEY,
  "cyber-essentials": CYBER,
  "phone-photography": PHOTO,
  "digital-media": MEDIA,
  "graphic-basics": GRAPHIC,
  "digital-marketing": MARKETING,
  "web-fundamentals": WEB,
  "data-sheets": DATA,
  "customer-digital": CUSTOMER,
  "agritech-lite": AGRI,
  "solar-basics": SOLAR,
  "entrepreneur-lite": ENTERPRISE,
};

export function bankForProgram(programId: string): ServerQuestion[] {
  return BY_PROGRAM[programId] ?? BY_PROGRAM.default;
}

export function publicQuestions(programId: string) {
  return bankForProgram(programId).map(({ id, prompt, options }) => ({ id, prompt, options }));
}

export function listedProgramIds(): string[] {
  return Object.keys(BY_PROGRAM).filter((k) => k !== "default");
}
