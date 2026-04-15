export const SITE_NAME = "PepAtlas";
export const SITE_URL = "https://pepatlas.com";
export const SITE_DESCRIPTION =
  "The peptide community platform. Forums, tools, articles, and protocols for researchers and biohacking enthusiasts.";

export const PEPPERPEDIA_URL = "https://pepperpedia.net";
export const PEPPERPEDIA_NAME = "Pepperpedia";
export const PEPCALC_URL = "https://peppercalc.com";
export const PEPCALC_NAME = "Peppercalc";
export const SUPPLIER_URL = "https://whitemarketpeptides.com";
export const SUPPLIER_NAME = "White Market Peptides";

/** Build a UTM-tagged peppercalc.com URL. */
export function pepcalcUrl(path: string = "", content?: string): string {
  const base = `${PEPCALC_URL}${path}`;
  const sep = base.includes("?") ? "&" : "?";
  let params = `${sep}utm_source=pepatlas&utm_medium=forum`;
  if (content) params += `&utm_content=${content}`;
  return `${base}${params}`;
}

/** Build a UTM-tagged pepperpedia.net URL. */
export function pepperpediaUrl(path: string = "", content?: string): string {
  const base = `${PEPPERPEDIA_URL}${path}`;
  const sep = base.includes("?") ? "&" : "?";
  let params = `${sep}utm_source=pepatlas&utm_medium=forum`;
  if (content) params += `&utm_content=${content}`;
  return `${base}${params}`;
}

/** Build a UTM-tagged whitemarketpeptides.com URL. */
export function supplierUrl(content?: string): string {
  const base = SUPPLIER_URL;
  let params = `?utm_source=pepatlas&utm_medium=forum`;
  if (content) params += `&utm_content=${content}`;
  return `${base}${params}`;
}

export const FORUM_CATEGORIES = [
  {
    slug: "beginner-questions",
    name: "Beginner Questions",
    description: "New to peptides? Start here.",
    icon: "HelpCircle",
  },
  {
    slug: "protocol-discussions",
    name: "Protocol Discussions",
    description: "Share and discuss protocols.",
    icon: "ClipboardList",
  },
  {
    slug: "personal-logs",
    name: "Personal Logs & Journals",
    description: "Track your journey.",
    icon: "BookOpen",
  },
  {
    slug: "bloodwork-metrics",
    name: "Bloodwork & Metrics",
    description: "Lab results and biomarkers.",
    icon: "Activity",
  },
  {
    slug: "optimization",
    name: "Optimization Strategies",
    description: "Advanced wellness strategies.",
    icon: "TrendingUp",
  },
  {
    slug: "general",
    name: "General Discussion",
    description: "Off-topic and community chat.",
    icon: "MessageSquare",
  },
] as const;

export const DISCLAIMER_TEXT =
  "This content is provided for educational and research purposes only. It does not constitute medical advice, diagnosis, or treatment recommendations. Always consult a qualified healthcare professional before making any health-related decisions.";
