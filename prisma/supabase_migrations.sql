-- ============================================================
-- Fortis Invicta — Complete Supabase Migration
-- Run this ONCE in your Supabase SQL editor.
-- All tables include Row Level Security (RLS).
-- ============================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ───────────────────────────────────────────────────
CREATE TYPE brand_member_role      AS ENUM ('OWNER','EDITOR','VIEWER');
CREATE TYPE content_status         AS ENUM ('DRAFT','SCHEDULED','PUBLISHED','ARCHIVED');
CREATE TYPE content_platform       AS ENUM ('TWITTER','INSTAGRAM','LINKEDIN','FACEBOOK','TIKTOK','YOUTUBE','THREADS','CIRCLE');
CREATE TYPE inbox_message_status   AS ENUM ('UNREAD','READ','REPLIED','ARCHIVED');
CREATE TYPE activity_type          AS ENUM ('POST_PUBLISHED','STORY_PUBLISHED','REEL_PUBLISHED','COMMENT_REPLIED','DM_SENT','LEAD_CAPTURED','CONTENT_APPROVED');
CREATE TYPE guarantee_status       AS ENUM ('ACTIVE','AT_RISK','COMPLIANT','CLAIMED','RESOLVED');
CREATE TYPE refund_claim_status    AS ENUM ('PENDING','UNDER_REVIEW','APPROVED','REJECTED','PAID');

-- ─── BRANDS ──────────────────────────────────────────────────
CREATE TABLE brands (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  handle        TEXT NOT NULL UNIQUE,
  niche         TEXT NOT NULL,
  voice_tone    TEXT,
  primary_color TEXT,
  logo_url      TEXT,
  owner_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brand_select" ON brands FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = brands.id));
CREATE POLICY "brand_insert" ON brands FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "brand_update" ON brands FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = brands.id AND role IN ('OWNER','EDITOR')));
CREATE POLICY "brand_delete" ON brands FOR DELETE
  USING (auth.uid() = owner_id);

-- ─── BRAND MEMBERS ───────────────────────────────────────────
CREATE TABLE brand_members (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  user_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role     brand_member_role NOT NULL DEFAULT 'VIEWER',
  UNIQUE(brand_id, user_id)
);

ALTER TABLE brand_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bm_select" ON brand_members FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM brand_members bm2 WHERE bm2.brand_id = brand_members.brand_id AND bm2.role = 'OWNER'
  ));
CREATE POLICY "bm_manage" ON brand_members FOR ALL
  USING (auth.uid() IN (
    SELECT user_id FROM brand_members bm2 WHERE bm2.brand_id = brand_members.brand_id AND bm2.role = 'OWNER'
  ));

-- ─── CONTENT ITEMS ────────────────────────────────────────────
CREATE TABLE content_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id      UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  platform      content_platform NOT NULL,
  content_type  TEXT NOT NULL,
  caption       TEXT NOT NULL,
  hashtags      TEXT[] DEFAULT '{}',
  media_urls    TEXT[] DEFAULT '{}',
  status        content_status NOT NULL DEFAULT 'DRAFT',
  scheduled_at  TIMESTAMPTZ,
  published_at  TIMESTAMPTZ,
  engagements   JSONB,
  forecast      JSONB,
  chi_score     FLOAT,
  schedule_id   UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ci_brand_access" ON content_items FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = content_items.brand_id));

