// Supabase REST API client para contornar bloqueio de conexão PostgreSQL direta
export class SupabaseRestClient {
  private baseUrl: string;
  private apiKey: string;
  private serviceKey: string;

  constructor() {
    this.baseUrl = process.env.SUPABASE_URL || 'https://xjaoydofavoyuxosqaua.supabase.co';
    this.apiKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYW95ZG9mYXZveXV4b3NxYXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODYxOTcsImV4cCI6MjA2ODQ2MjE5N30.3dNR1mZOBGtir9vCOEBj7hTrwX796ChK1w1SGtXRJV4';
    this.serviceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYW95ZG9mYXZveXV4b3NxYXVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg4NjE5NywiZXhwIjoyMDY4NDYyMTk3fQ.sA1gessxlYMgnLuWE0KJrXyqK1mcAl4HE6p76kwSWUk';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/rest/v1/${endpoint}`;
    
    const defaultHeaders = {
      'apikey': this.serviceKey,
      'Authorization': `Bearer ${this.serviceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/v1/`, {
        headers: {
          'apikey': this.serviceKey,
          'Authorization': `Bearer ${this.serviceKey}`
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  // Get all tables
  async getTables(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/v1/`, {
        headers: {
          'apikey': this.serviceKey,
          'Authorization': `Bearer ${this.serviceKey}`
        }
      });
      const data = await response.json();
      return data.definitions ? Object.keys(data.definitions) : [];
    } catch (error) {
      console.error('Error getting tables:', error);
      return [];
    }
  }

  // Generic select
  async select(table: string, query: string = ''): Promise<any[]> {
    return this.makeRequest(`${table}?${query}`);
  }

  // Generic insert
  async insert(table: string, data: any): Promise<any> {
    return this.makeRequest(table, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Generic update
  async update(table: string, data: any, where: string): Promise<any> {
    return this.makeRequest(`${table}?${where}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // Generic delete
  async delete(table: string, where: string): Promise<any> {
    return this.makeRequest(`${table}?${where}`, {
      method: 'DELETE'
    });
  }
}