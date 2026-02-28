import { usePushNotifications } from '@/hooks/usePushNotifications';
import { signOut as authSignOut, AuthUser, getProfile, onAuthStateChange } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

type UserRole = 'client' | 'provider' | null;

interface UserContextType {
    user: AuthUser | null;
    userRole: UserRole;
    isLoading: boolean;
    isAuthenticated: boolean;
    pushToken: string | null;
    setUserRole: (role: UserRole) => void;
    signOut: () => Promise<void>;
    logout: () => Promise<void>; // alias for signOut
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize push notifications when user is logged in
    const { expoPushToken, isRegistered } = usePushNotifications(user?.id || null);

    const refreshUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const profile = await getProfile(session.user.id);
                if (profile) {
                    setUser(profile);
                    setUserRole(profile.role);
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    useEffect(() => {
        // Initial session check
        const initAuth = async () => {
            setIsLoading(true);
            await refreshUser();
            setIsLoading(false);
        };
        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const profile = await getProfile(session.user.id);
                if (profile) {
                    setUser(profile);
                    setUserRole(profile.role);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setUserRole(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await authSignOut();
            setUser(null);
            setUserRole(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            userRole,
            isLoading,
            isAuthenticated: !!user,
            pushToken: expoPushToken,
            setUserRole,
            signOut: handleSignOut,
            logout: handleSignOut, // alias
            refreshUser,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
