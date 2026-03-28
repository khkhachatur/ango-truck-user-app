import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://jurztrpasjgemjacrnad.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cnp0cnBhc2pnZW1qYWNybmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTY5NjAsImV4cCI6MjA4ODUzMjk2MH0.oELODlI7hsboHelTedaA274ayp0YK7xgvHGAeH4cnh4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'shipper' | 'carrier' | 'admin';
  phone_number: string;
  status: string;
  created_at: string;
}

export interface Load {
  id: string;
  shipper_id: string;
  pickup_location: string;
  dropoff_location: string;
  cargo_description: string;
  cargo_type: string;
  weight_kg: number;
  offered_price_aoa: number;
  estimated_price_aoa: number;
  status: 'open' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  is_empty_leg: boolean;
  pod_url: string;
  assigned_driver_id: string;
  scheduled_date: string;
  distance_km: number;
  shipper_notes: string;
  created_at: string;
}

export interface Message {
  id: string;
  load_id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface PriceEstimate {
  base_price: number;
  weight_surcharge: number;
  total_price: number;
  commission: number;
  driver_payout: number;
}
