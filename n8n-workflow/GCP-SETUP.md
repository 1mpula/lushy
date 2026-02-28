# 🚀 Deploy n8n to Google Cloud (FREE)

This guide sets up n8n on GCP's **always-free** e2-micro VM.

---

## Step 1: Create Google Cloud Account

1. Go to [cloud.google.com](https://cloud.google.com)
2. Click **Get started for free**
3. Sign in with Google account
4. Add billing info (you get **$300 free credits** + free tier after)

> **Note:** You won't be charged - the e2-micro is free in eligible regions.

---

## Step 2: Create a Free VM

### Via Console (Easiest)

1. Go to **Compute Engine** → **VM instances**
2. Click **Create Instance**
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `n8n-server` |
| **Region** | `us-west1`, `us-central1`, or `us-east1` ⚠️ |
| **Zone** | Any (e.g., `us-central1-a`) |
| **Machine type** | `e2-micro` (free tier) |
| **Boot disk** | Ubuntu 22.04 LTS, **30 GB** standard |
| **Firewall** | ✅ Allow HTTP, ✅ Allow HTTPS |

4. Click **Create**

---

## Step 3: SSH Into Your VM

1. In the VM list, click **SSH** button next to your instance
2. A terminal window opens in your browser

---

## Step 4: Install Docker & n8n

Copy and paste these commands one by one:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io

# Add yourself to docker group (avoids needing sudo)
sudo usermod -aG docker $USER

# Apply group changes (or logout/login)
newgrp docker

# Create n8n data directory
mkdir -p ~/.n8n

# Run n8n (auto-restarts on reboot)
docker run -d \
  --restart unless-stopped \
  --name n8n \
  -p 5678:5678 \
  -e N8N_SECURE_COOKIE=false \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

---

## Step 5: Open Port 5678

1. Go to **VPC Network** → **Firewall** in GCP Console
2. Click **Create Firewall Rule**
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `allow-n8n` |
| **Direction** | Ingress |
| **Targets** | All instances in the network |
| **Source IP ranges** | `0.0.0.0/0` |
| **Protocols and ports** | ✅ TCP: `5678` |

4. Click **Create**

---

## Step 6: Access n8n

1. Go back to **Compute Engine** → **VM instances**
2. Copy the **External IP** (e.g., `34.123.45.67`)
3. Open in browser: `http://34.123.45.67:5678`

🎉 **n8n is now running 24/7!**

---

## Step 7: Import Your Lushy Workflow

1. Open n8n in your browser
2. Create an account (first time only)
3. Go to **Workflows** → **Import from file**
4. Upload `lushy-final-workflow.json`
5. Click the **Active** toggle to enable it

---

## Step 8: Configure Environment Variables

In n8n, go to **Settings** → **Variables** and add:

| Variable Name | Value |
|--------------|-------|
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYWJpbnV5eWFzdmFoaHhraGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzU5OTAsImV4cCI6MjA4NDk1MTk5MH0.vr6TOMU1zAPLwp_T79B_NXTkkaIWUc5oFozn0h26Kd4` |
| `SUPABASE_SERVICE_KEY` | *(Get from Supabase Dashboard → Settings → API → service_role key)* |

---

## Step 9: Get Your Webhook URLs

Click on each webhook node to see its production URL:

```
http://YOUR_VM_IP:5678/webhook/lushy-new-booking
http://YOUR_VM_IP:5678/webhook/lushy-booking-response
http://YOUR_VM_IP:5678/webhook/lushy-cancel-booking
http://YOUR_VM_IP:5678/webhook/lushy-complete-booking
```

---

## Step 10: Update Your App

Create/update `lib/n8n.ts` with your GCP IP:

```typescript
// Replace with your VM's external IP
const N8N_BASE_URL = 'http://34.123.45.67:5678/webhook';

export const n8nWebhooks = {
  async notifyNewBooking(bookingId: string) {
    return fetch(`${N8N_BASE_URL}/lushy-new-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    });
  },
  // ... other methods from README.md
};
```

---

## 💰 Free Tier Limits

| Resource | Free Allowance |
|----------|---------------|
| VM | 1x e2-micro in US regions |
| Storage | 30 GB standard disk |
| Network | 1 GB egress/month to most regions |

> Your Lushy booking workflows will easily stay within these limits!

---

## 🔧 Useful Commands

```bash
# SSH into your VM from local terminal
gcloud compute ssh n8n-server --zone=us-central1-a

# Check if n8n is running
docker ps

# View n8n logs
docker logs n8n

# Restart n8n
docker restart n8n

# Update n8n to latest version
docker pull n8nio/n8n
docker stop n8n && docker rm n8n
# Then run the docker run command from Step 4 again
```

---

## 🔒 Optional: Add HTTPS (Recommended)

For production, add a domain and SSL:

1. Get a free domain or use your own
2. Point it to your VM's IP
3. Use Caddy or nginx as a reverse proxy with Let's Encrypt

*(This is optional but recommended for production apps)*
