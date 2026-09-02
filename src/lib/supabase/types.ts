export type LocalizedText = { tr: string; en: string; ar: string };
export type LocalizedList = { tr: string[]; en: string[]; ar: string[] };

export type ProductRow = {
  id: string;
  slug: string;
  legacy_id: string | null;
  name: LocalizedText;
  category_keys: string[];
  color_keys: string[];
  features: LocalizedList;
  images: string[];
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type LeadStage =
  | "new"
  | "contacted"
  | "quoted"
  | "negotiating"
  | "won"
  | "lost";

export type LeadSource = "web_form" | "manual" | "whatsapp" | "phone" | "email";

export type LeadRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  product_name: string | null;
  locale: string | null;
  source: LeadSource;
  stage: LeadStage;
  estimated_value: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadActivityRow = {
  id: string;
  lead_id: string;
  type: "note" | "stage_change";
  body: string | null;
  from_stage: LeadStage | null;
  to_stage: LeadStage | null;
  created_at: string;
  created_by: string | null;
};
