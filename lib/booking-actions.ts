// Lushy Booking Actions - Edge Function Integration
// Use these functions to trigger booking workflows from the app

import { supabase } from './supabase';

const SUPABASE_URL = 'https://ehabinuyyasvahhxkhdw.supabase.co';

/**
 * Get the current user's session token for Edge Function auth
 */
async function getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
}

/**
 * Call a Supabase Edge Function
 */
async function callEdgeFunction(
    functionName: string,
    payload: Record<string, unknown>
): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
        const token = await getAuthToken();

        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/${functionName}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || 'Function call failed' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// ============================================
// BOOKING ACTIONS
// ============================================

/**
 * Create a new booking
 * The database trigger will automatically notify the professional
 */
export async function createBooking(bookingData: {
    client_id: string;
    professional_id: string;
    service_id: string;
    client_name: string;
    client_phone?: string;
    professional_name: string;
    professional_phone?: string;
    service_name: string;
    booking_date: string;
    booking_time: string;
    price: number;
    location_type?: 'house_call' | 'salon_visit';
    address?: string;
}) {
    const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    // The database trigger automatically calls notify-new-booking
    // No need to manually call the Edge Function!

    return { success: true, booking: data };
}

/**
 * Accept a booking (called by professional)
 */
export async function acceptBooking(bookingId: string) {
    return callEdgeFunction('booking-response', {
        booking_id: bookingId,
        status: 'accepted',
    });
}

/**
 * Reject a booking (called by professional)
 */
export async function rejectBooking(bookingId: string) {
    return callEdgeFunction('booking-response', {
        booking_id: bookingId,
        status: 'rejected',
    });
}

/**
 * Cancel a booking (can be called by either party)
 */
export async function cancelBooking(bookingId: string, cancelledBy?: 'client' | 'professional') {
    return callEdgeFunction('cancel-booking', {
        booking_id: bookingId,
        cancelled_by: cancelledBy,
    });
}

/**
 * Mark a booking as completed (called by professional)
 */
export async function completeBooking(bookingId: string) {
    return callEdgeFunction('complete-booking', {
        booking_id: bookingId,
    });
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Creating a booking (client side)
const result = await createBooking({
  client_id: currentUser.id,
  professional_id: selectedPro.id,
  service_id: selectedService.id,
  client_name: currentUser.full_name,
  client_phone: currentUser.phone,
  professional_name: selectedPro.business_name,
  service_name: selectedService.name,
  booking_date: '2024-02-15',
  booking_time: '14:00',
  price: selectedService.price,
  location_type: 'salon_visit',
});

// Accepting a booking (professional side)
await acceptBooking('booking-uuid-here');

// Cancelling a booking
await cancelBooking('booking-uuid-here', 'client');

// Completing a booking
await completeBooking('booking-uuid-here');
*/
