// Supabase Edge Functions API - Replaced n8n webhooks
// New bookings are now auto-triggered by database trigger

const SUPABASE_FUNCTIONS_URL = 'https://ehabinuyyasvahhxkhdw.supabase.co/functions/v1';

export const bookingApi = {
    // NOTE: New booking notifications are now AUTOMATIC via database trigger!
    // You no longer need to call this - keeping for backwards compatibility
    notifyNewBooking: async (_bookingId: string) => {
        console.log('⚠️ notifyNewBooking is deprecated - notifications are now automatic via DB trigger');
        return { success: true, data: { message: 'Handled by database trigger' } };
    },

    // Professional responds to booking (accept/reject)
    respondToBooking: async (bookingId: string, status: 'accepted' | 'rejected') => {
        try {
            const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/booking-response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    booking_id: bookingId,
                    status: status
                }),
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error responding to booking:', error);
            return { success: false, error: 'Failed to respond' };
        }
    },

    // Cancel a booking
    cancelBooking: async (bookingId: string) => {
        try {
            const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/cancel-booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: bookingId }),
            });
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error cancelling booking:', error);
            return { success: false, error: 'Failed to cancel' };
        }
    },

    // Complete a booking (triggers review request)
    completeBooking: async (bookingId: string) => {
        try {
            const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/complete-booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: bookingId }),
            });
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error completing booking:', error);
            return { success: false, error: 'Failed to complete' };
        }
    },
};

// Keep old export name for backwards compatibility
export const n8nApi = bookingApi;
