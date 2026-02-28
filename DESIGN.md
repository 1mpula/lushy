# Design System: Lushy
**Project ID:** Lushy-App-v1

## 1. Visual Theme & Atmosphere
The design should be "Visually Immersive," "Playful yet Premium," and "Trustworthy." It combines the high-fidelity visual discovery of Pinterest with the booking functionality of a service marketplace. The aesthetic relies on vibrant colors for calls-to-action against a clean background, using glassmorphism and smooth animations to feel "alive."

## 2. Color Palette & Roles
*   **Vibrant Pink (#FF4081)** (Used for primary Call-to-Action buttons like "Book Now", "Sign Up")
*   **Calming Teal (#009688)** (Used for trusting elements, secondary actions, or success states)
*   **Clean White (#FFFFFF)** (Primary background)
*   **Off-White/Light Gray (#F5F5F5)** (Secondary backgrounds, card backgrounds)
*   **Deep Charcoal (#333333)** (Primary text for readability)
*   **Medium Gray (#757575)** (Secondary text, metadata like booking counts)

## 3. Typography Rules
*   **Headings:** "Playful/Bold" (e.g., Outfit or customized font) - Used for screen titles, "Get Started" buttons.
*   **Body:** "Clean/Sans-serif" (e.g., Inter, Roboto) - Used for descriptions, inputs, list items.
*   **Hierarchy:** Clear distinction between headings (bold, larger) and body text (regular, smaller) to ensure readability.

## 4. Component Stylings
*   **Buttons:**
    *   **Primary:** Pill-shaped (`rounded-full`), Vibrant Pink background, White text, subtle shadow (`shadow-md`), high elevation.
    *   **Secondary:** Pill-shaped, White background with Gray border or light gray fill (Filter chips), darker text.
*   **Cards (Pin Card):** Subtly rounded corners (`rounded-lg`), White background, distinct shadow to lift from background, variable height images.
*   **Inputs:** Clean lines, rounded corners (`rounded-md`), light gray border, darkening on focus.
*   **Icons:** Simple, outlined or filled style (Heart, Calendar, User), consistent stroke width.

## 5. Layout Principles
*   **Masonry Grid:** A multi-column layout (2 columns on mobile) where items stack vertically based on height, eliminating uneven gaps.
*   **Whitespace:** Generous padding around containers (`p-4`), consistent spacing between grid items (`gap-4`).
*   **Responsiveness:** Fluid layouts that adapt to screen width; full-width buttons on mobile.
*   **Visual Discovery:** Images are the primary content; text is secondary but accessible.
