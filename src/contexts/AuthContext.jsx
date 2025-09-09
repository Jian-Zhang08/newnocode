import { createContext, useContext, useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [supabase, setSupabase] = useState(null);

    // Initialize Supabase and check for existing session
    useEffect(() => {
        const initAuth = async () => {
            try {
                const supabaseClient = await getSupabase();
                setSupabase(supabaseClient);

                if (supabaseClient) {
                    // Get initial session
                    const { data: { session } } = await supabaseClient.auth.getSession();
                    setUser(session?.user ?? null);

                    // Listen for auth changes
                    const {
                        data: { subscription },
                    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
                        setUser(session?.user ?? null);
                        setLoading(false);
                    });

                    setLoading(false);
                    return () => subscription.unsubscribe();
                } else {
                    // Supabase not configured, use mock auth or disable auth
                    console.warn('Supabase not configured. Authentication disabled.');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        if (!supabase) {
            return { success: false, error: 'Authentication not configured' };
        }

        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        if (!supabase) {
            return { success: false, error: 'Authentication not configured' };
        }

        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: 'Signup failed' };
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email) => {
        if (!supabase) {
            return { success: false, error: 'Authentication not configured' };
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to send reset email' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        if (!supabase) {
            console.warn('Authentication not configured');
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        login,
        signup,
        resetPassword,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
