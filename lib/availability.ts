// Availability management for providers
import { supabase } from './supabase';

/**
 * Get blocked dates for a provider
 */
export async function getBlockedDates(providerId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('professionals')
        .select('blocked_dates')
        .eq('id', providerId)
        .single();

    if (error || !data) {
        console.error('Error fetching blocked dates:', error);
        return [];
    }

    return data.blocked_dates || [];
}

/**
 * Update blocked dates for a provider
 */
export async function updateBlockedDates(providerId: string, blockedDates: string[]): Promise<void> {
    const { error } = await supabase
        .from('professionals')
        .update({ blocked_dates: blockedDates })
        .eq('id', providerId);

    if (error) {
        throw new Error(error.message);
    }
}

/**
 * Toggle a date's blocked status
 * Returns the new array of blocked dates
 */
export async function toggleBlockedDate(providerId: string, dateString: string): Promise<string[]> {
    const currentBlocked = await getBlockedDates(providerId);

    let newBlocked: string[];
    if (currentBlocked.includes(dateString)) {
        // Remove the date (unblock)
        newBlocked = currentBlocked.filter(d => d !== dateString);
    } else {
        // Add the date (block)
        newBlocked = [...currentBlocked, dateString];
    }

    await updateBlockedDates(providerId, newBlocked);
    return newBlocked;
}

/**
 * Check if a specific date is blocked
 */
export function isDateBlocked(blockedDates: string[], dateString: string): boolean {
    return blockedDates.includes(dateString);
}
