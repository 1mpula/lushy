---
description: Push database schema changes to Supabase
---

# Push Supabase Schema

1. Review the schema file at `supabase/schema.sql`

2. Apply migrations to the remote database:
```bash
npx supabase db push
```

3. If there are RLS policy issues, check and update policies in Supabase Dashboard or via SQL.

> [!WARNING]
> Always backup data before pushing destructive schema changes.
