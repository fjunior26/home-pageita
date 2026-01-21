document.addEventListener('DOMContentLoaded', () => {

    // 1. ANIMAÇÃO DOS NÚMEROS (STATS)
    const stats = document.querySelectorAll('.stat-card h3');
    let started = false;

    const startCount = (el) => {
        const target = +el.getAttribute('data-target');
        const increment = target / 100;
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target.toLocaleString('pt-BR'); // Formata com pontos (12.000)
                clearInterval(timer);
            } else {
                el.innerText = Math.ceil(current).toLocaleString('pt-BR');
            }
        }, 20);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            stats.forEach(stat => startCount(stat));
            started = true;
        }
    });

    const statsSection = document.querySelector('.tech-stats-section');
    if(statsSection) statsObserver.observe(statsSection);


    // 2. FILTRO DA GALERIA
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.bp-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active dos botões
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            items.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10); // Fade in suave
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300); // Espera fade out
                }
            });
        });
    });


    // 3. ACCORDION (DESAFIOS)
    const accItems = document.querySelectorAll('.acc-item');

    accItems.forEach(item => {
        const header = item.querySelector('.acc-header');
        header.addEventListener('click', () => {
            // Fecha outros (opcional - remova se quiser abrir vários)
            accItems.forEach(i => {
                if(i !== item) {
                    i.classList.remove('active');
                    i.querySelector('.acc-body').style.maxHeight = null;
                }
            });

            // Abre/Fecha atual
            item.classList.toggle('active');
            const body = item.querySelector('.acc-body');
            if (item.classList.contains('active')) {
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = null;
            }
        });
    });


    // 4. MODAL DE ZOOM (LIGHTBOX)
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('modalImage');
    const thumbs = document.querySelectorAll('.bp-thumb');
    const closeModal = document.querySelector('.close-modal');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = thumb.querySelector('img').src;
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Fecha ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });
});