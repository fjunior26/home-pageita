document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       CARROSSEL DO HISTÓRICO DE EVOLUÇÃO
       ========================================= */
    const historicoContainer = document.getElementById('historicoContainer');
    const btnPrevHistory = document.getElementById('btnPrevHistory');
    const btnNextHistory = document.getElementById('btnNextHistory');

    // Valor de rolagem: Tamanho do card (320px) + gap (30px)
    const scrollAmount = 350; 

    if (btnNextHistory && btnPrevHistory && historicoContainer) {
        
        btnNextHistory.onclick = () => {
            historicoContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        };

        btnPrevHistory.onclick = () => {
            historicoContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        };
    }


    /* =========================================
       LINHA DO TEMPO (LOGICA)
       ========================================= */
    
    // Imagens placeholder
    const img1 = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600";
    const img2 = "https://images.unsplash.com/photo-1590486803833-1c5dc8ce2ac6?w=300";
    const img3 = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300";

    const timelineData = {
        2025: [
            { month: "JAN", title: "Início", desc: "Canteiro de obras instalado.", imgs: [img1, img2, img3] },
            { month: "FEV", title: "Fundações", desc: "Estacas concluídas.", imgs: [img1, img2, img3] },
            { month: "MAR", title: "Estrutura", desc: "Vigas e pilares.", imgs: [img1, img2, img3] },
            { month: "ABR", title: "Alvenaria", desc: "Paredes subindo.", imgs: [img1, img2, img3] },
            { month: "MAI", title: "Laje 1", desc: "Concretagem da laje.", imgs: [img1, img2, img3] },
            { month: "JUN", title: "Instalações", desc: "Elétrica e Hidráulica.", imgs: [img1, img2, img3] },
            { month: "JUL", title: "Reboco", desc: "Acabamento grosso.", imgs: [img1, img2, img3] },
            { month: "AGO", title: "Contrapiso", desc: "Regularização de piso.", imgs: [img1, img2, img3] },
            { month: "SET", title: "Telhado", desc: "Cobertura metálica.", imgs: [img1, img2, img3] },
            { month: "OUT", title: "Janelas", desc: "Esquadrias instaladas.", imgs: [img1, img2, img3] },
            { month: "NOV", title: "Pintura", desc: "Primeira demão.", imgs: [img1, img2, img3] },
            { month: "DEZ", title: "Fim Fase 1", desc: "Estrutura pronta.", imgs: [img1, img2, img3] }
        ],
        2026: [
            { month: "JAN", title: "Gesso", desc: "Forro iniciado.", imgs: [img1, img2, img3] },
            { month: "FEV", title: "Pisos", desc: "Porcelanato sala.", imgs: [img1, img2, img3] },
            { month: "MAR", title: "Azulejos", desc: "Revestimento cozinha.", imgs: [img1, img2, img3] },
            { month: "ABR", title: "Louças", desc: "Pias e vasos.", imgs: [img1, img2, img3] },
            { month: "MAI", title: "Metais", desc: "Torneiras instaladas.", imgs: [img1, img2, img3] },
            { month: "JUN", title: "Luzes", desc: "Iluminação LED.", imgs: [img1, img2, img3] },
            { month: "JUL", title: "Móveis", desc: "Planejados.", imgs: [img1, img2, img3] },
            { month: "AGO", title: "Vidros", desc: "Box de banheiro.", imgs: [img1, img2, img3] },
            { month: "SET", title: "Jardim", desc: "Paisagismo externo.", imgs: [img1, img2, img3] },
            { month: "OUT", title: "Limpeza", desc: "Limpeza final.", imgs: [img1, img2, img3] },
            { month: "NOV", title: "Vistoria", desc: "Aprovação cliente.", imgs: [img1, img2, img3] },
            { month: "DEZ", title: "Entrega", desc: "Chaves entregues.", imgs: [img1, img2, img3] }
        ]
    };

    let currentYear = 2025;
    let currentIndex = 0;

    const displayYear = document.getElementById('displayYear');
    const nodesContainer = document.getElementById('nodesContainer');
    const progressFill = document.getElementById('progressFill');
    const btnPrev = document.getElementById('btnPrevYear');
    const btnNext = document.getElementById('btnNextYear');
    
    const infoCard = document.getElementById('infoCard');
    const galleryContainer = document.getElementById('galleryContainer');
    const cardMonth = document.getElementById('cardMonth');
    const cardTitle = document.getElementById('cardTitle');
    const cardDesc = document.getElementById('cardDesc');

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeModal = document.querySelector('.close-modal');

    init();

    function init() {
        renderTimeline();
        updateButtons();
    }

    function renderTimeline() {
        displayYear.innerText = currentYear;
        nodesContainer.innerHTML = '';
        
        const data = timelineData[currentYear];

        data.forEach((item, index) => {
            const node = document.createElement('div');
            node.className = 't-node';
            
            const span = document.createElement('span');
            span.innerText = item.month;
            node.appendChild(span);

            if (index < currentIndex) node.classList.add('passed');
            if (index === currentIndex) node.classList.add('active');

            node.onclick = () => {
                currentIndex = index;
                renderTimeline();
            };
            nodesContainer.appendChild(node);
        });

        const percent = (currentIndex / (data.length - 1)) * 100;
        progressFill.style.width = percent + '%';

        updateCard(data[currentIndex]);
    }

    function updateCard(item) {
        infoCard.classList.remove('visible');
        
        setTimeout(() => {
            cardMonth.innerText = item.month;
            cardTitle.innerText = item.title;
            cardDesc.innerText = item.desc;
            
            galleryContainer.innerHTML = '';
            item.imgs.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.onclick = () => openModal(src);
                galleryContainer.appendChild(img);
            });
            
            infoCard.classList.add('visible');
        }, 300);
    }

    function openModal(src) {
        modal.style.display = "flex";
        modalImg.src = src;
        document.body.style.overflow = "hidden";
    }

    if (closeModal) {
        closeModal.onclick = () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    modal.onclick = (e) => {
        if(e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    function updateButtons() {
        btnPrev.disabled = (currentYear === 2025);
        btnNext.disabled = (currentYear === 2026);
    }

    btnPrev.onclick = () => {
        if(currentYear > 2025) {
            currentYear--;
            currentIndex = 0; 
            init();
        }
    };

    btnNext.onclick = () => {
        if(currentYear < 2026) {
            currentYear++;
            currentIndex = 0; 
            init();
        }
    };
});