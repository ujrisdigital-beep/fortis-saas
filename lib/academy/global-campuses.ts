/**
 * Official vendor / university campuses we point learners at.
 * FORTIS does not host their videos, mint their badges, or sell their paid exams.
 */

export type CampusKind = "vendor_academy" | "university_oer" | "oss_school";

export type GlobalCampus = {
  id: string;
  name: string;
  org: string;
  url: string;
  kind: CampusKind;
  cost: string;
  credential: string;
  door: "1_start" | "2_builder" | "3_specialist";
  whyGambia: string;
  note: string;
};

export const GLOBAL_CAMPUSES: GlobalCampus[] = [
  {
    id: "anthropic",
    name: "Claude Academy",
    org: "Anthropic",
    url: "https://academy.claude.com",
    kind: "vendor_academy",
    cost: "Catalogue free (Aug 2026). Some hands-on needs a paid Claude plan.",
    credential: "Completion badges on their site. Not the paid Claude Certified exam.",
    door: "1_start",
    whyGambia: "AI fluency and API literacy without a FORTIS AI vendor lock-in.",
    note: "Lessons often browse without login; sign-in to save progress. Counts change; we do not freeze 22/357.",
  },
  {
    id: "openai",
    name: "OpenAI Academy",
    org: "OpenAI",
    url: "https://academy.openai.com",
    kind: "vendor_academy",
    cost: "Learning catalogue advertised free.",
    credential: "Their completion artefacts only.",
    door: "1_start",
    whyGambia: "ChatGPT / GPT workflows many SMEs already meet in the diaspora.",
    note: "Not a FORTIS rail. We do not require OpenAI keys on this platform.",
  },
  {
    id: "google-skills",
    name: "Google Skills / Skillshop / ML Crash Course",
    org: "Google",
    url: "https://grow.google/intl/europe/skills/",
    kind: "vendor_academy",
    cost: "Many paths free; some Google Career Certificates are paid.",
    credential: "Google badges stay Google’s.",
    door: "1_start",
    whyGambia: "Digital marketing + ML crash course for GROW operators.",
    note: "Also: https://developers.google.com/machine-learning/crash-course and Skillshop.",
  },
  {
    id: "microsoft-learn",
    name: "Microsoft Learn (AI / Copilot / Azure)",
    org: "Microsoft",
    url: "https://learn.microsoft.com/training/",
    kind: "vendor_academy",
    cost: "Learning paths free. Certification exams are paid.",
    credential: "Exam certs are Microsoft’s, not FORTIS.",
    door: "2_builder",
    whyGambia: "Office / Copilot literacy used in NGOs and banks here.",
    note: "Do not treat a Learn module as an Azure licence.",
  },
  {
    id: "aws-skillbuilder",
    name: "AWS Skill Builder",
    org: "Amazon Web Services",
    url: "https://skillbuilder.aws/",
    kind: "vendor_academy",
    cost: "Large free digital catalogue. Labs often paid.",
    credential: "AWS cert exams paid and separate.",
    door: "2_builder",
    whyGambia: "Cloud ops if a partner later hosts on AWS.",
    note: "Free videos ≠ Solutions Architect.",
  },
  {
    id: "ibm-skillsbuild",
    name: "IBM SkillsBuild",
    org: "IBM",
    url: "https://skillsbuild.org/",
    kind: "vendor_academy",
    cost: "Free tracks + IBM digital credentials.",
    credential: "IBM badges. Not a FORTIS HMAC cert.",
    door: "1_start",
    whyGambia: "Cyber and workplace AI with shareable badges.",
    note: "Verify the badge on IBM’s verifier.",
  },
  {
    id: "huggingface",
    name: "Hugging Face Learn (LLM + Agents)",
    org: "Hugging Face",
    url: "https://huggingface.co/learn",
    kind: "oss_school",
    cost: "Courses free. Agents course states free certification.",
    credential: "HF process only.",
    door: "2_builder",
    whyGambia: "Open-weight path — matches our no-required-OpenAI rule.",
    note: "Needs Python. Low-data: download chapters when you have Wi-Fi.",
  },
  {
    id: "fastai",
    name: "Practical Deep Learning for Coders",
    org: "fast.ai",
    url: "https://course.fast.ai/",
    kind: "oss_school",
    cost: "Free.",
    credential: "None official from FORTIS.",
    door: "3_specialist",
    whyGambia: "Serious builders after HF / web fundamentals.",
    note: "Needs a GPU notebook you arrange yourself.",
  },
  {
    id: "elements-ai",
    name: "Elements of AI",
    org: "University of Helsinki",
    url: "https://www.elementsofai.com/",
    kind: "university_oer",
    cost: "Free.",
    credential: "Helsinki certificate if they still issue it — check their site.",
    door: "1_start",
    whyGambia: "Best zero-code start before Claude/Google campuses.",
    note: "English. Not a programming course.",
  },
  {
    id: "mit-6s191",
    name: "MIT 6.S191 Introduction to Deep Learning",
    org: "MIT",
    url: "https://introtodeeplearning.com/",
    kind: "university_oer",
    cost: "Lectures free.",
    credential: "Not a MIT degree and not a FORTIS badge.",
    door: "3_specialist",
    whyGambia: "University-grade lectures after fast.ai / HF.",
    note: "Do not advertise as enrolled at MIT.",
  },
  {
    id: "freecodecamp",
    name: "freeCodeCamp",
    org: "freeCodeCamp",
    url: "https://www.freecodecamp.org/",
    kind: "oss_school",
    cost: "Free.",
    credential: "Their certs after projects. FORTIS cert is separate (GMD 150).",
    door: "2_builder",
    whyGambia: "Web + JS path that pairs with our web-fundamentals outline.",
    note: "BSD-licensed curriculum. Heavy data — use night Wi-Fi.",
  },
  {
    id: "fao-elearning",
    name: "FAO elearning Academy",
    org: "FAO",
    url: "https://elearning.fao.org/",
    kind: "university_oer",
    cost: "Free access.",
    credential: "FAO badges if offered — not FORTIS.",
    door: "1_start",
    whyGambia: "Agri / food hygiene next to our agro-processing outline.",
    note: "Official UN agency school.",
  },
];

export function campusesByDoor(door: GlobalCampus["door"]) {
  return GLOBAL_CAMPUSES.filter((c) => c.door === door);
}
