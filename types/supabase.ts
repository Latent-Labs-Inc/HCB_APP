export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attorney_emails: {
        Row: {
          email: string
          user_id: string
        }
        Insert: {
          email: string
          user_id: string
        }
        Update: {
          email?: string
          user_id?: string
        }
      }
      bad_numbers: {
        Row: {
          number: string
          user_id: string
        }
        Insert: {
          number: string
          user_id: string
        }
        Update: {
          number?: string
          user_id?: string
        }
      }
      incoming_messages: {
        Row: {
          created_at: string | null
          direction: string | null
          errorCode: string | null
          errorMessage: string | null
          from: string | null
          lead_id: string | null
          message: string | null
          propertyAddress: Json | null
          sent_at: string | null
          sid: string
          status: string | null
          to: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          direction?: string | null
          errorCode?: string | null
          errorMessage?: string | null
          from?: string | null
          lead_id?: string | null
          message?: string | null
          propertyAddress?: Json | null
          sent_at?: string | null
          sid: string
          status?: string | null
          to?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          direction?: string | null
          errorCode?: string | null
          errorMessage?: string | null
          from?: string | null
          lead_id?: string | null
          message?: string | null
          propertyAddress?: Json | null
          sent_at?: string | null
          sid?: string
          status?: string | null
          to?: string | null
          updated_at?: string | null
          user_id?: string
        }
      }
      leads: {
        Row: {
          created_at: string | null
          email: string[] | null
          emailed: boolean
          favorite: boolean
          favoritePhone: string | null
          fileDate: string | null
          landline: string[] | null
          lead_id: string
          leadProvider: string
          leadType: string
          mailed: boolean
          mailingAddress: Json | null
          modified_at: string | null
          ownerFirstName: string | null
          ownerLastName: string | null
          prAddress: Json | null
          prFirstName: string | null
          prLastName: string | null
          propertyAddress: Json | null
          texted: boolean
          user_id: string
          wireless: string[] | null
        }
        Insert: {
          created_at?: string | null
          email?: string[] | null
          emailed?: boolean
          favorite?: boolean
          favoritePhone?: string | null
          fileDate?: string | null
          landline?: string[] | null
          lead_id: string
          leadProvider: string
          leadType: string
          mailed?: boolean
          mailingAddress?: Json | null
          modified_at?: string | null
          ownerFirstName?: string | null
          ownerLastName?: string | null
          prAddress?: Json | null
          prFirstName?: string | null
          prLastName?: string | null
          propertyAddress?: Json | null
          texted?: boolean
          user_id: string
          wireless?: string[] | null
        }
        Update: {
          created_at?: string | null
          email?: string[] | null
          emailed?: boolean
          favorite?: boolean
          favoritePhone?: string | null
          fileDate?: string | null
          landline?: string[] | null
          lead_id?: string
          leadProvider?: string
          leadType?: string
          mailed?: boolean
          mailingAddress?: Json | null
          modified_at?: string | null
          ownerFirstName?: string | null
          ownerLastName?: string | null
          prAddress?: Json | null
          prFirstName?: string | null
          prLastName?: string | null
          propertyAddress?: Json | null
          texted?: boolean
          user_id?: string
          wireless?: string[] | null
        }
      }
      probates: {
        Row: {
          address1: string
          address2: string | null
          attorney_address1: string
          attorney_address2: string | null
          attorney_city: string
          attorney_email: string
          attorney_first: string
          attorney_last: string
          attorney_phone: string
          attorney_state: string
          attorney_zip: string
          city: string
          created_at: string | null
          deceased_first: string | null
          deceased_last: string | null
          filing_date: string
          id: string
          modified_at: string | null
          pr_address1: string | null
          pr_address2: string | null
          pr_city: string | null
          pr_first: string
          pr_last: string
          pr_phone: string | null
          pr_state: string | null
          pr_zip: string | null
          state: string
          user_id: string
          zip: string
        }
        Insert: {
          address1: string
          address2?: string | null
          attorney_address1: string
          attorney_address2?: string | null
          attorney_city: string
          attorney_email: string
          attorney_first: string
          attorney_last: string
          attorney_phone: string
          attorney_state: string
          attorney_zip: string
          city: string
          created_at?: string | null
          deceased_first?: string | null
          deceased_last?: string | null
          filing_date: string
          id: string
          modified_at?: string | null
          pr_address1?: string | null
          pr_address2?: string | null
          pr_city?: string | null
          pr_first: string
          pr_last: string
          pr_phone?: string | null
          pr_state?: string | null
          pr_zip?: string | null
          state: string
          user_id: string
          zip: string
        }
        Update: {
          address1?: string
          address2?: string | null
          attorney_address1?: string
          attorney_address2?: string | null
          attorney_city?: string
          attorney_email?: string
          attorney_first?: string
          attorney_last?: string
          attorney_phone?: string
          attorney_state?: string
          attorney_zip?: string
          city?: string
          created_at?: string | null
          deceased_first?: string | null
          deceased_last?: string | null
          filing_date?: string
          id?: string
          modified_at?: string | null
          pr_address1?: string | null
          pr_address2?: string | null
          pr_city?: string | null
          pr_first?: string
          pr_last?: string
          pr_phone?: string | null
          pr_state?: string | null
          pr_zip?: string | null
          state?: string
          user_id?: string
          zip?: string
        }
      }
      profiles: {
        Row: {
          admin: boolean | null
          created_at: string | null
          email: string | null
          modified_at: string | null
          phoneNumbers: string[] | null
          type: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          admin?: boolean | null
          created_at?: string | null
          email?: string | null
          modified_at?: string | null
          phoneNumbers?: string[] | null
          type?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          admin?: boolean | null
          created_at?: string | null
          email?: string | null
          modified_at?: string | null
          phoneNumbers?: string[] | null
          type?: string | null
          user_id?: string
          username?: string | null
        }
      }
      sent_messages: {
        Row: {
          created_at: string | null
          direction: string | null
          errorCode: string | null
          errorMessage: string | null
          from: string | null
          lead_id: string | null
          message: string | null
          propertyAddress: Json | null
          sent_at: string | null
          sid: string
          status: string | null
          to: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          direction?: string | null
          errorCode?: string | null
          errorMessage?: string | null
          from?: string | null
          lead_id?: string | null
          message?: string | null
          propertyAddress?: Json | null
          sent_at?: string | null
          sid: string
          status?: string | null
          to?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          direction?: string | null
          errorCode?: string | null
          errorMessage?: string | null
          from?: string | null
          lead_id?: string | null
          message?: string | null
          propertyAddress?: Json | null
          sent_at?: string | null
          sid?: string
          status?: string | null
          to?: string | null
          updated_at?: string | null
          user_id?: string
        }
      }
      templates: {
        Row: {
          created_at: string | null
          message: string | null
          modified_at: string | null
          name: string
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          message?: string | null
          modified_at?: string | null
          name: string
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          message?: string | null
          modified_at?: string | null
          name?: string
          template_id?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_chart_data: {
        Args: Record<PropertyKey, never>
        Returns: number[]
      }
      get_chart_data_texted: {
        Args: Record<PropertyKey, never>
        Returns: number[]
      }
      get_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
