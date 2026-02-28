// Supabase Authentication Helper
import { supabase } from './supabase';

export type UserRole = 'client' | 'provider';

export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    role: UserRole;
    avatarUrl?: string;
    pushToken?: string;
}

export interface SignUpData {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
}

export interface ProSignUpData extends SignUpData {
    businessName: string;
    expertise: string[];
    location: string;
}

// ============================================
// SIGN UP
// ============================================
export async function signUp(data: SignUpData) {
    const { email, password, fullName, role, phone } = data;

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: role,
                phone: phone || '',
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }

    return authData;
}

// Sign up as provider (creates professional record too)
export async function signUpAsProvider(data: ProSignUpData) {
    const { email, password, fullName, role, phone, businessName, expertise, location } = data;

    // First, sign up the user
    const authData = await signUp({ email, password, fullName, role: 'provider', phone });

    if (authData.user) {
        // Create professional record
        const { error: proError } = await supabase
            .from('professionals')
            .insert({
                user_id: authData.user.id,
                business_name: businessName,
                expertise: expertise,
                location: location,
            });

        if (proError) {
            console.error('Error creating professional record:', proError);
            // Don't throw - user is created, we can fix professional record later
        }
    }

    return authData;
}

// ============================================
// SIGN IN
// ============================================
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

// ============================================
// SIGN OUT
// ============================================
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new Error(error.message);
    }
}

// ============================================
// GET SESSION
// ============================================
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        throw new Error(error.message);
    }
    return data.session;
}

// ============================================
// GET PROFILE
// ============================================
export async function getProfile(userId: string): Promise<AuthUser | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id,
        email: data.email,
        fullName: data.full_name || '',
        phone: data.phone,
        role: data.role as UserRole,
        avatarUrl: data.avatar_url,
        pushToken: data.push_token,
    };
}

// ============================================
// UPDATE PROFILE
// ============================================
export async function updateProfile(userId: string, updates: Partial<{
    fullName: string;
    phone: string;
    avatarUrl: string;
    pushToken: string;
}>) {
    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: updates.fullName,
            phone: updates.phone,
            avatar_url: updates.avatarUrl,
            push_token: updates.pushToken,
        })
        .eq('id', userId);

    if (error) {
        throw new Error(error.message);
    }
}

// ============================================
// AUTH STATE LISTENER
// ============================================
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
}
