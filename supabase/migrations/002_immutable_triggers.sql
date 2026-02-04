-- ============================================================
-- Mission Control Runtime Schema — Migration 002
-- Immutable Table Triggers (service_role safe)
-- Author: Kori Willis — 2026-02-04
-- Linear: BSL-302 (K-1 — Database Schema & RLS)
-- ============================================================

-- Shared trigger function: rejects UPDATE and DELETE unconditionally
CREATE OR REPLACE FUNCTION prevent_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION '% on %.% is forbidden — table is immutable.',
    TG_OP, TG_TABLE_SCHEMA, TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

-- memory_entries: append-only (INV-MEM-001)
CREATE TRIGGER trg_memory_entries_no_update
  BEFORE UPDATE ON memory_entries
  FOR EACH ROW EXECUTE FUNCTION prevent_mutation();

CREATE TRIGGER trg_memory_entries_no_delete
  BEFORE DELETE ON memory_entries
  FOR EACH ROW EXECUTE FUNCTION prevent_mutation();

-- chat_messages: immutable once sent
CREATE TRIGGER trg_chat_messages_no_update
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION prevent_mutation();

CREATE TRIGGER trg_chat_messages_no_delete
  BEFORE DELETE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION prevent_mutation();

-- ============================================================
-- END OF MIGRATION 002
-- ============================================================
