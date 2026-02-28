// Lushy Load Test - Seed Script
// Run with: npx ts-node scripts/seed-test-data.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehabinuyyasvahhxkhdw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseServiceKey) {
    console.error('❌ Please set SUPABASE_SERVICE_KEY environment variable');
    console.log('   You can find this in Supabase Dashboard > Settings > API > service_role key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Test data
const TEST_CLIENTS = [
    { email: 'client1@test.com', name: 'Thandi Mokoena', phone: '+27711111111' },
    { email: 'client2@test.com', name: 'Lerato Nkosi', phone: '+27722222222' },
    { email: 'client3@test.com', name: 'Nomvula Dlamini', phone: '+27733333333' },
    { email: 'client4@test.com', name: 'Zanele Mthembu', phone: '+27744444444' },
    { email: 'client5@test.com', name: 'Palesa Molefe', phone: '+27755555555' },
    { email: 'client6@test.com', name: 'Dineo Khumalo', phone: '+27766666666' },
    { email: 'client7@test.com', name: 'Ayanda Zulu', phone: '+27777777777' },
    { email: 'client8@test.com', name: 'Mbali Ndlovu', phone: '+27788888888' },
    { email: 'client9@test.com', name: 'Thandeka Sithole', phone: '+27799999999' },
    { email: 'client10@test.com', name: 'Nompilo Zwane', phone: '+27700000000' },
];

const TEST_PROFESSIONALS = [
    {
        email: 'pro1@test.com',
        name: 'Sarah Beauty Studio',
        phone: '+27810001111',
        bio: 'Expert in braids, weaves, and natural hair care. 10+ years experience.',
        location: 'Sandton, Johannesburg',
        expertise: ['hair', 'braids', 'weaves']
    },
    {
        email: 'pro2@test.com',
        name: 'Nails by Precious',
        phone: '+27820002222',
        bio: 'Nail artist specializing in gel, acrylics, and nail art designs.',
        location: 'Rosebank, Johannesburg',
        expertise: ['nails', 'manicure', 'pedicure']
    },
    {
        email: 'pro3@test.com',
        name: 'Lash Queen Studio',
        phone: '+27830003333',
        bio: 'Premium lash extensions and lifts. Certified lash technician.',
        location: 'Pretoria East',
        expertise: ['lashes', 'brows']
    },
    {
        email: 'pro4@test.com',
        name: 'Glam by Zinhle',
        phone: '+27840004444',
        bio: 'Makeup artist for weddings, photoshoots, and special events.',
        location: 'Fourways, Johannesburg',
        expertise: ['makeup', 'bridal']
    },
    {
        email: 'pro5@test.com',
        name: 'African Queen Hair',
        phone: '+27850005555',
        bio: 'Specializing in African hair textures, locs, and protective styles.',
        location: 'Soweto, Johannesburg',
        expertise: ['hair', 'locs', 'natural']
    },
];

const SERVICES = [
    // Pro 1 - Hair
    { name: 'Box Braids (Medium)', price: 350, duration: 180, description: 'Classic medium box braids' },
    { name: 'Knotless Braids', price: 500, duration: 240, description: 'Trendy knotless braids, less tension' },
    { name: 'Cornrows', price: 200, duration: 90, description: 'Traditional cornrow styles' },

    // Pro 2 - Nails
    { name: 'Gel Manicure', price: 150, duration: 60, description: 'Long-lasting gel polish' },
    { name: 'Acrylic Full Set', price: 300, duration: 90, description: 'Full acrylic nail set' },
    { name: 'Nail Art Design', price: 200, duration: 45, description: 'Custom nail art designs' },

    // Pro 3 - Lashes
    { name: 'Classic Lash Extensions', price: 400, duration: 120, description: 'Natural-looking classic lashes' },
    { name: 'Volume Lashes', price: 600, duration: 150, description: 'Fuller, dramatic volume lashes' },
    { name: 'Lash Lift & Tint', price: 250, duration: 60, description: 'Lift and tint your natural lashes' },

    // Pro 4 - Makeup
    { name: 'Glam Makeup', price: 500, duration: 90, description: 'Full glam makeup look' },
    { name: 'Bridal Makeup', price: 1500, duration: 120, description: 'Complete bridal makeup package' },
    { name: 'Natural Makeup', price: 300, duration: 60, description: 'Everyday natural makeup' },

    // Pro 5 - Hair (African)
    { name: 'Loc Installation', price: 800, duration: 300, description: 'Full loc installation' },
    { name: 'Loc Retwist', price: 250, duration: 90, description: 'Loc maintenance and retwist' },
    { name: 'Silk Press', price: 400, duration: 120, description: 'Smooth silk press on natural hair' },
];

async function createTestUser(email: string, password: string = 'TestPassword123!') {
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (error) {
        console.log(`  ⚠️  User ${email} may already exist:`, error.message);
        // Try to get existing user
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === email);
        return existingUser || null;
    }

    return data.user;
}

