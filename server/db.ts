import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema.js";
import { SupabaseRestClient } from "./supabase-client";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// PRODUCTION CONFIGURATION: Using ONLY Supabase as database
// Local PostgreSQL no longer used - Supabase is the single source of truth
const supabasePostgresUrl = "postgresql://postgres:BxSG17co65i7xAzm@db.xjaoydofavoyuxosqaua.supabase.co:5432/postgres";

// Primary connection to Supabase (REST API fallback if direct connection fails)
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  console.log('[DB] ✅ SUPABASE ONLY - Production database configured');
  console.log('[DB] 🚀 Architecture: Supabase → GitHub → Replit');
  // Try Supabase direct connection first
  let connectionString = supabasePostgresUrl;
} else {
  console.log('[DB] ⚠️ Supabase credentials not found - using local PostgreSQL temporarily');
  console.log('[DB] 📋 Configure SUPABASE_URL and SUPABASE_SERVICE_KEY to use production database');
}

// Use Supabase PostgreSQL URL when available, otherwise fallback to local
let connectionString = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) 
  ? supabasePostgresUrl 
  : process.env.DATABASE_URL;

export const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle({ client: pool, schema });

// Initialize Supabase REST client as fallback
export const supabaseClient = new SupabaseRestClient();

// Test Supabase connection on startup
supabaseClient.testConnection().then(isConnected => {
  if (isConnected) {
    console.log('[SUPABASE] ✅ REST API connection established');
  } else {
    console.log('[SUPABASE] ❌ REST API connection failed');
  }
});