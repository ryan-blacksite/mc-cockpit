// Mission Control — Database Types (Backwards Compatibility)
// Owns: Nothing. Re-exports everything from docs/types/ barrel.
// This file exists so existing imports from "docs/database.types" still resolve.
// New code should import from "docs/types" directly.
// See conventions.md CS-14, CS-19.
//
// Modified by Kori Willis — 2025-02-03

export {
  Database,
  DatabaseWithoutInternals,
  DefaultSchema,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  CompositeTypes,
  Constants,
} from "./types"
