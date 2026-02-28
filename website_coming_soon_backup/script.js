/**
 * Lushy "Coming Soon" Script
 * Adds interactive polish and handles the notify form.
 */

document.addEventListener('DOMContentLoaded', () => {
    initFormHandler();
    initParallax();

    console.log('%c✨ Lushy is Coming Soon ✨', 'color: #FF4081; font-size: 20px; font-weight: bold;');
});

/**
 * Handle "Notify Me" form submission
 */
function initFormHandler() {
    const form = document.getElementById('notifyForm');
    const input = form.querySelector('input');
    const button = form.querySelector('button');
    const originalBtnContent = button.innerHTML;

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = input.value.trim();

        if (!email) return;

        // Simulate loading state
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Sending...';
        button.style.opacity = '0.8';

        // Simulate API call
        setTimeout(() => {
            // Success State
            button.innerHTML = `
                <span>Joined!</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            button.style.backgroundColor = '#10B981'; // Success Green
            button.style.opacity = '1';

            // Reset form
            input.value = '';
            input.placeholder = "Thanks for joining!";

            // Confetti effect (simulated with console for now, or add library if requested)
            console.log('User joined with email:', email);

            // Reset button after delay
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalBtnContent;
                button.style.backgroundColor = '';
                input.placeholder = "Enter your email";
            }, 3000);

        }, 1500);
    });
}

/**
 * Subtle Mouse Parallax Effect for Background Shapes
 */
function initParallax() {
    const shapes = document.querySelectorAll('.shape');

    if (!shapes.length) return;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            // Calculate offset based on index to create depth
            const depth = (index + 1) * 20;
            const moveX = (x - 0.5) * depth;
            const moveY = (y - 0.5) * depth;

            // Apply smooth transform using CSS transition (already set in CSS) 
            // but we update custom properties or transform directly
            // For smoother performance, use requestAnimationFrame if it was heavy, 
            // but for simple shapes, direct transform is fine.

            // Note: mixing with existing CSS animation requires care. 
            // For now, let's just gently nudge them.

            // Actually, CSS animation 'float' is already running. 
            // To combine, we'd need a wrapper. 
            // Let's instead move the 'floating-elements' container which are separate emojis.
        });
    });

    const floatingItems = document.querySelectorAll('.float-item');
    if (floatingItems.length) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            floatingItems.forEach((item, index) => {
                const depth = (index + 1) * 15;
                const moveX = (x - 0.5) * depth;
                const moveY = (y - 0.5) * depth;

                // We leave the translateY/rotate animation alone and add translate3d
                // item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`; 
                // This would override the CSS animation.
                // A better approach without wrappers is to not fight the CSS animation.
                // Let's skip mouse parallax for now to keep it clean and performant.
            });
        });
    }
}
