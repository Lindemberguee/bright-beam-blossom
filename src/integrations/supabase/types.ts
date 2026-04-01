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
  public: {
    Tables: {
      campaign_contacts: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          read_at: string | null
          responded_at: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          read_at?: string | null
          responded_at?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          read_at?: string | null
          responded_at?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          completed_at: string | null
          created_at: string
          delivered_count: number | null
          description: string | null
          failed_count: number | null
          filters: Json | null
          id: string
          media_type: string | null
          media_url: string | null
          message_template: string | null
          message_variables: Json | null
          name: string
          organization_id: string
          read_count: number | null
          response_count: number | null
          scheduled_at: string | null
          sent_count: number | null
          started_at: string | null
          status: string
          target_count: number | null
          type: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          delivered_count?: number | null
          description?: string | null
          failed_count?: number | null
          filters?: Json | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_template?: string | null
          message_variables?: Json | null
          name: string
          organization_id: string
          read_count?: number | null
          response_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string
          target_count?: number | null
          type?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          delivered_count?: number | null
          description?: string | null
          failed_count?: number | null
          filters?: Json | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_template?: string | null
          message_variables?: Json | null
          name?: string
          organization_id?: string
          read_count?: number | null
          response_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string
          target_count?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_events: {
        Row: {
          connection_id: string
          created_at: string
          details: string | null
          event_type: string
          id: string
          metadata: Json | null
          severity: string
          title: string
          user_id: string | null
        }
        Insert: {
          connection_id: string
          created_at?: string
          details?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          severity?: string
          title: string
          user_id?: string | null
        }
        Update: {
          connection_id?: string
          created_at?: string
          details?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          severity?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connection_events_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          account_name: string | null
          assigned_flow_id: string | null
          assigned_queue: string | null
          assigned_team: string | null
          available_for_attendance: boolean
          available_for_campaigns: boolean
          available_for_warming: boolean
          avatar_url: string | null
          channel_type: string
          connected_at: string | null
          created_at: string
          health_score: number
          id: string
          identifier: string | null
          last_activity_at: string | null
          last_sync_at: string | null
          metadata: Json | null
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          session_data: Json | null
          session_name: string | null
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          account_name?: string | null
          assigned_flow_id?: string | null
          assigned_queue?: string | null
          assigned_team?: string | null
          available_for_attendance?: boolean
          available_for_campaigns?: boolean
          available_for_warming?: boolean
          avatar_url?: string | null
          channel_type?: string
          connected_at?: string | null
          created_at?: string
          health_score?: number
          id?: string
          identifier?: string | null
          last_activity_at?: string | null
          last_sync_at?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          session_data?: Json | null
          session_name?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          account_name?: string | null
          assigned_flow_id?: string | null
          assigned_queue?: string | null
          assigned_team?: string | null
          available_for_attendance?: boolean
          available_for_campaigns?: boolean
          available_for_warming?: boolean
          avatar_url?: string | null
          channel_type?: string
          connected_at?: string | null
          created_at?: string
          health_score?: number
          id?: string
          identifier?: string | null
          last_activity_at?: string | null
          last_sync_at?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          session_data?: Json | null
          session_name?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_assigned_flow_id_fkey"
            columns: ["assigned_flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_list_members: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          list_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          list_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_list_members_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_list_members_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "contact_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_lists: {
        Row: {
          contact_count: number | null
          created_at: string
          description: string | null
          filters: Json
          id: string
          is_dynamic: boolean
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          contact_count?: number | null
          created_at?: string
          description?: string | null
          filters?: Json
          id?: string
          is_dynamic?: boolean
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          contact_count?: number | null
          created_at?: string
          description?: string | null
          filters?: Json
          id?: string
          is_dynamic?: boolean
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_lists_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          assigned_to: string | null
          avatar_url: string | null
          company: string | null
          created_at: string
          custom_fields: Json | null
          email: string | null
          id: string
          last_interaction: string | null
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          score: number | null
          source: string | null
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          id?: string
          last_interaction?: string | null
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          id?: string
          last_interaction?: string | null
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assigned_to: string | null
          channel: string
          contact_id: string
          created_at: string
          department: string | null
          id: string
          is_pinned: boolean | null
          last_message: string | null
          last_message_at: string | null
          organization_id: string
          priority: string
          status: string
          tags: string[] | null
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          channel?: string
          contact_id: string
          created_at?: string
          department?: string | null
          id?: string
          is_pinned?: boolean | null
          last_message?: string | null
          last_message_at?: string | null
          organization_id: string
          priority?: string
          status?: string
          tags?: string[] | null
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          channel?: string
          contact_id?: string
          created_at?: string
          department?: string | null
          id?: string
          is_pinned?: boolean | null
          last_message?: string | null
          last_message_at?: string | null
          organization_id?: string
          priority?: string
          status?: string
          tags?: string[] | null
          unread_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_edges: {
        Row: {
          animated: boolean | null
          created_at: string
          edge_id: string
          flow_id: string
          id: string
          label: string | null
          source_handle: string | null
          source_node: string
          target_node: string
        }
        Insert: {
          animated?: boolean | null
          created_at?: string
          edge_id: string
          flow_id: string
          id?: string
          label?: string | null
          source_handle?: string | null
          source_node: string
          target_node: string
        }
        Update: {
          animated?: boolean | null
          created_at?: string
          edge_id?: string
          flow_id?: string
          id?: string
          label?: string | null
          source_handle?: string | null
          source_node?: string
          target_node?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_edges_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_nodes: {
        Row: {
          created_at: string
          data: Json
          flow_id: string
          id: string
          node_id: string
          position_x: number
          position_y: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          flow_id: string
          id?: string
          node_id: string
          position_x?: number
          position_y?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          flow_id?: string
          id?: string
          node_id?: string
          position_x?: number
          position_y?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_nodes_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      flows: {
        Row: {
          created_at: string
          description: string | null
          execution_count: number | null
          folder: string | null
          id: string
          name: string
          organization_id: string
          settings: Json | null
          status: string
          success_rate: number | null
          trigger_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          execution_count?: number | null
          folder?: string | null
          id?: string
          name: string
          organization_id: string
          settings?: Json | null
          status?: string
          success_rate?: number | null
          trigger_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          execution_count?: number | null
          folder?: string | null
          id?: string
          name?: string
          organization_id?: string
          settings?: Json | null
          status?: string
          success_rate?: number | null
          trigger_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          sender_id: string | null
          sender_type: string
          status: string | null
          type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_id?: string | null
          sender_type: string
          status?: string | null
          type?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_id?: string | null
          sender_type?: string
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      number_events: {
        Row: {
          created_at: string
          details: string | null
          event_type: string
          id: string
          metadata: Json | null
          number_id: string
          severity: string
          title: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          number_id: string
          severity?: string
          title: string
        }
        Update: {
          created_at?: string
          details?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          number_id?: string
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "number_events_number_id_fkey"
            columns: ["number_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          plan: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          plan?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          plan?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      pipeline_cards: {
        Row: {
          assigned_to: string | null
          column_id: string
          contact_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          position: number
          priority: string
          tags: string[] | null
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          column_id: string
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          position?: number
          priority?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          column_id?: string
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          position?: number
          priority?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_cards_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "pipeline_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_cards_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_columns: {
        Row: {
          color: string | null
          created_at: string
          id: string
          pipeline_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          pipeline_id: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          pipeline_id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_columns_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      pipelines: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipelines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_organization_id: string | null
          full_name: string
          id: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_organization_id?: string | null
          full_name: string
          id: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_organization_id?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_organization_id_fkey"
            columns: ["current_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      warming_phases: {
        Row: {
          created_at: string
          daily_limit: number
          description: string | null
          duration_days: number
          hourly_limit: number
          id: string
          message_interval_seconds: number
          min_response_rate: number | null
          name: string
          phase_number: number
          plan_id: string
          priority_contacts_only: boolean
          target_stage: string
        }
        Insert: {
          created_at?: string
          daily_limit?: number
          description?: string | null
          duration_days?: number
          hourly_limit?: number
          id?: string
          message_interval_seconds?: number
          min_response_rate?: number | null
          name: string
          phase_number?: number
          plan_id: string
          priority_contacts_only?: boolean
          target_stage?: string
        }
        Update: {
          created_at?: string
          daily_limit?: number
          description?: string | null
          duration_days?: number
          hourly_limit?: number
          id?: string
          message_interval_seconds?: number
          min_response_rate?: number | null
          name?: string
          phase_number?: number
          plan_id?: string
          priority_contacts_only?: boolean
          target_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "warming_phases_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "warming_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      warming_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean
          name: string
          organization_id: string
          total_duration_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          organization_id: string
          total_duration_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          organization_id?: string
          total_duration_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "warming_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_numbers: {
        Row: {
          active_plan_id: string | null
          auto_pause_enabled: boolean
          avg_response_time_seconds: number | null
          connected_at: string | null
          connection_status: string
          created_at: string
          current_daily_received: number
          current_daily_responded: number
          current_daily_sent: number
          current_phase: number
          daily_limit: number
          health_score: number
          hourly_limit: number
          id: string
          is_paused: boolean
          last_activity_at: string | null
          message_interval_seconds: number
          metadata: Json | null
          organization_id: string
          pause_reason: string | null
          phone: string
          response_rate: number
          send_window_end: string | null
          send_window_start: string | null
          session_name: string
          stage: string
          total_received: number
          total_responded: number
          total_sent: number
          updated_at: string
        }
        Insert: {
          active_plan_id?: string | null
          auto_pause_enabled?: boolean
          avg_response_time_seconds?: number | null
          connected_at?: string | null
          connection_status?: string
          created_at?: string
          current_daily_received?: number
          current_daily_responded?: number
          current_daily_sent?: number
          current_phase?: number
          daily_limit?: number
          health_score?: number
          hourly_limit?: number
          id?: string
          is_paused?: boolean
          last_activity_at?: string | null
          message_interval_seconds?: number
          metadata?: Json | null
          organization_id: string
          pause_reason?: string | null
          phone: string
          response_rate?: number
          send_window_end?: string | null
          send_window_start?: string | null
          session_name: string
          stage?: string
          total_received?: number
          total_responded?: number
          total_sent?: number
          updated_at?: string
        }
        Update: {
          active_plan_id?: string | null
          auto_pause_enabled?: boolean
          avg_response_time_seconds?: number | null
          connected_at?: string | null
          connection_status?: string
          created_at?: string
          current_daily_received?: number
          current_daily_responded?: number
          current_daily_sent?: number
          current_phase?: number
          daily_limit?: number
          health_score?: number
          hourly_limit?: number
          id?: string
          is_paused?: boolean
          last_activity_at?: string | null
          message_interval_seconds?: number
          metadata?: Json | null
          organization_id?: string
          pause_reason?: string | null
          phone?: string
          response_rate?: number
          send_window_end?: string | null
          send_window_start?: string | null
          session_name?: string
          stage?: string
          total_received?: number
          total_responded?: number
          total_sent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_numbers_active_plan_id_fkey"
            columns: ["active_plan_id"]
            isOneToOne: false
            referencedRelation: "warming_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_numbers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_org_id: { Args: never; Returns: string }
      is_org_admin: { Args: { _organization_id: string }; Returns: boolean }
      is_org_member: { Args: { _organization_id: string }; Returns: boolean }
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
  public: {
    Enums: {},
  },
} as const
