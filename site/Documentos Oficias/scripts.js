document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. LÓGICA DA PÁGINA HOME (CARROSSEL, TIMELINE)
       ========================================================================= */
    const historicoContainer = document.getElementById('historicoContainer');
    if (historicoContainer) {
        // ... (Mantém o código da Home se você tiver, senão o JS foca nos documentos)
    }

    /* =========================================================================
       2. LÓGICA DA PÁGINA DOCUMENTOS
       ========================================================================= */
    const docsGridElement = document.getElementById('docsGrid');

    if (docsGridElement) {
        
        // --- 1. BANCO DE DADOS DE DOCUMENTOS ---
        const docsDatabase = [
            // SEU DOCUMENTO (Nome simplificado e corrigido)
            { 
                title: "Portaria GABAER - Criação do ITA Fortaleza", 
                category: "portaria", 
                date: "07/10/2024", 
                arquivo: "portaria_ita.pdf" 
            },
            
            // Outros exemplos
            { title: "Estudo de Viabilidade (EVTE)", category: "estudo", date: "15/12/2024", arquivo: "dummy.pdf" },
            { title: "Planta Baixa Geral", category: "projeto", date: "10/12/2024", arquivo: "dummy.pdf" },
            { title: "Ata da Pedra Fundamental", category: "ata", date: "18/10/2024", arquivo: "dummy.pdf" },
        ];

        // --- 2. CONFIGURAÇÕES VISUAIS ---
        const categoryConfig = {
            portaria: { icon: 'fa-gavel', color: '#e74c3c', label: 'Portaria' },
            ata: { icon: 'fa-file-signature', color: '#f39c12', label: 'Ata' },
            estudo: { icon: 'fa-microscope', color: '#9b59b6', label: 'Estudo' },
            projeto: { icon: 'fa-ruler-combined', color: '#3498db', label: 'Projeto' },
            relatorio: { icon: 'fa-chart-pie', color: '#2ecc71', label: 'Relatório' },
            convenio: { icon: 'fa-handshake', color: '#16a085', label: 'Convênio' },
            parecer: { icon: 'fa-check-circle', color: '#34495e', label: 'Parecer' },
            todos: { icon: 'fa-file', color: '#ccc', label: 'Documento' }
        };

        // --- 3. FUNÇÕES (Dashboard, Filtro, Modal) ---
        function animateCounters(data) {
            document.getElementById('totalDocs').setAttribute('data-target', data.length);
            document.getElementById('countPortarias').setAttribute('data-target', data.filter(d => d.category === 'portaria').length);
            document.getElementById('countProjetos').setAttribute('data-target', data.filter(d => d.category === 'projeto').length);

            document.querySelectorAll('.counter').forEach(counter => {
                counter.innerText = '0';
                const target = +counter.getAttribute('data-target');
                const increment = Math.ceil(target / 50); 
                if (target === 0) return;
                const updateCount = () => {
                    const c = +counter.innerText;
                    if(c < target) {
                        counter.innerText = c + increment > target ? target : c + increment;
                        setTimeout(updateCount, 30);
                    } else { counter.innerText = target; }
                };
                updateCount();
            });
        }

        function parseDate(dateStr) {
            const parts = dateStr.split('/');
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }

        function renderAndSort(data) {
            const sortMode = document.getElementById('docSort').value;
            const noDocsMsg = document.getElementById('noDocsMessage');
            
            data.sort((a, b) => {
                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                if (sortMode === 'newest') return dateB - dateA;
                if (sortMode === 'oldest') return dateA - dateB;
                if (sortMode === 'az') return a.title.localeCompare(b.title);
            });

            docsGridElement.innerHTML = '';
            
            if (data.length === 0) {
                noDocsMsg.style.display = 'block';
            } else {
                noDocsMsg.style.display = 'none';
                data.forEach((doc, index) => {
                    const config = categoryConfig[doc.category] || categoryConfig.todos;
                    const isNew = doc.date.includes('2025');
                    const badgeHtml = isNew ? `<span class="badge-new">NOVO</span>` : '';
                    
                    const fileUrl = `documentos/${doc.arquivo}`;

                    const div = document.createElement('div');
                    div.className = 'doc-card';
                    div.style.setProperty('--card-color', config.color);
                    div.style.opacity = '0'; 
                    div.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;

                    div.innerHTML = `
                        <div class="doc-top">
                            <div class="doc-icon-wrapper">
                                <i class="fas ${config.icon}" style="color: ${config.color}"></i>
                            </div>
                            <span class="doc-type-badge">${config.label}</span>
                        </div>
                        <div class="doc-content">
                            <h4 class="doc-title">${doc.title} ${badgeHtml}</h4>
                            <p class="doc-date"><i class="far fa-calendar-alt"></i> ${doc.date}</p>
                        </div>
                        <div class="doc-actions">
                            <button class="btn-view" onclick="openDocPreview('${fileUrl}', '${doc.title}')">
                                <i class="fas fa-eye"></i> Visualizar
                            </button>
                            <a href="${fileUrl}" class="btn-download" download target="_blank" title="Baixar Arquivo">
                                <i class="fas fa-download"></i>
                            </a>
                        </div>
                    `;
                    docsGridElement.appendChild(div);
                });
            }
        }

        // --- INICIALIZAÇÃO ---
        animateCounters(docsDatabase);
        renderAndSort(docsDatabase);

        // --- EVENTOS ---
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('docSearch');
        const sortSelect = document.getElementById('docSort');
        let currentCategory = 'todos';

        const applyFilters = () => {
            const text = searchInput.value.toLowerCase();
            let filtered = docsDatabase.filter(d => {
                const matchesCategory = currentCategory === 'todos' || d.category === currentCategory;
                const matchesSearch = d.title.toLowerCase().includes(text) || d.date.includes(text);
                return matchesCategory && matchesSearch;
            });
            renderAndSort(filtered);
        };

        filterButtons.forEach(btn => {
            btn.onclick = () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.getAttribute('data-category');
                applyFilters();
            };
        });

        searchInput.oninput = applyFilters;
        sortSelect.onchange = applyFilters;

        // --- MODAL ---
        const docModal = document.getElementById('docModal');
        const modalDocBody = document.getElementById('modalDocBody');
        const modalDocTitle = document.getElementById('modalDocTitle');
        const modalDownloadBtn = document.getElementById('modalDownloadBtn');
        
        window.openDocPreview = (url, title) => {
            docModal.style.display = 'flex';
            modalDocTitle.innerText = title;
            modalDownloadBtn.href = url;
            modalDocBody.innerHTML = '';

            if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
                modalDocBody.innerHTML = `<img src="${url}" style="max-width:100%; max-height:100%; object-fit:contain; margin:auto; display:block;">`;
            } else {
                modalDocBody.innerHTML = `<iframe src="${url}" width="100%" height="100%" style="border:none;"></iframe>`;
            }
        };
        
        document.querySelector('.close-doc-modal').onclick = () => { docModal.style.display = 'none'; modalDocBody.innerHTML = ''; };
        window.onclick = (e) => { if (e.target == docModal) { docModal.style.display = 'none'; modalDocBody.innerHTML = ''; }};
    }
});