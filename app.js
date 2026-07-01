// Main application control script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Tab Switching Logic for Systems Playground
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Deactivate all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate current tab
            button.classList.add('active');
            const contentElement = document.getElementById(`tab-${targetTab}`);
            if (contentElement) {
                contentElement.classList.add('active');
            }
        });
    });

    // 3. Simple Agent Terminal Clock/Timer
    const clockElement = document.getElementById('terminal-clock');
    if (clockElement) {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toTimeString().split(' ')[0];
            clockElement.textContent = timeString;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }
});
