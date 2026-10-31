export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      investigations: {
        Row: {
          analysis_mode: string
          confidence: number | null
          created_at: string
          error: string | null
          evidence: Json
          expires_at: string | null
          hypotheses: Json
          id: string
          lease_id: string | null
          lease_until: string | null
          max_steps: number
          plan: Json | null
          question: string
          report: Json | null
          revision: number
          status: string
          step_count: number
          steps: Json
          target_ref: string
          target_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_mode?: string
          confidence?: number | null
          created_at?: string
          error?: string | null
          evidence?: Json
          expires_at?: string | null
          hypotheses?: Json
          id?: string
          lease_id?: string | null
          lease_until?: string | null
          max_steps?: number
          plan?: Json | null
          question: string
          report?: Json | null
          revision?: number
          status?: string
          step_count?: number
          steps?: Json
          target_ref?: string
          target_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          analysis_mode?: string
          confidence?: number | null
          created_at?: string
          error?: string | null
          evidence?: Json
          expires_at?: string | null
          hypotheses?: Json
          id?: string
          lease_id?: string | null
          lease_until?: string | null
          max_steps?: number
          plan?: Json | null
          question?: string
          report?: Json | null
          revision?: number
          status?: string
          step_count?: number
          steps?: Json
          target_ref?: string
          target_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recon_artifacts: {
        Row: {
          comparison_id: string | null
          content: Json
          created_at: string
          id: string
          investigation_id: string
          kind: string
          question: string
          user_id: string
        }
        Insert: {
          comparison_id?: string | null
          content?: Json
          created_at?: string
          id?: string
          investigation_id: string
          kind?: string
          question?: string
          user_id?: string
        }
        Update: {
          comparison_id?: string | null
          content?: Json
          created_at?: string
          id?: string
          investigation_id?: string
          kind?: string
          question?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recon_artifacts_comparison_id_fkey"
            columns: ["comparison_id"]
            isOneToOne: false
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recon_artifacts_investigation_id_fkey"
            columns: ["investigation_id"]
            isOneToOne: false
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
        ]
      }
      recon_preferences: {
        Row: {
          retention_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          retention_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          retention_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      repo_indexes: {
        Row: {
          created_at: string
          files: Json
          investigation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          files?: Json
          investigation_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          files?: Json
          investigation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repo_indexes_investigation_id_fkey"
            columns: ["investigation_id"]
            isOneToOne: true
            referencedRelation: "investigations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_secrets: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recon_claim: {
        Args: { p_id: string; p_lease: string }
        Returns: {
          analysis_mode: string
          confidence: number | null
          created_at: string
          error: string | null
          evidence: Json
          expires_at: string | null
          hypotheses: Json
          id: string
          lease_id: string | null
          lease_until: string | null
          max_steps: number
          plan: Json | null
          question: string
          report: Json | null
          revision: number
          status: string
          step_count: number
          steps: Json
          target_ref: string
          target_type: string
          title: string
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "investigations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      recon_create: {
        Args: {
          p_max_steps: number
          p_payload: Json
          p_question: string
          p_target_ref: string
          p_target_type: string
          p_title: string
        }
        Returns: string
      }
      recon_set_retention: { Args: { p_days: number }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
