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
    const [authLoading, setAuthLoading] = useState(false);

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
            setAuthLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Provide user-friendly error messages
                let userMessage = error.message;

                switch (error.message) {
                    case 'Invalid login credentials':
                        userMessage = 'Invalid email or password. Please check your credentials and try again.';
                        break;
                    case 'Email not confirmed':
                        userMessage = 'Please check your email and click the confirmation link before logging in.';
                        break;
                    case 'Too many requests':
                        userMessage = 'Too many login attempts. Please wait a moment and try again.';
                        break;
                    case 'User not found':
                        userMessage = 'No account found with this email address.';
                        break;
                    default:
                        userMessage = error.message;
                }

                return { success: false, error: userMessage };
            }

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Please check your connection and try again.' };
        } finally {
            setAuthLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        if (!supabase) {
            return { success: false, error: 'Authentication not configured' };
        }

        try {
            setAuthLoading(true);
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
                // Provide user-friendly error messages for signup
                let userMessage = error.message;

                switch (error.message) {
                    case 'User already registered':
                        userMessage = 'An account with this email already exists. Please try logging in instead.';
                        break;
                    case 'Password should be at least 6 characters':
                        userMessage = 'Password must be at least 6 characters long.';
                        break;
                    case 'Invalid email':
                        userMessage = 'Please enter a valid email address.';
                        break;
                    case 'Signup is disabled':
                        userMessage = 'Account creation is currently disabled. Please contact support.';
                        break;
                    default:
                        userMessage = error.message;
                }

                return { success: false, error: userMessage };
            }

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: 'Network error. Please check your connection and try again.' };
        } finally {
            setAuthLoading(false);
        }
    };

    const resetPassword = async (email) => {
        if (!supabase) {
            return { success: false, error: 'Authentication not configured' };
        }

        try {
            setAuthLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                // Provide user-friendly error messages for password reset
                let userMessage = error.message;

                switch (error.message) {
                    case 'User not found':
                        userMessage = 'No account found with this email address.';
                        break;
                    case 'Invalid email':
                        userMessage = 'Please enter a valid email address.';
                        break;
                    case 'For security purposes, you can only request this once every 60 seconds':
                        userMessage = 'Please wait 60 seconds before requesting another password reset.';
                        break;
                    default:
                        userMessage = error.message;
                }

                return { success: false, error: userMessage };
            }

            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: 'Network error. Please check your connection and try again.' };
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        if (!supabase) {
            console.warn('Authentication not configured');
            return;
        }

        try {
            setAuthLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuthLoading(false);
        }
    };

    const value = {
        user,
        login,
        signup,
        resetPassword,
        logout,
        loading,
        authLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
