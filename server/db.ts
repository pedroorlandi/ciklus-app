import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema.js";
import { SupabaseRestClient } from "./supabase-client";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// PRODUCTION CONFIGURATION: Using Supabase as database
// Check if DATABASE_URL is already pointing to Supabase
const isSupabaseUrl = process.env.DATABASE_URL?.includes('supabase.co') || 
                      process.env.DATABASE_URL?.includes('amazonaws.com');

if (isSupabaseUrl) {
  console.log('[DB] ✅ SUPABASE DETECTED - Using DATABASE_URL Supabase connection');
  console.log('[DB] 🚀 Architecture: Supabase → GitHub → Replit');
} else {
  console.log('[DB] 📋 Using local PostgreSQL - DATABASE_URL configured');
}

// Use the configured DATABASE_URL directly
const connectionString = process.env.DATABASE_URL;

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