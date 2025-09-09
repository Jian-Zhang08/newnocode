import { createClient } from '@supabase/supabase-js'

let supabase = null;

// Initialize Supabase client with configuration
const initializeSupabase = async () => {
    try {
        // Load configuration from app-config.json
        const response = await fetch('/app-config.json');
        const config = await response.json();

        // Check for Supabase config in the new structure first
        let supabaseUrl, supabaseAnonKey;

        if (config.user?.selections?.supabaseConfig && !config.user.selections.supabaseConfig.useBuiltIn) {
            supabaseUrl = config.user.selections.supabaseConfig.url;
            supabaseAnonKey = config.user.selections.supabaseConfig.anonKey;
        } else if (config.supabase && config.supabase.enabled) {
            supabaseUrl = config.supabase.url;
            supabaseAnonKey = config.supabase.anonKey;
        }

        if (supabaseUrl && supabaseAnonKey &&
            supabaseUrl !== 'https://your-project-id.supabase.co' &&
            supabaseAnonKey !== 'your-anon-key-here') {

            supabase = createClient(supabaseUrl, supabaseAnonKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            });

            console.log('Supabase initialized with app-config.json:', supabaseUrl);
            return supabase;
        } else {
            console.warn('Supabase configuration not properly set in app-config.json');
        }

        // Fallback to environment variables if config is not available
        const envUrl = import.meta.env.VITE_SUPABASE_URL;
        const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (envUrl && envKey) {
            supabase = createClient(envUrl, envKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            });
            console.log('Supabase initialized with environment variables');
            return supabase;
        }

        console.error('Supabase configuration not found in app-config.json or environment variables');
        return null;

    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        return null;
    }
};

// Get or initialize Supabase client
export const getSupabase = async () => {
    if (!supabase) {
        supabase = await initializeSupabase();
    }
    return supabase;
};

// Export a default instance (will be null until initialized)
export { supabase };
