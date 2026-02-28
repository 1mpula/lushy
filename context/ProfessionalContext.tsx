import { supabase } from '@/lib/supabase';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface Professional {
    id: string;
    userId: string;
    businessName: string;
    expertise: string[];
    location: string;
    bio: string;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    subscriptionStatus?: 'active' | 'trial' | 'past_due' | 'suspended';
    subscriptionDueDate?: string;
    // From profiles join
    fullName: string;
    email: string;
    avatarUrl: string;
    phone: string;
    bannerUrl?: string;
}

interface ProfessionalContextType {
    professionals: Professional[];
    isLoading: boolean;
    error: string | null;
    refreshProfessionals: () => Promise<void>;
    getProfessionalById: (id: string) => Professional | undefined;
    getProfessionalByUserId: (userId: string) => Professional | undefined;
    updateLocation: (professionalId: string, location: string) => Promise<void>;
    saveProfessional: (professional: Partial<Professional> & { id: string }) => Promise<void>;
}

const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

export function ProfessionalProvider({ children }: { children: ReactNode }) {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshProfessionals = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Join professionals with profiles to get full info
            const { data, error: fetchError } = await supabase
                .from('professionals')
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        email,
                        avatar_url,
                        phone
                    )
                `)
                .order('created_at', { ascending: false });


            if (fetchError) {
                console.error('Fetch error:', fetchError);
                throw fetchError;
            }


            // Transform to app format
            const transformed: Professional[] = (data || []).map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                businessName: p.business_name || '',
                expertise: p.expertise || [],
                location: p.location || '',
                bio: p.bio || '',
                rating: p.rating || 0,
                totalReviews: p.total_reviews || 0,
                isVerified: p.is_verified || false,
                subscriptionStatus: p.subscription_status || 'trial',
                subscriptionDueDate: p.subscription_due_date,
                // From profiles
                fullName: p.profiles?.full_name || '',
                email: p.profiles?.email || '',
                avatarUrl: p.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop',
                phone: p.profiles?.phone || '',
                bannerUrl: p.banner_url || undefined,
            }));

            setProfessionals(transformed);
        } catch (err: any) {
            console.error('Error fetching professionals:', err);
            setError(err.message || 'Failed to load professionals');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProfessionals();
    }, [refreshProfessionals]);

    const getProfessionalById = (id: string) => {
        return professionals.find(p => p.id === id);
    };

    const getProfessionalByUserId = (userId: string) => {
        return professionals.find(p => p.userId === userId);
    };

    const updateLocation = async (professionalId: string, location: string) => {
        const { error: updateError } = await supabase
            .from('professionals')
            .update({ location })
            .eq('id', professionalId);

        if (updateError) throw updateError;

        // Update local state immediately
        setProfessionals(prev =>
            prev.map(p => p.id === professionalId ? { ...p, location } : p)
        );
    };

    const saveProfessional = async (professional: Partial<Professional> & { id: string }) => {
        const updateData: any = {};

        if (professional.subscriptionStatus) updateData.subscription_status = professional.subscriptionStatus;
        if (professional.subscriptionDueDate) updateData.subscription_due_date = professional.subscriptionDueDate;

        const { error: updateError } = await supabase
            .from('professionals')
            .update(updateData)
            .eq('id', professional.id);

        if (updateError) throw updateError;

        // Update local state immediately
        setProfessionals(prev =>
            prev.map(p => p.id === professional.id ? { ...p, ...professional } : p)
        );
    };

    return (
        <ProfessionalContext.Provider value={{
            professionals,
            isLoading,
            error,
            refreshProfessionals,
            getProfessionalById,
            getProfessionalByUserId,
            updateLocation,
            saveProfessional,
        }}>
            {children}
        </ProfessionalContext.Provider>
    );
}

export function useProfessionals() {
    const context = useContext(ProfessionalContext);
    if (!context) {
        throw new Error('useProfessionals must be used within a ProfessionalProvider');
    }
    return context;
}
