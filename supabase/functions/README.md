# 🚀 Lushy Supabase Edge Functions Setup

This replaces n8n with native Supabase Edge Functions for booking automation.

## 📁 Files Created

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── utils.ts           # Shared utilities & push notification helper
│   ├── notify-new-booking/    # Notifies pro when booking is created
│   ├── booking-response/      # Handles accept/reject
│   ├── cancel-booking/        # Handles cancellation
│   ├── complete-booking/      # Marks complete & requests review
│   └── send-reminders/        # Hourly 24hr/3hr reminder check
├── booking-triggers.sql       # Database triggers & cron job
lib/
└── booking-actions.ts         # App integration for calling functions
```

---

## 🛠️ Deployment Steps

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
cd /Users/atanglekolwane/Desktop/Lushy
supabase link --project-ref ehabinuyyasvahhxkhdw
```

### 4. Deploy All Functions

```bash
supabase functions deploy notify-new-booking
supabase functions deploy booking-response
supabase functions deploy cancel-booking
supabase functions deploy complete-booking
supabase functions deploy send-reminders
```

### 5. Enable Extensions & Set Up Triggers

1. Go to **Supabase Dashboard** → **Database** → **Extensions**
2. Enable: `pg_net` and `pg_cron`
3. Go to **SQL Editor**
4. Run the contents of `supabase/booking-triggers.sql`

---

## 🔔 How It Works

| Event | Trigger | Action |
|-------|---------|--------|
| **Booking created** | DB trigger (automatic) | Push notification to professional |
| **Pro accepts/rejects** | App calls `acceptBooking()` | Updates DB, notifies client |
| **Booking cancelled** | App calls `cancelBooking()` | Updates DB, notifies both |
| **Booking completed** | App calls `completeBooking()` | Updates DB, requests review |
| **Every hour** | pg_cron scheduled job | Sends 24hr & 3hr reminders |

---

## 📱 App Usage

```typescript
import { 
  createBooking, 
  acceptBooking, 
  rejectBooking,
  cancelBooking, 
  completeBooking 
} from '@/lib/booking-actions';

// Client books a service
await createBooking({ ... }); // Auto-triggers notification!

// Professional accepts
await acceptBooking(bookingId);

// Either party cancels
await cancelBooking(bookingId);

// Professional completes
await completeBooking(bookingId);
```

---

## 💰 Cost Comparison

| Solution | Monthly Cost | Executions |
|----------|--------------|------------|
| **Supabase Edge Functions** | $0 | 500K free |
| n8n on GCP | $0 | Unlimited |
| n8n Cloud | $20+ | Limited |

**Winner: Supabase Edge Functions** - Native integration, no extra server!

---

## 🔧 Testing Functions Locally

```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve

# Test a function
curl -X POST http://localhost:54321/functions/v1/notify-new-booking \
  -H "Content-Type: application/json" \
  -d '{"booking_id": "test-id"}'
```

---

## ✅ Checklist

- [ ] Supabase CLI installed
- [ ] Project linked
- [ ] All 5 functions deployed
- [ ] pg_net extension enabled
- [ ] pg_cron extension enabled
- [ ] booking-triggers.sql executed
- [ ] Test push notification working
