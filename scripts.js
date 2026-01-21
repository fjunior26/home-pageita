document.addEventListener("DOMContentLoaded", function () {
    console.log("Sistema iniciado...");

    /* =========================================
       INICIALIZAÇÃO DO CARROSSEL
       Tenta carregar a lógica do slider de cards
    ========================================= */
    try {
        initCarousel();
    } catch (error) {
        console.error("Erro no Carrossel:", error);
    }

    /* =========================================
       INICIALIZAÇÃO DA ANIMAÇÃO DE TEXTO
       Tenta carregar o efeito "palavra por palavra"
    ========================================= */
    try {
        initTextAnimation();
    } catch (error) {
        console.error("Erro no Texto Animado:", error);
    }
});

/* =========================================
   FUNÇÃO PRINCIPAL DO CARROSSEL
   Controla rolagem automática, cliques e arrasto
========================================= */
function initCarousel() {
    const track = document.getElementById('track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const wrapper = document.getElementById('wrapper');

    // Verificação de segurança: se faltar algum elemento, para a execução sem quebrar o site
    if (!track || !prevBtn || !nextBtn) {
        console.warn("Elementos do carrossel não encontrados. Verifique o HTML.");
        return; 
    }

    const cardWidth = 320; // Largura do card (300px) + espaço (20px)
    let autoPlayInterval;

    // Função que calcula o deslocamento do scroll
    function moveCarousel(direction) {
        if (direction === 'next') {
            // Se chegou no fim, volta para o começo (loop infinito visual)
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        } else {
            // Volta um card
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
    }

    // Inicia a troca automática a cada 5 segundos
    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => moveCarousel('next'), 5000);
    }

    // Para a troca automática (usado quando o usuário interage)
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // --- EVENTOS DE CLIQUE NAS SETAS ---
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        moveCarousel('next');
        startAutoPlay(); // Reinicia contagem após clique
    });

    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        moveCarousel('prev');
        startAutoPlay();
    });

    // --- LÓGICA DE ARRASTAR (DRAG & DROP) COM O MOUSE ---
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        stopAutoPlay(); // Para automação enquanto arrasta
        track.classList.add('active');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.cursor = 'grabbing'; // Muda cursor para "mão fechada"
        track.style.scrollBehavior = 'auto'; // Remove suavidade para arrasto ficar rápido
    });

    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'grab';
        track.style.scrollBehavior = 'smooth';
        startAutoPlay(); // Retoma automação se mouse sair
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'grab';
        track.style.scrollBehavior = 'smooth';
        startAutoPlay(); // Retoma automação ao soltar
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Só executa se estiver clicando
        e.preventDefault(); // Evita selecionar texto/imagens enquanto arrasta
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2; // Multiplicador ajusta a velocidade do arrasto
        track.scrollLeft = scrollLeft - walk;
    });

    // Inicia o carrossel assim que carrega
    startAutoPlay();
}

/* =========================================
   FUNÇÃO DO TEXTO ANIMADO (Scroll Intersection)
   Faz as palavras subirem conforme aparecem na tela
========================================= */
function initTextAnimation() {
    const containerTexto = document.getElementById('barra-lateral');
    const paragrafo = document.getElementById('texto-animado');

    if (!containerTexto || !paragrafo) {
        console.warn("Elementos de texto não encontrados.");
        return;
    }

    // 1. Quebra o texto em palavras individuais envolvidas em <span>
    const textoOriginal = paragrafo.innerText;
    paragrafo.innerHTML = textoOriginal.split(' ').map(palavra => 
        `<span class="palavra-animada">${palavra}</span>`
    ).join(' ');

    const spans = document.querySelectorAll('.palavra-animada');
    let timeouts = []; // Lista para controlar os timers da animação

    // 2. Configura o Observador de Interseção (Scroll)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            
            if (entry.isIntersecting) {
                // === ENTROU NA TELA (Inicia Animação) ===
                containerTexto.classList.add('visivel');

                spans.forEach((span, index) => {
                    const id = setTimeout(() => {
                        span.classList.add('palavra-visivel');
                    }, index * 30); // Delay de 30ms entre cada palavra
                    timeouts.push(id); 
                });

            } else {
                // === SAIU DA TELA (Reseta tudo) ===
                
                containerTexto.classList.remove('visivel');

                // Limpa animações pendentes para não bugar se rolar rápido
                timeouts.forEach(id => clearTimeout(id));
                timeouts = []; 

                // Esconde as palavras novamente
                spans.forEach(span => {
                    span.classList.remove('palavra-visivel');
                });
            }
        });
    }, { threshold: 0.5 }); // Dispara quando 50% do elemento está visível

    observer.observe(containerTexto);
}