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
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      daily_introspection: {
        Row: {
          created_at: string | null
          id: string
          mood: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mood?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ebook_documents: {
        Row: {
          content: Json
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mentorships: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          price: number | null
          professional_id: string | null
          service_type: string
          status: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          price?: number | null
          professional_id?: string | null
          service_type: string
          status?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          price?: number | null
          professional_id?: string | null
          service_type?: string
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorships_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_assets: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          target_audience: string | null
          title: string
          type: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          target_audience?: string | null
          title: string
          type: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          target_audience?: string | null
          title?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      platform_events: {
        Row: {
          content_type: string | null
          created_at: string | null
          date: string | null
          description: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          is_pinned: boolean | null
          link: string | null
          location: string | null
          target_audience: string | null
          title: string
          type: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          link?: string | null
          location?: string | null
          target_audience?: string | null
          title: string
          type?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          link?: string | null
          location?: string | null
          target_audience?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      professional_pathways: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          professional_id: string | null
          steps: Json | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          professional_id?: string | null
          steps?: Json | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          professional_id?: string | null
          steps?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_pathways_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_resources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          professional_id: string | null
          target_audience: string | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          professional_id?: string | null
          target_audience?: string | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          professional_id?: string | null
          target_audience?: string | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_resources_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          professional_id: string | null
          quiz_id: string | null
          raw_responses: Json | null
          score: number | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          professional_id?: string | null
          quiz_id?: string | null
          raw_responses?: Json | null
          score?: number | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          professional_id?: string | null
          quiz_id?: string | null
          raw_responses?: Json | null
          score?: number | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_calculated: boolean | null
          metadata: Json | null
          professional_id: string | null
          questions: Json | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_calculated?: boolean | null
          metadata?: Json | null
          professional_id?: string | null
          questions?: Json | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_calculated?: boolean | null
          metadata?: Json | null
          professional_id?: string | null
          questions?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          block_id: string | null
          content: string | null
          created_at: string | null
          ebook_id: string
          id: string
          metadata: Json | null
          type: string
          user_id: string | null
        }
        Insert: {
          block_id?: string | null
          content?: string | null
          created_at?: string | null
          ebook_id: string
          id?: string
          metadata?: Json | null
          type: string
          user_id?: string | null
        }
        Update: {
          block_id?: string | null
          content?: string | null
          created_at?: string | null
          ebook_id?: string
          id?: string
          metadata?: Json | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          last_page: number | null
          lesson_id: string
          module_id: number
          progress_percent: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          last_page?: number | null
          lesson_id: string
          module_id: number
          progress_percent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          last_page?: number | null
          lesson_id?: string
          module_id?: number
          progress_percent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          expires_at: string | null
          full_name: string | null
          id: string
          last_payment_date: string | null
          last_seen_at: string | null
          payment_plan: string | null
          professional_card_details: Json | null
          professional_category: string | null
          professional_data: Json | null
          professional_expires_at: string | null
          professional_status: string | null
          professional_title: string | null
          rating: number | null
          role: string | null
          roles: string[] | null
          services: Json | null
          social_links: Json | null
          social_name: string | null
          specialties: Json | null
          status: string | null
          student_expires_at: string | null
          student_status: string | null
          subscription_status: string | null
          subscription_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          full_name?: string | null
          id: string
          last_payment_date?: string | null
          last_seen_at?: string | null
          payment_plan?: string | null
          professional_card_details?: Json | null
          professional_category?: string | null
          professional_data?: Json | null
          professional_expires_at?: string | null
          professional_status?: string | null
          professional_title?: string | null
          rating?: number | null
          role?: string | null
          roles?: string[] | null
          services?: Json | null
          social_links?: Json | null
          social_name?: string | null
          specialties?: Json | null
          status?: string | null
          student_expires_at?: string | null
          student_status?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          full_name?: string | null
          id?: string
          last_payment_date?: string | null
          last_seen_at?: string | null
          payment_plan?: string | null
          professional_card_details?: Json | null
          professional_category?: string | null
          professional_data?: Json | null
          professional_expires_at?: string | null
          professional_status?: string | null
          professional_title?: string | null
          rating?: number | null
          role?: string | null
          roles?: string[] | null
          services?: Json | null
          social_links?: Json | null
          social_name?: string | null
          specialties?: Json | null
          status?: string | null
          student_expires_at?: string | null
          student_status?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
        }
        Relationships: []
      }
      v2_diagnostic_results: {
        Row: {
          behavioral_profile: string | null
          dominant_category: string | null
          global_score: number | null
          id: string
          intensities: Json | null
          long_term_trend: string | null
          module_result_id: string | null
          secondary_category: string | null
          short_term_trend: string | null
        }
        Insert: {
          behavioral_profile?: string | null
          dominant_category?: string | null
          global_score?: number | null
          id?: string
          intensities?: Json | null
          long_term_trend?: string | null
          module_result_id?: string | null
          secondary_category?: string | null
          short_term_trend?: string | null
        }
        Update: {
          behavioral_profile?: string | null
          dominant_category?: string | null
          global_score?: number | null
          id?: string
          intensities?: Json | null
          long_term_trend?: string | null
          module_result_id?: string | null
          secondary_category?: string | null
          short_term_trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "v2_diagnostic_results_module_result_id_fkey"
            columns: ["module_result_id"]
            isOneToOne: false
            referencedRelation: "v2_module_results"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_insights: {
        Row: {
          created_at: string | null
          description: string
          id: string
          module_id: number | null
          patient_id: string | null
          severity: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          module_id?: number | null
          patient_id?: string | null
          severity?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          module_id?: number | null
          patient_id?: string | null
          severity?: string | null
          type?: string | null
        }
        Relationships: []
      }
      v2_module_quizzes: {
        Row: {
          created_at: string | null
          id: string
          module_id: number
          quiz_id: string | null
          quiz_version: number
          weight_profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_id: number
          quiz_id?: string | null
          quiz_version?: number
          weight_profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          module_id?: number
          quiz_id?: string | null
          quiz_version?: number
          weight_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "v2_module_quizzes_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "v2_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "v2_module_quizzes_weight_profile_id_fkey"
            columns: ["weight_profile_id"]
            isOneToOne: false
            referencedRelation: "v2_weight_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_module_results: {
        Row: {
          created_at: string | null
          id: string
          module_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          module_id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      v2_professional_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          linked_insight_id: string | null
          module_id: number | null
          patient_id: string | null
          professional_id: string | null
          tags: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          linked_insight_id?: string | null
          module_id?: number | null
          patient_id?: string | null
          professional_id?: string | null
          tags?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          linked_insight_id?: string | null
          module_id?: number | null
          patient_id?: string | null
          professional_id?: string | null
          tags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "v2_professional_notes_linked_insight_id_fkey"
            columns: ["linked_insight_id"]
            isOneToOne: false
            referencedRelation: "v2_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_quiz_question_options: {
        Row: {
          id: string
          question_id: string | null
          text: string
          weight_key: string | null
          weight_value: number | null
        }
        Insert: {
          id?: string
          question_id?: string | null
          text: string
          weight_key?: string | null
          weight_value?: number | null
        }
        Update: {
          id?: string
          question_id?: string | null
          text?: string
          weight_key?: string | null
          weight_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "v2_quiz_question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v2_quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_quiz_questions: {
        Row: {
          id: string
          order_index: number
          quiz_id: string | null
          text: string
          type: string
        }
        Insert: {
          id?: string
          order_index?: number
          quiz_id?: string | null
          text: string
          type: string
        }
        Update: {
          id?: string
          order_index?: number
          quiz_id?: string | null
          text?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "v2_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_quizzes: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          professional_id: string | null
          title: string
          version: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          professional_id?: string | null
          title: string
          version?: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          professional_id?: string | null
          title?: string
          version?: number
        }
        Relationships: []
      }
      v2_user_answers: {
        Row: {
          id: string
          option_id: string | null
          question_id: string | null
          response_id: string | null
          text_response: string | null
          weight_applied: Json | null
        }
        Insert: {
          id?: string
          option_id?: string | null
          question_id?: string | null
          response_id?: string | null
          text_response?: string | null
          weight_applied?: Json | null
        }
        Update: {
          id?: string
          option_id?: string | null
          question_id?: string | null
          response_id?: string | null
          text_response?: string | null
          weight_applied?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "v2_user_answers_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "v2_quiz_question_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "v2_user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v2_quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "v2_user_answers_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "v2_user_quiz_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_user_quiz_responses: {
        Row: {
          created_at: string | null
          id: string
          module_quiz_id: string | null
          quiz_version: number
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_quiz_id?: string | null
          quiz_version?: number
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          module_quiz_id?: string | null
          quiz_version?: number
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "v2_user_quiz_responses_module_quiz_id_fkey"
            columns: ["module_quiz_id"]
            isOneToOne: false
            referencedRelation: "v2_module_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_weight_profile_keys: {
        Row: {
          id: string
          profile_id: string | null
          weight_key: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          weight_key: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          weight_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_weight_profile_keys_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v2_weight_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_weight_profiles: {
        Row: {
          created_at: string | null
          id: string
          module_id: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_id: number
        }
        Update: {
          created_at?: string | null
          id?: string
          module_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