async function seedClients() {
    console.log('\n📱 Creating test clients...\n');

    for (const client of TEST_CLIENTS) {
        const user = await createTestUser(client.email);
        if (user) {
            // Create/update profile
            await supabase.from('profiles').upsert({
                id: user.id,
                email: client.email,
                full_name: client.name,
                phone: client.phone,
                role: 'client'
            });
            console.log(`  ✅ ${client.name} (${client.email})`);
        }
    }
}

async function seedProfessionals() {
    console.log('\n💇 Creating test professionals...\n');

    const proIds: string[] = [];

    for (const pro of TEST_PROFESSIONALS) {
        const user = await createTestUser(pro.email);
        if (user) {
            // Create/update profile
            await supabase.from('profiles').upsert({
                id: user.id,
                email: pro.email,
                full_name: pro.name,
                phone: pro.phone,
                role: 'provider'
            });

            // Create professional entry
            const { data: proData, error } = await supabase.from('professionals').upsert({
                user_id: user.id,
                business_name: pro.name,
                bio: pro.bio,
                location: pro.location,
                expertise: pro.expertise,
                rating: 4.5 + Math.random() * 0.5, // Random rating 4.5-5.0
                total_reviews: Math.floor(Math.random() * 50) + 10,
                is_verified: true
            }, { onConflict: 'user_id' }).select().single();

            if (proData) {
                proIds.push(proData.id);
            }

            console.log(`  ✅ ${pro.name} (${pro.email})`);
        }
    }

    return proIds;
}

async function seedServices(proIds: string[]) {
    console.log('\n💅 Creating services...\n');

    // Assign 3 services to each professional
    for (let i = 0; i < proIds.length; i++) {
        const proId = proIds[i];
        const proServices = SERVICES.slice(i * 3, (i + 1) * 3);

        for (const service of proServices) {
            await supabase.from('services').upsert({
                professional_id: proId,
                name: service.name,
                price: service.price,
                duration_minutes: service.duration,
                description: service.description,
                is_active: true,
                image_url: `https://images.unsplash.com/photo-${1560066984 + i * 1000}-138dadb4c035?w=400&q=80`
            }, { onConflict: 'professional_id,name' });

            console.log(`  ✅ ${service.name} (R${service.price})`);
        }
    }
}

async function createTestBookings() {
    console.log('\n📅 Creating test bookings...\n');

    // Get all clients and professionals
    const { data: clients } = await supabase.from('profiles').select('*').eq('role', 'client').limit(5);
    const { data: professionals } = await supabase.from('professionals').select('*, profiles!professionals_user_id_fkey(*)').limit(3);
    const { data: services } = await supabase.from('services').select('*').limit(5);

    if (!clients || !professionals || !services) {
        console.log('  ⚠️  No data found for bookings');
        return;
    }

    const statuses = ['pending', 'accepted', 'paid', 'completed'];
    const dates = ['2026-01-29', '2026-01-30', '2026-01-31', '2026-02-01', '2026-02-02'];
    const times = ['09:00', '11:00', '14:00', '16:00'];

    for (let i = 0; i < 10; i++) {
        const client = clients[i % clients.length];
        const pro = professionals[i % professionals.length];
        const service = services[i % services.length];

        const booking = {
            client_id: client.id,
            provider_id: pro.id,
            service_id: service.id,
            client_name: client.full_name,
            provider_name: pro.profiles?.full_name || pro.business_name,
            service_name: service.name,
            price: service.price,
            booking_date: dates[i % dates.length],
            booking_time: times[i % times.length],
            location_type: i % 2 === 0 ? 'salon_visit' : 'house_call',
            address: i % 2 === 0 ? pro.location : '123 Test Street, Johannesburg',
            status: statuses[i % statuses.length]
        };

        const { error } = await supabase.from('bookings').insert(booking);

        if (error) {
            console.log(`  ⚠️  Booking error:`, error.message);
        } else {
            console.log(`  ✅ ${client.full_name} → ${service.name} (${booking.status})`);
        }
    }
}

async function main() {
    console.log('🚀 Lushy Load Test - Seeding Database\n');
    console.log('='.repeat(50));

    await seedClients();
    const proIds = await seedProfessionals();

    if (proIds.length > 0) {
        await seedServices(proIds);
        await createTestBookings();
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n✅ Seeding complete!\n');
    console.log('Test credentials:');
    console.log('  Email: client1@test.com (or client2-10)');
    console.log('  Email: pro1@test.com (or pro2-5)');
    console.log('  Password: TestPassword123!');
}

main().catch(console.error);
