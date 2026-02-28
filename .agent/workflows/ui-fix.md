---
description: Fix UI layout or styling issues
---

# Fix UI Issues

1. Identify the affected screen/component
   - Check `app/` for screen files
   - Check `components/` for reusable components

2. Review the theme colors in `constants/Colors.ts`

3. Check Tailwind config at `tailwind.config.js` for custom styles

4. For safe area issues:
   - Use `useSafeAreaInsets()` from `react-native-safe-area-context`
   - Apply padding for system navigation bars

5. For dark mode issues:
   - Check `context/` for theme context
   - Ensure components respect the current theme

6. Restart Expo after changes:
```bash
pkill -f expo && npx expo start -c
```
