// Tipus escrits a mà seguint schema.sql, perquè encara no hi ha un projecte
// Supabase real per generar-los automàticament.
//
// EN QUANT CREÏS EL PROJECTE SUPABASE I APLIQUIS schema.sql:
//   npm run gen:types
// … i substitueix aquest fitxer sencer pel resultat. No el mantinguis a mà
// un cop tinguis el projecte real, per evitar que es desincronitzi de l'esquema.

export type UserRole = "therapist" | "parent";
export type PatientStatus = "active" | "inactive";
export type GoalStatus = "active" | "achieved" | "paused";
export type AssignmentStatus = "pending" | "in_progress" | "completed";
export type ReportStatus = "draft" | "reviewed" | "final";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          phone: string | null;
          locale: "ca" | "es";
          consent_accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          full_name: string;
          phone?: string | null;
          locale?: "ca" | "es";
          consent_accepted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      patients: {
        Row: {
          id: string;
          therapist_id: string;
          first_name: string;
          last_name: string;
          birth_date: string;
          diagnosis: string | null;
          notes: string | null;
          preferred_language: "ca" | "es" | null;
          status: PatientStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          therapist_id: string;
          first_name: string;
          last_name: string;
          birth_date: string;
          diagnosis?: string | null;
          notes?: string | null;
          preferred_language?: "ca" | "es" | null;
          status?: PatientStatus;
        };
        Update: Partial<Database["public"]["Tables"]["patients"]["Insert"]>;
        Relationships: [];
      };
      patient_guardians: {
        Row: { patient_id: string; parent_id: string };
        Insert: { patient_id: string; parent_id: string };
        Update: Partial<{ patient_id: string; parent_id: string }>;
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          patient_id: string;
          title: string;
          description: string | null;
          start_date: string;
          status: GoalStatus;
          progress_pct: number;
          language: "ca" | "es";
          source: "manual" | "ai_suggested";
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          title: string;
          description?: string | null;
          start_date?: string;
          status?: GoalStatus;
          progress_pct?: number;
          language?: "ca" | "es";
          source?: "manual" | "ai_suggested";
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Insert"]>;
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          therapist_id: string;
          title: string;
          description: string | null;
          estimated_minutes: number | null;
          recommended_frequency: string | null;
          pdf_path: string | null;
          language: "ca" | "es";
          source: "manual" | "ai_suggested";
          created_at: string;
        };
        Insert: {
          id?: string;
          therapist_id: string;
          title: string;
          description?: string | null;
          estimated_minutes?: number | null;
          recommended_frequency?: string | null;
          pdf_path?: string | null;
          language?: "ca" | "es";
          source?: "manual" | "ai_suggested";
        };
        Update: Partial<Database["public"]["Tables"]["exercises"]["Insert"]>;
        Relationships: [];
      };
      exercise_assignments: {
        Row: {
          id: string;
          patient_id: string;
          exercise_id: string;
          goal_id: string | null;
          assigned_date: string;
          status: AssignmentStatus;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          exercise_id: string;
          goal_id?: string | null;
          assigned_date?: string;
          status?: AssignmentStatus;
        };
        Update: Partial<
          Database["public"]["Tables"]["exercise_assignments"]["Insert"]
        >;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          patient_id: string;
          uploaded_by: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          uploaded_by: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
        Relationships: [];
      };
      history_events: {
        Row: {
          id: string;
          patient_id: string;
          event_type: string;
          payload: Record<string, unknown> | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          event_type: string;
          payload?: Record<string, unknown> | null;
          created_by?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["history_events"]["Insert"]
        >;
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          patient_id: string;
          generated_by: string | null;
          content: Record<string, unknown>;
          status: ReportStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          generated_by?: string | null;
          content: Record<string, unknown>;
          status?: ReportStatus;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      mark_assignment_completed: {
        Args: { assignment_id: string };
        Returns: void;
      };
      link_guardian_by_email: {
        Args: { p_patient_id: string; p_email: string };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
