export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          is_active: boolean
          key_name: string
          last_used_at: string | null
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          is_active?: boolean
          key_name: string
          last_used_at?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          is_active?: boolean
          key_name?: string
          last_used_at?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          batch_id: string | null
          completed_at: string | null
          created_at: string | null
          delivered_count: number | null
          description: string | null
          failed_count: number | null
          id: string
          message: string
          name: string
          segment_id: string | null
          sent_at: string | null
          sent_count: number | null
          status: string
          user_id: string
        }
        Insert: {
          batch_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivered_count?: number | null
          description?: string | null
          failed_count?: number | null
          id?: string
          message: string
          name: string
          segment_id?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          user_id: string
        }
        Update: {
          batch_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivered_count?: number | null
          description?: string | null
          failed_count?: number | null
          id?: string
          message?: string
          name?: string
          segment_id?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_logs: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          customer_id: string | null
          delivered_at: string | null
          delivery_attempts: number | null
          error_message: string | null
          id: string
          sent_at: string | null
          status: string
          updated_at: string | null
          user_id: string
          vendor_message_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status: string
          updated_at?: string | null
          user_id: string
          vendor_message_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          vendor_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_order_date: string | null
          last_visit_date: string | null
          name: string
          phone: string | null
          total_orders: number | null
          total_spend: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_order_date?: string | null
          last_visit_date?: string | null
          name: string
          phone?: string | null
          total_orders?: number | null
          total_spend?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_order_date?: string | null
          last_visit_date?: string | null
          name?: string
          phone?: string | null
          total_orders?: number | null
          total_spend?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      delivery_receipts: {
        Row: {
          communication_log_id: string
          created_at: string
          delivered_at: string | null
          delivery_status: string
          error_message: string | null
          id: string
          vendor_response: Json | null
        }
        Insert: {
          communication_log_id: string
          created_at?: string
          delivered_at?: string | null
          delivery_status: string
          error_message?: string | null
          id?: string
          vendor_response?: Json | null
        }
        Update: {
          communication_log_id?: string
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string
          error_message?: string | null
          id?: string
          vendor_response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_receipts_communication_log_id_fkey"
            columns: ["communication_log_id"]
            isOneToOne: false
            referencedRelation: "communication_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          category: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          image_url: string | null
          original_url: string | null
          price: string | null
          time: string | null
          title: string
          venue: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          original_url?: string | null
          price?: string | null
          time?: string | null
          title: string
          venue?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          original_url?: string | null
          price?: string | null
          time?: string | null
          title?: string
          venue?: string | null
        }
        Relationships: []
      }
      order_products: {
        Row: {
          created_at: string | null
          id: string
          name: string
          order_id: string | null
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          order_id?: string | null
          price: number
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          order_id?: string | null
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string | null
          id: string
          order_date: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          order_date: string
          status: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          order_date?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      segments: {
        Row: {
          created_at: string | null
          customer_count: number | null
          description: string | null
          id: string
          name: string
          rules: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_count?: number | null
          description?: string | null
          id?: string
          name: string
          rules: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_count?: number | null
          description?: string | null
          id?: string
          name?: string
          rules?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_emails: {
        Row: {
          created_at: string | null
          email: string
          event_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          event_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          event_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_emails_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_matching_customers: {
        Args: { p_segment_rules: Json }
        Returns: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_order_date: string | null
          last_visit_date: string | null
          name: string
          phone: string | null
          total_orders: number | null
          total_spend: number | null
          updated_at: string | null
          user_id: string
        }[]
      }
      simulate_campaign_delivery: {
        Args: { p_campaign_id: string }
        Returns: undefined
      }
      update_campaign_stats: {
        Args: { p_campaign_id: string; p_status: string }
        Returns: undefined
      }
      update_customer_spend: {
        Args: { p_customer_id: string; p_amount: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
