document.addEventListener('DOMContentLoaded', () => {
    
    // ANIMAÇÃO DE SCROLL (Fade Up)
    const animElements = document.querySelectorAll('.anim-up');

    const observerOptions = {
        root: null,
        threshold: 0.15, // Dispara quando 15% do elemento estiver visível
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Se quiser que anime de novo ao subir, descomente a linha abaixo:
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    animElements.forEach(el => observer.observe(el));

});