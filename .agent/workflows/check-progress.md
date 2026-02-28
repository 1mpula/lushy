---
description: Check app development progress and remaining tasks
---

# Check App Progress

1. Review the main design document:
   - Open `DESIGN.md` for overall architecture and goals

2. Check for any TODO comments in the codebase:
```bash
grep -r "TODO\|FIXME\|XXX" --include="*.ts" --include="*.tsx" app/ components/ lib/
```

3. Review recent conversation summaries for pending work

4. Check component status:
   - `components/` - UI components
   - `app/` - Screen implementations
   - `context/` - State management
   - `lib/` - Utilities and helpers
