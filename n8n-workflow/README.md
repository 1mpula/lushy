# Lushy n8n Booking Workflow

## Overview

This workflow automates the entire Lushy booking lifecycle using **Expo Push Notifications** and **Supabase**.

## 📦 Workflow Flows

### Flow 1: New Booking Created
```
Client books service → n8n receives webhook → Notifies professional via push
```
**Webhook:** `POST /webhook/lushy-new-booking`
```json
{ "booking_id": "uuid-here" }
```

---

### Flow 2: Professional Responds (Accept/Reject)
```
Pro accepts/rejects → Status updated in DB → Client notified via push
```
**Webhook:** `POST /webhook/lushy-booking-response`
```json
{ "booking_id": "uuid", "status": "accepted" | "rejected" }
```

---

### Flow 3: Automated Reminders (Hourly Check)
```
Every hour → Check accepted bookings → Send reminders at 24hr and 3hr before
```
- ⏰ **24 hours before**: "Tomorrow: [Service] with [Pro] at [Time]"
- ⏰ **3 hours before**: "In 3 hours: [Service] with [Pro] at [Time]"

---

### Flow 4: Booking Cancelled
```
Cancel request → Mark cancelled in DB → Notify both parties
```
**Webhook:** `POST /webhook/lushy-cancel-booking`
```json
{ "booking_id": "uuid" }
```

---

### Flow 5: Booking Completed
```
Mark complete → Update DB → Request review from client
```
**Webhook:** `POST /webhook/lushy-complete-booking`
```json
{ "booking_id": "uuid" }
```

---

## 🚀 Setup Instructions

### 1. Import the Workflow
1. Open n8n at `http://localhost:5678`
2. Go to **Workflows** → **Import from file**
3. Select `lushy-final-workflow.json`

### 2. Set Environment Variables
In n8n, go to **Settings** → **Variables** and add:

| Variable | Value |
|----------|-------|
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_KEY` | Your Supabase service_role key (for bypassing RLS) |

### 3. Activate the Workflow
Click the **Active** toggle in the top-right corner.

### 4. Get Your Webhook URLs
Click on each webhook node to see the URL, e.g.:
```
http://localhost:5678/webhook/lushy-new-booking
```

---

## 📱 App Integration

### Call Webhooks from React Native

```typescript
// lib/n8n.ts
const N8N_BASE_URL = 'http://localhost:5678/webhook';
// For production, use your GCP VM's external IP

export const n8nWebhooks = {
  async notifyNewBooking(bookingId: string) {
    return fetch(`${N8N_BASE_URL}/lushy-new-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    });
  },

  async respondToBooking(bookingId: string, status: 'accepted' | 'rejected') {
    return fetch(`${N8N_BASE_URL}/lushy-booking-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, status }),
    });
  },

  async cancelBooking(bookingId: string) {
    return fetch(`${N8N_BASE_URL}/lushy-cancel-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    });
  },

  async completeBooking(bookingId: string) {
    return fetch(`${N8N_BASE_URL}/lushy-complete-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    });
  },
};
```

### Usage in Booking Flow

```typescript
// When client creates a booking
const { data: booking } = await supabase
  .from('bookings')
  .insert({ ... })
  .select()
  .single();

// Trigger n8n workflow
await n8nWebhooks.notifyNewBooking(booking.id);
```

---

## 🔔 Push Notifications

The workflow uses **Expo Push Notifications**. Make sure:

1. Your app registers for push tokens on login
2. Push tokens are saved to `profiles.push_token` in Supabase
3. Users have granted notification permissions

### Push Token Registration (App Side)

```typescript
import * as Notifications from 'expo-notifications';

const registerForPushNotifications = async (userId: string) => {
  const { data: token } = await Notifications.getExpoPushTokenAsync();
  
  await supabase
    .from('profiles')
    .update({ push_token: token.data })
    .eq('id', userId);
};
```

---

## 🗂️ Files in This Folder

| File | Description |
|------|-------------|
| `lushy-final-workflow.json` | **Main workflow** - Import this! |
| `lushy-complete-workflow.json` | Previous version (backup) |
| `lushy-booking-workflow.json` | Basic version (legacy) |

---

## 🔧 Production Setup (Google Cloud)

When ready for production:

1. Deploy n8n to GCP e2-micro (free tier)
2. Update webhook URLs in app to use your GCP IP
3. Set up HTTPS with a domain (optional but recommended)
4. Use Supabase service_role key for full DB access

See the main README for GCP setup instructions.
