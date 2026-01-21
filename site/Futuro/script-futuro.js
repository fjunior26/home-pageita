document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos para animar
    const animElements = document.querySelectorAll('.anim-up, .anim-left, .anim-right');

    const observerOptions = {
        root: null,
        threshold: 0.15, 
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    animElements.forEach(el => observer.observe(el));

});