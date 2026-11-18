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
          created_at?: string
          updated_at?: string
        }
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
      }
    }
  }
}
