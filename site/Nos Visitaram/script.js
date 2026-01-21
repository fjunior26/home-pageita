document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. GERENCIADOR DE ANIMAÇÕES DE SCROLL (REPETÍVEIS)
    // =========================================================
    
    // Seleciona todos os elementos que devem animar
    // .reveal-wrap: Texto com cortina
    // .anim-up: Elementos que sobem suavemente
    // .scroll-reveal: Elementos genéricos de fade
    const animatedElements = document.querySelectorAll('.reveal-wrap, .anim-up, .scroll-reveal');

    const observerOptions = {
        root: null,
        threshold: 0.15, // A animação dispara quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px" // Pequeno ajuste para não disparar cedo demais no rodapé
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Entrou na tela: Adiciona a classe que toca a animação
                // Usamos 'triggered' para o reveal e 'visible' para o scroll padrão
                entry.target.classList.add('triggered'); 
                entry.target.classList.add('visible'); 
            } else {
                // Saiu da tela: Remove a classe para resetar a animação
                // Assim, quando você voltar, ela toca de novo!
                entry.target.classList.remove('triggered');
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });


    // =========================================================
    // 2. SHOWCASE INTERATIVO (HOVER NA LISTA)
    // =========================================================
   const navItems = document.querySelectorAll('.nav-item');
    const showcaseImg = document.getElementById('showcaseImg');
    const showcaseTitle = document.getElementById('showcaseTitle');
    const showcaseDesc = document.getElementById('showcaseDesc');

    if (!navItems.length) return;

    let currentActive = null;

    function updateShowcase(item, instant = false) {
        const img = item.dataset.img;
        const title = item.dataset.title;
        const desc = item.dataset.desc;

        if (!instant) {
            showcaseImg.style.opacity = 0;
        }

        setTimeout(() => {
            showcaseImg.src = img;
            showcaseTitle.textContent = title;
            showcaseDesc.textContent = desc;

            showcaseImg.onload = () => {
                showcaseImg.style.opacity = 1;
            };
        }, instant ? 0 : 300);

        if (currentActive) currentActive.classList.remove('active');
        item.classList.add('active');
        currentActive = item;
    }

    // 🔹 INICIALIZA AUTOMATICAMENTE COM O PRIMEIRO ITEM
    updateShowcase(navItems[0], true);

    // 🔹 EVENTOS DE INTERAÇÃO
    navItems.forEach(item => {
        ['mouseenter', 'click'].forEach(evt => {
            item.addEventListener(evt, () => {
                if (item === currentActive) return;
                updateShowcase(item);
            });
        });
    });


    // =========================================================
    // 3. CARROSSEL DE DEPOIMENTOS
    // =========================================================
    const track = document.getElementById('testimonialTrack');
    
    if(track) {
        const slides = Array.from(track.children);
        const nextBtn = document.querySelector('.slider-btn.next');
        const prevBtn = document.querySelector('.slider-btn.prev');
        
        // Ajuste dinâmico da largura
        const updateSlidePosition = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
        };
        
        updateSlidePosition();
        window.addEventListener('resize', updateSlidePosition); // Corrige se redimensionar a tela

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        }

        nextBtn.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling || slides[0]; // Loop infinito
            moveToSlide(track, currentSlide, nextSlide);
        });

        prevBtn.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1]; // Loop infinito
            moveToSlide(track, currentSlide, prevSlide);
        });
    }
});