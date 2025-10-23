export type User = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  date: string;
  total_cost: number | null;
  is_local: boolean;
  created_at: string;
  updated_at: string;
};

export type Participant = {
  id: string;
  event_id: string;
  name: string;
  user_id: string | null;
  created_at: string;
};

export type Contribution = {
  id: string;
  participant_id: string;
  description: string;
  amount: number;
  created_at: string;
  updated_at: string;
};

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
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;
      };
      participants: {
        Row: Participant;
        Insert: Omit<Participant, 'id' | 'created_at'>;
        Update: Partial<Omit<Participant, 'id' | 'created_at'>>;
      };
      contributions: {
        Row: Contribution;
        Insert: Omit<Contribution, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contribution, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      get_email_by_username: {
        Args: { p_username: string };
        Returns: string | null;
      };
    };
    Enums: {
      [_ in never]: never
    };
  };
} 