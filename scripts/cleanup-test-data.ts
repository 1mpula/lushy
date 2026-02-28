// Lushy - Remove Test Data
// Run with: npx ts-node scripts/cleanup-test-data.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehabinuyyasvahhxkhdw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseServiceKey) {
    console.error('❌ Please set SUPABASE_SERVICE_KEY environment variable');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const TEST_EMAILS = [
    'client1@test.com', 'client2@test.com', 'client3@test.com', 'client4@test.com', 'client5@test.com',
    'client6@test.com', 'client7@test.com', 'client8@test.com', 'client9@test.com', 'client10@test.com',
    'pro1@test.com', 'pro2@test.com', 'pro3@test.com', 'pro4@test.com', 'pro5@test.com'
];

async function main() {
    console.log('🧹 Cleaning up test data...\n');

    // Get test user IDs
    const { data: users } = await supabase.auth.admin.listUsers();
    const testUsers = users?.users?.filter(u => TEST_EMAILS.includes(u.email || '')) || [];

    console.log(`Found ${testUsers.length} test users to remove\n`);

    for (const user of testUsers) {
        // Delete bookings
        await supabase.from('bookings').delete().or(`client_id.eq.${user.id},provider_id.eq.${user.id}`);

        // Delete services (via professionals)
        const { data: pro } = await supabase.from('professionals').select('id').eq('user_id', user.id).single();
        if (pro) {
            await supabase.from('services').delete().eq('professional_id', pro.id);
            await supabase.from('professionals').delete().eq('id', pro.id);
        }

        // Delete profile
        await supabase.from('profiles').delete().eq('id', user.id);

        // Delete auth user
        await supabase.auth.admin.deleteUser(user.id);

        console.log(`  ✅ Removed ${user.email}`);
    }

    console.log('\n✅ Cleanup complete!');
}

main().catch(console.error);
