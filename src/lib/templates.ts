import { computeTotals, emptyQuotation, type Quotation } from "./quotation";
import type { CompanyProfile } from "./quote-store";

export interface TemplateSeed {
  id: string;
  name: string;
  description: string;
  tagline: string;
  build: () => Quotation;
}

const DUMMY: CompanyProfile = {
  companyName: "",
  currency: "USD",
  taxLabel: "Tax",
  taxRate: 0,
};

interface TmplPayment {
  milestone: string;
  due: string;
  percentage: number;
  amount?: number;
}

type TmplInput = Omit<Partial<Quotation>, "paymentSchedule"> & {
  paymentSchedule?: TmplPayment[];
};

function make(partial: TmplInput): Quotation {
  const paymentSchedule = (partial.paymentSchedule ?? []).map((p) => ({
    ...p,
    amount: p.amount ?? 0,
  }));
  return computeTotals(
    { ...emptyQuotation(), ...partial, paymentSchedule },
    DUMMY,
  );
}

export const TEMPLATES: TemplateSeed[] = [
  {
    id: "web-design",
    name: "Website Design",
    tagline: "Marketing site",
    description:
      "A conversion-focused marketing website with copy, design and on-page SEO.",
    build: () =>
      make({
        projectTitle: "Marketing Website Design",
        executiveSummary:
          "We'll design and build a fast, conversion-focused marketing website that clearly communicates your offer and turns visitors into leads.",
        scope: [
          "Discovery call & competitor review",
          "Information architecture & wireframes",
          "Custom visual design (up to 6 pages)",
          "Responsive front-end build",
          "On-page SEO & analytics setup",
          "CMS training",
        ],
        outOfScope: ["Ongoing content creation", "Paid ad management", "Custom web apps"],
        deliverables: [
          { title: "Wireframes", description: "Low-fidelity layout for all pages." },
          { title: "Design system", description: "Colors, type, components." },
          { title: "Built site", description: "Responsive, accessible, fast." },
        ],
        timeline: [
          { phase: "Discovery", duration: "1 week", details: "Kickoff, research, IA." },
          { phase: "Design", duration: "2 weeks", details: "Wireframes to final UI." },
          { phase: "Build", duration: "2 weeks", details: "Development & QA." },
          { phase: "Launch", duration: "3 days", details: "Deploy & handover." },
        ],
        pricing: [
          { item: "Design & build", description: "Fixed project fee", amount: 3200 },
          { item: "Copywriting add-on", description: "Up to 6 pages", amount: 600 },
        ],
        paymentSchedule: [
          { milestone: "Deposit", due: "On signing", percentage: 50 },
          { milestone: "Launch", due: "Before go-live", percentage: 50 },
        ],
        validityDays: 21,
        terms: [
          "50% deposit required to begin.",
          "Final payment due before site goes live.",
          "Two rounds of revisions included per phase.",
        ],
      }),
  },
  {
    id: "brand-identity",
    name: "Brand Identity",
    tagline: "Logo & system",
    description: "Complete brand identity: logo, palette, typography and guidelines.",
    build: () =>
      make({
        projectTitle: "Brand Identity Package",
        executiveSummary:
          "A cohesive brand identity that makes you instantly recognizable and trustworthy across every touchpoint.",
        scope: [
          "Brand strategy workshop",
          "Primary & secondary logo marks",
          "Color & typography system",
          "Business card & social templates",
          "Brand guidelines document",
        ],
        outOfScope: ["Website design", "Packaging", "Photography"],
        deliverables: [
          { title: "Logo suite", description: "Primary, secondary, monochrme." },
          { title: "Brand kit", description: "Colors, fonts, usage." },
          { title: "Guidelines", description: "PDF brand book." },
        ],
        timeline: [
          { phase: "Strategy", duration: "1 week", details: "Positioning & mood." },
          { phase: "Design", duration: "2 weeks", details: "Concepts & refinement." },
          { phase: "Delivery", duration: "1 week", details: "Files & guidelines." },
        ],
        pricing: [
          { item: "Identity design", description: "Fixed fee", amount: 2400 },
          { item: "Stationery add-on", description: "Cards, letterhead", amount: 400 },
        ],
        paymentSchedule: [
          { milestone: "Deposit", due: "On signing", percentage: 40 },
          { milestone: "Concepts", due: "After first concepts", percentage: 30 },
          { milestone: "Final", due: "Before delivery", percentage: 30 },
        ],
        validityDays: 14,
        terms: [
          "40% deposit to start.",
          "All source files delivered on final payment.",
          "Three concepts presented; 2 revision rounds.",
        ],
      }),
  },
  {
    id: "seo-retainer",
    name: "SEO Retainer",
    tagline: "Monthly",
    description: "Ongoing monthly SEO: content, technical audits and reporting.",
    build: () =>
      make({
        projectTitle: "Monthly SEO Retainer",
        executiveSummary:
          "A steady, compounding SEO program that grows your organic traffic month after month with content and technical optimization.",
        scope: [
          "Technical SEO audit & fixes",
          "8 optimized articles per month",
          "Link building outreach",
          "Monthly performance report",
          "Keyword strategy",
        ],
        outOfScope: ["Paid media", "Website redesign", "PR"],
        deliverables: [
          { title: "Audit", description: "Crawl, fixes, priorities." },
          { title: "Content", description: "8 articles/month." },
          { title: "Report", description: "Monthly KPI deck." },
        ],
        timeline: [
          { phase: "Month 1", duration: "30 days", details: "Audit + foundation." },
          { phase: "Month 2+", duration: "Ongoing", details: "Content & links." },
        ],
        pricing: [
          { item: "Monthly retainer", description: "Recurring", amount: 1200 },
        ],
        paymentSchedule: [
          { milestone: "Monthly", due: "First of each month", percentage: 100 },
        ],
        validityDays: 30,
        terms: [
          "Billed monthly in advance.",
          "30-day rolling cancelation notice.",
          "Client to provide product/brand access.",
        ],
      }),
  },
  {
    id: "ecommerce",
    name: "E-commerce Build",
    tagline: "Shopify",
    description: "Shopify store build with products, payments and theme.",
    build: () =>
      make({
        projectTitle: "E-commerce Store Build",
        executiveSummary:
          "A polished Shopify store that showcases your products and makes checkout effortless for customers.",
        scope: [
          "Store setup & theme customization",
          "Up to 40 products imported",
          "Payment & shipping configuration",
          "Email automation basics",
          "Staff training",
        ],
        outOfScope: ["Custom app development", "Product photography", "Fulfillment"],
        deliverables: [
          { title: "Theme", description: "Customized storefront." },
          { title: "Catalog", description: "40 products loaded." },
          { title: "Handover", description: "Training & docs." },
        ],
        timeline: [
          { phase: "Setup", duration: "1 week", details: "Store & apps." },
          { phase: "Build", duration: "2 weeks", details: "Theme & catalog." },
          { phase: "Launch", duration: "1 week", details: "QA & train." },
        ],
        pricing: [
          { item: "Build", description: "Fixed fee", amount: 3800 },
          { item: "Maintenance", description: "15%/mo optional", amount: 570 },
        ],
        paymentSchedule: [
          { milestone: "Deposit", due: "On signing", percentage: 50 },
          { milestone: "Launch", due: "Before go-live", percentage: 50 },
        ],
        validityDays: 21,
        terms: [
          "50% deposit to begin.",
          "App subscription fees billed to client directly.",
          "Monthly maintenance billed separately if selected.",
        ],
      }),
  },
  {
    id: "video",
    name: "Video Production",
    tagline: "Promo film",
    description: "Short promotional video: concept, shoot and edit.",
    build: () =>
      make({
        projectTitle: "Promotional Video",
        executiveSummary:
          "A short, punchy brand video that builds trust and explains your offer in under 90 seconds.",
        scope: [
          "Creative concept & script",
          "1-day shoot",
          "Editing, color & sound",
          "Two delivered cuts",
        ],
        outOfScope: ["Paid distribution", "Drone work", "Actors/talent fees"],
        deliverables: [
          { title: "Script", description: "Storyboard & script." },
          { title: "Raw + edit", description: "Footage + final cuts." },
        ],
        timeline: [
          { phase: "Pre-prod", duration: "1 week", details: "Script & plan." },
          { phase: "Shoot", duration: "1 day", details: "Production." },
          { phase: "Post", duration: "2 weeks", details: "Edit & grade." },
        ],
        pricing: [
          { item: "Production", description: "Fixed fee", amount: 2600 },
          { item: "Drone add-on", description: "Optional", amount: 450 },
        ],
        paymentSchedule: [
          { milestone: "Deposit", due: "On signing", percentage: 50 },
          { milestone: "Final", due: "On delivery", percentage: 50 },
        ],
        validityDays: 14,
        terms: [
          "50% deposit to confirm shoot date.",
          "Talent/location fees billed at cost.",
          "Two revision rounds included.",
        ],
      }),
  },
  {
    id: "consulting",
    name: "Strategy Consulting",
    tagline: "Advisory",
    description: "Fractional strategy consulting on a retainer basis.",
    build: () =>
      make({
        projectTitle: "Strategy Consulting Retainer",
        executiveSummary:
          "Hands-on strategic guidance to sharpen positioning, funnel and growth plan — without hiring full-time.",
        scope: [
          "Weekly strategy calls",
          "Funnel & positioning review",
          "Quarterly growth plan",
          "Async Slack support",
        ],
        outOfScope: ["Execution/implementation", "Design production", "Media buying"],
        deliverables: [
          { title: "Plan", description: "Quarterly roadmap." },
          { title: "Reviews", description: "Monthly deep-dives." },
        ],
        timeline: [
          { phase: "Engagement", duration: "3 months min", details: "Ongoing advisory." },
        ],
        pricing: [
          { item: "Monthly retainer", description: "Recurring", amount: 1500 },
        ],
        paymentSchedule: [
          { milestone: "Monthly", due: "In advance", percentage: 100 },
        ],
        validityDays: 30,
        terms: [
          "Billed monthly in advance.",
          "Minimum 3-month engagement.",
          "Cancel with 30 days notice.",
        ],
      }),
  },
];
