---
description: Add a new feature to the app
---

# Add New Feature

1. **Plan the feature**
   - Review `DESIGN.md` for app architecture
   - Identify which screens/components need changes

2. **Create components** (if needed)
   - Add new components to `components/`
   - Follow existing patterns for styling and props

3. **Update screens**
   - Modify files in `app/` for screen logic
   - Import and use new components

4. **Add data/state** (if needed)
   - Update `context/` for global state
   - Update `lib/` for utility functions
   - Update `supabase/schema.sql` for database changes

5. **Test the feature**
   - Restart Expo: `pkill -f expo && npx expo start -c`
   - Test on iOS and Android simulators
   - Check for safe area and theme compatibility
