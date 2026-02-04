// Mission Control — Core Database Type Definition
// Owns: Json primitive, Database schema type, DefaultSchema derivation
// Auto-generated from Supabase project cpgdkivxtglpptggvors (mission-control)
// Modified by Kori Willis - 2025-02-03
//
// EXCEPTION (CS-15): This file exceeds the 500-line hard limit.
// Reason: The Database type is a single self-referential structure generated
// by Supabase CLI. Table column types reference Database["public"]["Enums"]["..."]
// internally, making decomposition impossible without breaking the type system.
// This file should only change via `supabase gen types typescript`.
// See: conventions.md CS-14, CS-15, CS-19

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          autonomy_level: Database["public"]["Enums"]["autonomy_level"]
          company_id: string
          created_at: string
          department_id: string | null
          human: boolean
          id: string
          last_pulse: string | null
          mandate: string | null
          name: string
          reports_to: string | null
          role: string
          status: Database["public"]["Enums"]["agent_status"]
          tier: number
        }
        Insert: {
          autonomy_level?: Database["public"]["Enums"]["autonomy_level"]
          company_id: string
          created_at?: string
          department_id?: string | null
          human?: boolean
          id?: string
          last_pulse?: string | null
          mandate?: string | null
          name: string
          reports_to?: string | null
          role: string
          status?: Database["public"]["Enums"]["agent_status"]
          tier: number
        }
        Update: {
          autonomy_level?: Database["public"]["Enums"]["autonomy_level"]
          company_id?: string
          created_at?: string
          department_id?: string | null
          human?: boolean
          id?: string
          last_pulse?: string | null
          mandate?: string | null
          name?: string
          reports_to?: string | null
          role?: string
          status?: Database["public"]["Enums"]["agent_status"]
          tier?: number
        }
        Relationships: [
          {
            foreignKeyName: "agents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          company_id: string
          content: string
          id: string
          role: Database["public"]["Enums"]["chat_message_role"]
          sent_at: string
          session_id: string
          tokens_used: number | null
        }
        Insert: {
          company_id: string
          content: string
          id?: string
          role: Database["public"]["Enums"]["chat_message_role"]
          sent_at?: string
          session_id: string
          tokens_used?: number | null
        }
        Update: {
          company_id?: string
          content?: string
          id?: string
          role?: Database["public"]["Enums"]["chat_message_role"]
          sent_at?: string
          session_id?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          agent_id: string
          closed_at: string | null
          company_id: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["chat_session_status"]
          user_id: string
        }
        Insert: {
          agent_id: string
          closed_at?: string | null
          company_id: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["chat_session_status"]
          user_id: string
        }
        Update: {
          agent_id?: string
          closed_at?: string | null
          company_id?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["chat_session_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          ceo_id: string | null
          created_at: string
          default_autonomy: Database["public"]["Enums"]["autonomy_level"]
          id: string
          mission: string | null
          name: string
          owner_user_id: string
          pulse_interval_minutes: number
          spending_authority_usd: number
          status: Database["public"]["Enums"]["company_status"]
          strategic_priorities: string[] | null
          values: string[] | null
          vision: string | null
        }
        Insert: {
          ceo_id?: string | null
          created_at?: string
          default_autonomy?: Database["public"]["Enums"]["autonomy_level"]
          id?: string
          mission?: string | null
          name: string
          owner_user_id: string
          pulse_interval_minutes?: number
          spending_authority_usd?: number
          status?: Database["public"]["Enums"]["company_status"]
          strategic_priorities?: string[] | null
          values?: string[] | null
          vision?: string | null
        }
        Update: {
          ceo_id?: string | null
          created_at?: string
          default_autonomy?: Database["public"]["Enums"]["autonomy_level"]
          id?: string
          mission?: string | null
          name?: string
          owner_user_id?: string
          pulse_interval_minutes?: number
          spending_authority_usd?: number
          status?: Database["public"]["Enums"]["company_status"]
          strategic_priorities?: string[] | null
          values?: string[] | null
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_companies_ceo"
            columns: ["ceo_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          chief_id: string | null
          company_id: string
          health: Database["public"]["Enums"]["health_status"]
          id: string
          key_metric: Json | null
          memory: Json | null
          type: Database["public"]["Enums"]["department_type"]
        }
        Insert: {
          chief_id?: string | null
          company_id: string
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          key_metric?: Json | null
          memory?: Json | null
          type: Database["public"]["Enums"]["department_type"]
        }
        Update: {
          chief_id?: string | null
          company_id?: string
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          key_metric?: Json | null
          memory?: Json | null
          type?: Database["public"]["Enums"]["department_type"]
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_departments_chief"
            columns: ["chief_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      escalations: {
        Row: {
          acknowledged_at: string | null
          company_id: string
          context: string
          created_at: string
          from_agent_id: string
          id: string
          impact: string
          recommendation: string
          related_project_id: string | null
          related_task_id: string | null
          resolution: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["escalation_status"]
          to_agent_id: string
          trigger: Database["public"]["Enums"]["escalation_trigger"]
          type: Database["public"]["Enums"]["escalation_type"]
        }
        Insert: {
          acknowledged_at?: string | null
          company_id: string
          context: string
          created_at?: string
          from_agent_id: string
          id?: string
          impact: string
          recommendation: string
          related_project_id?: string | null
          related_task_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["escalation_status"]
          to_agent_id: string
          trigger: Database["public"]["Enums"]["escalation_trigger"]
          type: Database["public"]["Enums"]["escalation_type"]
        }
        Update: {
          acknowledged_at?: string | null
          company_id?: string
          context?: string
          created_at?: string
          from_agent_id?: string
          id?: string
          impact?: string
          recommendation?: string
          related_project_id?: string | null
          related_task_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["escalation_status"]
          to_agent_id?: string
          trigger?: Database["public"]["Enums"]["escalation_trigger"]
          type?: Database["public"]["Enums"]["escalation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "escalations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_from_agent_id_fkey"
            columns: ["from_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_related_task_id_fkey"
            columns: ["related_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_to_agent_id_fkey"
            columns: ["to_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_entries: {
        Row: {
          agent_id: string | null
          company_id: string
          created_at: string
          department_id: string | null
          details: Json | null
          id: string
          importance: Database["public"]["Enums"]["memory_importance"]
          related_ids: string[] | null
          summary: string
          tags: string[] | null
          type: Database["public"]["Enums"]["memory_entry_type"]
        }
        Insert: {
          agent_id?: string | null
          company_id: string
          created_at?: string
          department_id?: string | null
          details?: Json | null
          id?: string
          importance?: Database["public"]["Enums"]["memory_importance"]
          related_ids?: string[] | null
          summary: string
          tags?: string[] | null
          type: Database["public"]["Enums"]["memory_entry_type"]
        }
        Update: {
          agent_id?: string | null
          company_id?: string
          created_at?: string
          department_id?: string | null
          details?: Json | null
          id?: string
          importance?: Database["public"]["Enums"]["memory_importance"]
          related_ids?: string[] | null
          summary?: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["memory_entry_type"]
        }
        Relationships: [
          {
            foreignKeyName: "memory_entries_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_entries_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          company_id: string
          from_agent_id: string
          id: string
          priority: Database["public"]["Enums"]["message_priority"]
          processed_at: string | null
          read_at: string | null
          sent_at: string
          subject: string
          to_agent_id: string
          type: Database["public"]["Enums"]["message_type"]
        }
        Insert: {
          body: string
          company_id: string
          from_agent_id: string
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"]
          processed_at?: string | null
          read_at?: string | null
          sent_at?: string
          subject: string
          to_agent_id: string
          type: Database["public"]["Enums"]["message_type"]
        }
        Update: {
          body?: string
          company_id?: string
          from_agent_id?: string
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"]
          processed_at?: string | null
          read_at?: string | null
          sent_at?: string
          subject?: string
          to_agent_id?: string
          type?: Database["public"]["Enums"]["message_type"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_from_agent_id_fkey"
            columns: ["from_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_to_agent_id_fkey"
            columns: ["to_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      pulses: {
        Row: {
          actions: Json | null
          agent_id: string
          company_id: string
          completed_at: string | null
          decisions: Json | null
          error: string | null
          id: string
          phase: Database["public"]["Enums"]["pulse_phase"]
          scanned_state: Json | null
          started_at: string
          status: Database["public"]["Enums"]["pulse_status"]
        }
        Insert: {
          actions?: Json | null
          agent_id: string
          company_id: string
          completed_at?: string | null
          decisions?: Json | null
          error?: string | null
          id?: string
          phase?: Database["public"]["Enums"]["pulse_phase"]
          scanned_state?: Json | null
          started_at?: string
          status?: Database["public"]["Enums"]["pulse_status"]
        }
        Update: {
          actions?: Json | null
          agent_id?: string
          company_id?: string
          completed_at?: string | null
          decisions?: Json | null
          error?: string | null
          id?: string
          phase?: Database["public"]["Enums"]["pulse_phase"]
          scanned_state?: Json | null
          started_at?: string
          status?: Database["public"]["Enums"]["pulse_status"]
        }
        Relationships: [
          {
            foreignKeyName: "pulses_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          company_id: string
          data: Json
          health: Database["public"]["Enums"]["health_status"]
          id: string
          type: Database["public"]["Enums"]["sector_type"]
        }
        Insert: {
          company_id: string
          data?: Json
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          type: Database["public"]["Enums"]["sector_type"]
        }
        Update: {
          company_id?: string
          data?: Json
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          type?: Database["public"]["Enums"]["sector_type"]
        }
        Relationships: [
          {
            foreignKeyName: "sectors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_by: string
          assignee_id: string
          blocked_reason: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          department_id: string | null
          description: string | null
          id: string
          parameters: Json | null
          parent_task_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          project_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
        }
        Insert: {
          assigned_by: string
          assignee_id: string
          blocked_reason?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          parameters?: Json | null
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
        }
        Update: {
          assigned_by?: string
          assignee_id?: string
          blocked_reason?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          parameters?: Json | null
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
      autonomy_level: "A1" | "A2" | "A3"
      chat_message_role: "USER" | "AGENT"
      chat_session_status: "ACTIVE" | "CLOSED"
      company_status: "ONBOARDING" | "ACTIVE" | "SUSPENDED"
      department_type:
        | "FINANCE"
        | "OPERATIONS"
        | "PRODUCT"
        | "TECHNOLOGY"
        | "MARKETING"
        | "SALES"
        | "LEGAL"
        | "EXTERNAL"
        | "PEOPLE"
      escalation_status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED"
      escalation_trigger:
        | "TASK_BLOCKED"
        | "SCOPE_UNCLEAR"
        | "CONFLICTING_INSTRUCTIONS"
        | "RESOURCE_CONSTRAINT"
        | "CROSS_TEAM_DEPENDENCY"
        | "SCOPE_EXCEEDED"
        | "CROSS_DOMAIN_CONFLICT"
        | "IRREVERSIBLE_DECISION"
        | "BUDGET_REQUEST"
        | "EXTERNAL_COMMITMENT"
        | "MISSION_DRIFT"
        | "MATERIAL_RISK"
        | "TIMELINE_RISK"
        | "PERFORMANCE_ISSUE"
        | "MILESTONE"
        | "OPPORTUNITY"
        | "TASK_COMPLETE"
        | "ANOMALY"
        | "QUALITY_ISSUE"
        | "WORKSTREAM_COMPLETE"
      escalation_type: "AWARENESS" | "ACTION_REQUIRED"
      health_status: "GREEN" | "YELLOW" | "RED"
      memory_entry_type:
        | "DECISION"
        | "ACTION"
        | "ESCALATION"
        | "COMMUNICATION"
        | "PULSE"
        | "AUDIT"
        | "KNOWLEDGE"
      memory_importance: "HIGH" | "MEDIUM" | "LOW"
      message_priority: "SYNC" | "ASYNC"
      message_type:
        | "DIRECTIVE"
        | "REPORT"
        | "ESCALATION"
        | "COORDINATION"
        | "DELEGATION"
      pulse_action_type:
        | "TASK_PROGRESS"
        | "COMMUNICATION"
        | "STATUS_UPDATE"
        | "ESCALATION"
        | "DELEGATION"
        | "DOCUMENTATION"
      pulse_decision_outcome: "QUEUED" | "PROPOSED" | "ESCALATED"
      pulse_phase: "SCAN" | "ASSESS" | "DECIDE" | "EXECUTE" | "LOG" | "COMPLETE"
      pulse_status: "RUNNING" | "COMPLETE" | "FAILED"
      sector_type:
        | "COMMAND"
        | "ORGANIZATION"
        | "OPERATIONS"
        | "FINANCE"
        | "INTELLIGENCE"
        | "METRICS"
      task_priority: "URGENT" | "HIGH" | "NORMAL" | "LOW"
      task_status:
        | "PENDING"
        | "IN_PROGRESS"
        | "BLOCKED"
        | "COMPLETE"
        | "CANCELLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

export type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]
