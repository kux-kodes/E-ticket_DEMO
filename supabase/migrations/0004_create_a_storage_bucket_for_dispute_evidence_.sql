INSERT INTO storage.buckets (id, name, public)
VALUES ('dispute_evidence', 'dispute_evidence', false)
ON CONFLICT (id) DO NOTHING;