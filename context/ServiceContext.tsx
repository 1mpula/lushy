import { supabase } from '@/lib/supabase';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface Service {
    id: string;
    professionalId: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    imageUrl: string; // Primary image (first of array)
    imageUrls: string[]; // All images
    imageWidth?: number; // Primary image width
    imageHeight?: number; // Primary image height
    videoUrl?: string; // Optional video URL
    isActive: boolean;
    category: string;
    // From professional join
    professionalName: string;
    professionalAvatar: string;
    professionalLocation: string;
    professionalRating: number;
}

interface ServiceContextType {
    services: Service[];
    isLoading: boolean;
    error: string | null;
    refreshServices: () => Promise<void>;
    getServiceById: (id: string) => Service | undefined;
    getServicesByCategory: (category: string) => Service[];
    getServicesByProfessional: (professionalId: string) => Service[];
    deleteService: (id: string, imageUrls: string[]) => Promise<void>;
    updateService: (id: string, updates: Partial<{
        name: string;
        description: string;
        price: number;
        durationMinutes: number;
        imageUrls: string[];
        imageWidth: number;
        imageHeight: number;
        videoUrl: string;
        category: string;
    }>) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshServices = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Join services with professionals and profiles
            const { data, error: fetchError } = await supabase
                .from('services')
                .select(`
                    *,
                    professionals:professional_id (
                        id,
                        business_name,
                        location,
                        rating,
                        profiles:user_id (
                            avatar_url
                        )
                    )
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            // Transform to app format
            const transformed: Service[] = (data || []).map((s: any) => {
                const images = s.image_urls || (s.image_url ? [s.image_url] : []);
                const primaryImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop';

                return {
                    id: s.id,
                    professionalId: s.professional_id,
                    name: s.name || '',
                    description: s.description || '',
                    price: s.price || 0,
                    durationMinutes: s.duration_minutes || 60,
                    imageUrl: primaryImage,
                    imageUrls: images.length > 0 ? images : [primaryImage],
                    imageWidth: s.image_width,
                    imageHeight: s.image_height,
                    videoUrl: s.video_url || undefined,
                    isActive: s.is_active,
                    category: s.category || 'Hair',
                    // From professional join
                    professionalName: s.professionals?.business_name || 'Professional',
                    professionalAvatar: s.professionals?.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop',
                    professionalLocation: s.professionals?.location || '',
                    professionalRating: s.professionals?.rating || 0,
                };
            });

            setServices(transformed);

        } catch (err: any) {
            console.error('Error fetching services:', err);
            setError(err.message || 'Failed to load services');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshServices();
    }, [refreshServices]);

    const getServiceById = (id: string) => {
        return services.find(s => s.id === id);
    };

    const getServicesByCategory = (category: string) => {
        if (category === 'All') return services;
        return services.filter(s => s.category === category);
    };

    const getServicesByProfessional = (professionalId: string) => {
        return services.filter(s => s.professionalId === professionalId);
    };

    const deleteService = async (id: string, imageUrls: string[]) => {
        try {
            setIsLoading(true);

            // 1. Delete info from database (cascades should handle relations, but let's be safe)
            const { error: dbError } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Delete images from storage
            if (imageUrls && imageUrls.length > 0) {
                // Extract paths from URLs
                const filesToRemove = imageUrls.map(url => {
                    // Url format: .../storage/v1/object/public/services/folder/file.jpg
                    // We need: folder/file.jpg
                    const parts = url.split('/services/');
                    return parts.length > 1 ? parts[1] : null;
                }).filter(path => path !== null) as string[];

                if (filesToRemove.length > 0) {
                    await supabase.storage.from('services').remove(filesToRemove);
                }
            }

            // 3. Update local state
            await refreshServices();

        } catch (err: any) {
            console.error('Error deleting service:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateService = async (id: string, updates: Partial<{
        name: string;
        description: string;
        price: number;
        durationMinutes: number;
        imageUrls: string[];
        imageWidth: number;
        imageHeight: number;
        videoUrl: string;
        category: string;
    }>) => {
        try {
            // NOTE: We don't set global isLoading here because:
            // 1. The calling component (edit-service) has its own loading state
            // 2. Setting global loading causes all screens to re-render which can cause hooks errors

            // Build the update object with snake_case keys for Supabase
            const dbUpdates: Record<string, any> = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.description !== undefined) dbUpdates.description = updates.description;
            if (updates.price !== undefined) dbUpdates.price = updates.price;
            if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;
            if (updates.imageUrls !== undefined) dbUpdates.image_urls = updates.imageUrls;
            if (updates.imageWidth !== undefined) dbUpdates.image_width = updates.imageWidth;
            if (updates.imageHeight !== undefined) dbUpdates.image_height = updates.imageHeight;
            if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
            if (updates.category !== undefined) dbUpdates.category = updates.category;

            const { error: dbError } = await supabase
                .from('services')
                .update(dbUpdates)
                .eq('id', id);

            if (dbError) throw dbError;

            // Refresh to get updated data (this will set isLoading briefly but that's ok)
            await refreshServices();

        } catch (err: any) {
            console.error('Error updating service:', err);
            throw err;
        }
    };

    return (
        <ServiceContext.Provider value={{
            services,
            isLoading,
            error,
            refreshServices,
            getServiceById,
            getServicesByCategory,
            getServicesByProfessional,
            deleteService,
            updateService,
        }}>
            {children}
        </ServiceContext.Provider>
    );
}

export function useServices() {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
}
