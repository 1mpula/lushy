---
description: Debug server connection issues
---

# Debug Connection Issues

1. Check environment variables:
   - Verify `.env` or `lib/supabase.ts` has correct Supabase URL and keys

2. Test Supabase connection:
```bash
npx supabase status
```

3. Check network connectivity:
   - Ensure device/simulator has internet access
   - Check if Supabase project is active in dashboard

4. Review error logs in Expo terminal

5. Clear cache and restart:
```bash
pkill -f expo && npx expo start -c
```

6. If RLS errors, check bucket/table policies in Supabase Dashboard