-- ─── CONTENT SCHEDULES ────────────────────────────────────────
CREATE TABLE content_schedules (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id      UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  week_starting TIMESTAMPTZ NOT NULL,
  chi_plan      JSONB NOT NULL,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE content_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cs_brand_access" ON content_schedules FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = content_schedules.brand_id));

-- ─── UNIFIED INBOX ────────────────────────────────────────────
CREATE TABLE unified_inbox (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id        UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  platform        content_platform NOT NULL,
  external_id     TEXT NOT NULL,
  sender_name     TEXT NOT NULL,
  sender_handle   TEXT,
  body            TEXT NOT NULL,
  status          inbox_message_status NOT NULL DEFAULT 'UNREAD',
  ai_reply        TEXT,
  replied_at      TIMESTAMPTZ,
  received_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(platform, external_id)
);

ALTER TABLE unified_inbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inbox_brand_access" ON unified_inbox FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = unified_inbox.brand_id));

-- ─── LEADS ────────────────────────────────────────────────────
CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id      UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  source        TEXT NOT NULL,
  notes         TEXT,
  tags          TEXT[] DEFAULT '{}',
  score         FLOAT NOT NULL DEFAULT 0,
  converted_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_brand_access" ON leads FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = leads.brand_id));

-- ─── CIRCLE POSTS ─────────────────────────────────────────────
CREATE TABLE circle_posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id     TEXT NOT NULL,
  author_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT,
  body         TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  likes        INT NOT NULL DEFAULT 0,
  comments     INT NOT NULL DEFAULT 0
);

ALTER TABLE circle_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cp_read_all"   ON circle_posts FOR SELECT USING (TRUE);
CREATE POLICY "cp_own_write"  ON circle_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "cp_own_update" ON circle_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "cp_own_delete" ON circle_posts FOR DELETE USING (auth.uid() = author_id);

-- ─── USER ACTIVITY LOGS ───────────────────────────────────────
CREATE TABLE user_activity_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id      UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  platform      content_platform,
  reference_id  TEXT,
  details       JSONB,
  logged_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ual_brand_access" ON user_activity_logs FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = user_activity_logs.brand_id));

-- ─── GUARANTEE AGREEMENTS ─────────────────────────────────────
CREATE TABLE guarantee_agreements (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id          UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier              TEXT NOT NULL,
  start_date        TIMESTAMPTZ NOT NULL,
  end_date          TIMESTAMPTZ NOT NULL,
  required_actions  INT NOT NULL,
  completed_actions INT NOT NULL DEFAULT 0,
  status            guarantee_status NOT NULL DEFAULT 'ACTIVE',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE guarantee_agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ga_user_access" ON guarantee_agreements FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "ga_admin_write" ON guarantee_agreements FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = guarantee_agreements.brand_id AND role = 'OWNER'));

-- ─── REFUND CLAIMS ────────────────────────────────────────────
CREATE TABLE refund_claims (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_id   UUID NOT NULL REFERENCES guarantee_agreements(id) ON DELETE CASCADE,
  claimant_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason         TEXT NOT NULL,
  evidence       JSONB,
  status         refund_claim_status NOT NULL DEFAULT 'PENDING',
  review_notes   TEXT,
  resolved_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE refund_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rc_claimant_read" ON refund_claims FOR SELECT
  USING (auth.uid() = claimant_id);
CREATE POLICY "rc_claimant_insert" ON refund_claims FOR INSERT
  WITH CHECK (auth.uid() = claimant_id);

-- ─── SYSTEM PROMPT TEMPLATES ──────────────────────────────────
CREATE TABLE system_prompt_templates (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id   UUID REFERENCES brands(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  category   TEXT NOT NULL,
  prompt     TEXT NOT NULL,
  variables  TEXT[] DEFAULT '{}',
  is_global  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE system_prompt_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "spt_read" ON system_prompt_templates FOR SELECT
  USING (
    is_global = TRUE OR
    auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = system_prompt_templates.brand_id)
  );
CREATE POLICY "spt_write" ON system_prompt_templates FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM brand_members WHERE brand_id = system_prompt_templates.brand_id AND role IN ('OWNER','EDITOR'))
  );

-- ─── USEFUL INDEXES ───────────────────────────────────────────
CREATE INDEX idx_content_items_brand   ON content_items(brand_id);
CREATE INDEX idx_content_items_status  ON content_items(status);
CREATE INDEX idx_inbox_brand_status    ON unified_inbox(brand_id, status);
CREATE INDEX idx_leads_brand           ON leads(brand_id);
CREATE INDEX idx_activity_brand_user   ON user_activity_logs(brand_id, user_id);
CREATE INDEX idx_agreements_user       ON guarantee_agreements(user_id);
CREATE INDEX idx_claims_agreement      ON refund_claims(agreement_id);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
