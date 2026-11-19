export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          username: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          role?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      community_prompts: {
        Row: {
          id: string
          user_id: string | null
          author_name: string
          title: string
          description: string
          template: string
          category_id: string
          tags: string[]
          target_service: string
          upvotes: number
          status: 'approved' | 'pending' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          author_name?: string
          title: string
          description: string
          template: string
          category_id?: string
          tags?: string[]
          target_service?: string
          upvotes?: number
          status?: 'approved' | 'pending' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          author_name?: string
          title?: string
          description?: string
          template?: string
          category_id?: string
          tags?: string[]
          target_service?: string
          upvotes?: number
          status?: 'approved' | 'pending' | 'rejected'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'community_prompts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          item_type: 'skill' | 'prompt' | 'resource'
          item_id: string
          item_title: string
          item_slug: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_type: 'skill' | 'prompt' | 'resource'
          item_id: string
          item_title: string
          item_slug: string
          category_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_type?: 'skill' | 'prompt' | 'resource'
          item_id?: string
          item_title?: string
          item_slug?: string
          category_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookmarks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      skill_reviews: {
        Row: {
          id: string
          user_id: string | null
          user_name: string
          skill_slug: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_name?: string
          skill_slug: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_name?: string
          skill_slug?: string
          rating?: number
          comment?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skill_reviews_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      workspace_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          workflow_id: string
          model_id: string
          inputs_json: Json
          result_text: string
          usage_json: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          workflow_id: string
          model_id: string
          inputs_json?: Json
          result_text?: string
          usage_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          workflow_id?: string
          model_id?: string
          inputs_json?: Json
          result_text?: string
          usage_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workspace_sessions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      workspace_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          model_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          model_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          model_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workspace_messages_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'workspace_sessions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'workspace_messages_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      personal_templates: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          template: string
          category_id: string
          workflow_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          template: string
          category_id?: string
          workflow_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          template?: string
          category_id?: string
          workflow_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'personal_templates_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
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
