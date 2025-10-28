/*
================================================
|   SCRIPT LEAL VEÍCULOS (V2 - TAILWINDCSS)    |
================================================
*/

// (MUDANÇA) O array 'carsData' foi REMOVIDO daqui.

// (NOVO) Cria uma variável global para armazenar os dados dos carros
let allCarsData = [];

// (NOVO) Função para carregar os dados do JSON
async function loadCarData() {
    try {
        // O fetch é relativo ao ARQUIVO HTML (index.html, etc.), não ao script.js
        const response = await fetch('assets/data/carros.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        allCarsData = await response.json(); // Armazena na variável global
        return allCarsData;
    } catch (error) {
        console.error("Não foi possível carregar os dados dos carros:", error);
        return [];
    }
}

// (NOVO) Função para popular o <select> de Marcas
function populateBrandFilter() {
    const brandFilter = document.getElementById('filterBrand');
    if (!brandFilter) return; // Só executa se o elemento existir

    // Encontra todas as marcas únicas
    const brands = [...new Set(allCarsData.map(car => car.brand))];
    brands.sort(); // Ordena alfabeticamente

    // Adiciona cada marca como uma <option>
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

// (NOVO) Função para popular o <select> do Test-Drive
function populateTestDriveDropdown() {
    const modeloSelect = document.getElementById('modelo');
    if (!modeloSelect) return; // Só executa se o elemento existir

    // Limpa opções antigas (exceto a primeira "Selecione...")
    while (modeloSelect.options.length > 1) {
        modeloSelect.remove(1);
    }
    
    // Adiciona cada carro
    allCarsData.forEach(car => {
        const option = document.createElement('option');
        option.value = `${car.brand} ${car.model}`;
        option.textContent = `${car.brand} ${car.model} (${car.year})`;
        modeloSelect.appendChild(option);
    });

    // Adiciona a opção "Outro" no final
    const optionOutro = document.createElement('option');
    optionOutro.value = "Outro";
    optionOutro.textContent = "Outro (especificar)";
    modeloSelect.appendChild(optionOutro);
}


// (MUDANÇA) O DOMContentLoaded agora é 'async' para poder 'await'
document.addEventListener('DOMContentLoaded', async function() {
    
    // (MUDANÇA) Espera os dados carregarem ANTES de fazer qualquer outra coisa
    await loadCarData();
    
    // Inicia as funções básicas que não dependem dos dados
    initMobileMenu();
    initStickyNav();
    initActiveNavLinks();
    initFaqAccordion();
    initFormHandlers();
    
    // (MUDANÇA) Se não houver carros (erro ao carregar o JSON), mostra um aviso
    if (allCarsData.length === 0) {
        console.log("Nenhum dado de carro carregado. Funções de carro ignoradas.");
        
        // Trata a página de estoque
        const stockCarsContainer = document.getElementById('stockCars');
        const carCountEl = document.getElementById('carCount');
        if (stockCarsContainer) {
            stockCarsContainer.innerHTML = `
                <div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-card rounded-xl border border-border-color">
                    <i data-lucide="alert-triangle" class="w-16 h-16 text-primary-red mx-auto mb-4"></i>
                    <h3 class="text-2xl font-bold text-light">Erro ao carregar veículos</h3>
                    <p class="text-muted mt-2">Não foi possível carregar o estoque. Tente recarregar a página.</p>
                </div>
            `;
            if(carCountEl) carCountEl.textContent = 'Erro ao carregar';
        }
        // Trata a home
        const featuredCarsContainer = document.getElementById('featuredCars');
        if (featuredCarsContainer) {
            featuredCarsContainer.innerHTML = '<p class="text-muted col-span-3 text-center">Não foi possível carregar os destaques.</p>';
        }
        // Sai da função
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }
    
    // (MUDANÇA) Se os carros carregaram, executa o resto
    
    if (document.getElementById('featuredCars')) {
        renderFeaturedCars(allCarsData.slice(0, 3)); 
    }
    
    if (document.getElementById('stockCars')) {
        renderStockCars(allCarsData);
        initFilters(); // (MUDANÇA) Não precisa mais passar 'carsData'
        populateBrandFilter(); // (NOVO) Chama a função
    }
    
    const testDriveForm = document.getElementById('testDriveForm');
    if (testDriveForm) {
        populateTestDriveDropdown(); // (NOVO) Chama a função
        
        const dateInput = testDriveForm.querySelector('input[name="data"]');
        if (dateInput) {
            dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const modeloFromUrl = urlParams.get('modelo');
        const modeloSelect = testDriveForm.querySelector('select[name="modelo"]');
        
        if (modeloFromUrl && modeloSelect) {
            const optionExists = Array.from(modeloSelect.options).some(option => option.value === modeloFromUrl);
            if (optionExists) {
                modeloSelect.value = modeloFromUrl;
            } else {
                const outroOption = Array.from(modeloSelect.options).find(option => option.value.toLowerCase() === 'outro');
                if (outroOption) {
                    modeloSelect.value = outroOption.value;
                }
            }
        }
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // O resto do seu script.js original (formatadores)
    const cpfInput = document.getElementById('cpf');
    const nascInput = document.getElementById('nascimento');
    const entradaInput = document.getElementById('entrada');
    const rendaInput = document.getElementById('renda');

    if (cpfInput) cpfInput.addEventListener('input', formatCPF);
    if (nascInput) nascInput.addEventListener('input', formatDate);
    if (entradaInput) entradaInput.addEventListener('input', formatCurrencyInput);
    if (rendaInput) rendaInput.addEventListener('input', formatCurrencyInput);

});


// --- MÓDULO 1: Navegação ---
// (Sem mudanças)
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn'); 
    const mobileMenu = document.getElementById('mobile-menu'); 
    const menuIconWrapper = document.getElementById('menu-icon'); // Renomeei para 'menuIconWrapper'

    if (!menuBtn || !mobileMenu || !menuIconWrapper) return;

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        
        // (MUDANÇA) Agora, nós recriamos o ícone dentro do wrapper
        if (mobileMenu.classList.contains('hidden')) {
            // Se o menu fechou, apaga o 'x' e cria o 'menu'
            menuIconWrapper.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        } else {
            // Se o menu abriu, apaga o 'menu' e cria o 'x'
            menuIconWrapper.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
        }
        
        // Chamamos a função para "desenhar" o novo <i> que acabamos de criar
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

function initStickyNav() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const stickyClasses = 'shadow-xl bg-dark/95'; 

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (!navbar.classList.contains('shadow-xl')) {
                 navbar.classList.add(...stickyClasses.split(' '));
                 navbar.classList.remove('bg-card/95');
            }
        } else {
             if (navbar.classList.contains('shadow-xl')) {
                 navbar.classList.remove(...stickyClasses.split(' '));
                 navbar.classList.add('bg-card/95');
             }
        }
    });
}

function initActiveNavLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#navLinks a, #mobile-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('text-primary-red', 'font-bold');
            link.classList.remove('text-muted');
        } else {
            link.classList.remove('text-primary-red', 'font-bold');
            link.classList.add('text-muted');
        }
    });
}

// --- MÓDULO 2: Accordion (FAQ) ---
// (Sem mudanças)
function initFaqAccordion() {
    const faqContainer = document.getElementById('faq-container');
    if (!faqContainer) return;

    faqContainer.addEventListener('click', (e) => {
        const toggle = e.target.closest('.faq-toggle');
        if (!toggle) return;

        const content = toggle.nextElementSibling;
        const icon = toggle.querySelector('i');

        faqContainer.querySelectorAll('.faq-content').forEach((item) => {
            if (item !== content && item.style.maxHeight) {
                item.style.maxHeight = null;
                item.previousElementSibling.querySelector('i').classList.remove('rotate-180');
            }
        });

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.classList.remove('rotate-180');
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.classList.add('rotate-180');
        }
    });
}

// --- MÓDULO 3: Notificações (Toast) ---
// (Sem mudanças)
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-primary-red';
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 w-full ${bgColor} text-white text-sm font-semibold px-4 py-3 rounded-lg shadow-lg mb-2 animate-toast-in`;
    
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-5 h-5"></i>
        <span>${message}</span>
    `;

    container.prepend(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.classList.add('animate-toast-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000); 
}


// --- MÓDULO 4: Formulários ---
// (Sem mudanças)
function initFormHandlers() {
    
    const NOME_LOJA_NUMERO = "5589999374334";
    
    const simulacaoForm = document.getElementById('simulacaoForm');
    if (simulacaoForm) {
        simulacaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('nome')?.value.trim();
            const cpf = document.getElementById('cpf')?.value.trim();
            const nascimento = document.getElementById('nascimento')?.value.trim();
            const entrada = document.getElementById('entrada')?.value.trim();
            const renda = document.getElementById('renda')?.value.trim();

            if (!nome || !cpf || !nascimento || !entrada || !renda) {
                showToast('Por favor, preencha todos os campos.', 'error');
                return;
            }

            const mensagem = 
`Olá, Leal Veículos!%0A` +
`Gostaria de solicitar uma análise de financiamento:%0A%0A` +
`*Nome:* ${nome}%0A` +
`*CPF:* ${cpf}%0A` +
`*Data de Nasc.:* ${nascimento}%0A` +
`*Valor de Entrada:* ${entrada}%0A` +
`*Renda Mensal:* ${renda}`;
        
            const url = `https://api.whatsapp.com/send?phone=${NOME_LOJA_NUMERO}&text=${mensagem}`;
            
            window.open(url, '_blank');
            
            showToast('Abrindo WhatsApp para enviar sua análise...', 'success');
            e.target.reset();
        });
    }

    const testDriveForm = document.getElementById('testDriveForm');
    if (testDriveForm) {
        testDriveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const nome = formData.get('nome')?.trim();
            const telefone = formData.get('telefone')?.trim();
            const modelo = formData.get('modelo')?.trim();
            const data = formData.get('data')?.trim();
            const horario = formData.get('horario')?.trim();

            if (!nome || !telefone || !modelo || !data || !horario) {
                showToast('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            let dataFormatada = data;
            try {
                const [ano, mes, dia] = data.split('-');
                dataFormatada = `${dia}/${mes}/${ano}`;
            } catch (err) {}

            const mensagem = 
`Olá, Leal Veículos!%0A` +
`Gostaria de agendar um Test-Drive:%0A%0A` +
`*Nome:* ${nome}%0A` +
`*Telefone:* ${telefone}%0A` +
`*Veículo de Interesse:* ${modelo}%0A` +
`*Data:* ${dataFormatada}%0A` +
`*Horário:* ${horario}`;
        
            const url = `https://api.whatsapp.com/send?phone=${NOME_LOJA_NUMERO}&text=${mensagem}`;
            
            window.open(url, '_blank');
            
            showToast('Abrindo WhatsApp para agendar seu test-drive...', 'success');
            e.target.reset();
        });
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (!formData.get('nome') || !formData.get('email') || !formData.get('telefone') || !formData.get('mensagem')) {
                showToast('Por favor, preencha todos os campos.', 'error');
                return;
            }
            showToast('Mensagem enviada com sucesso! Responderemos em breve.');
            e.target.reset();
        });
    }
}


// --- MÓDULO 5: Renderização de Carros ---
// (Sem mudanças)
function renderCarCard(car) {
    const tagClass = car.status === 'Novo' 
        ? 'bg-secondary-yellow text-dark' 
        : 'bg-primary-red text-white';
    
    const priceHtml = car.price === 'Consultar Valor' 
        ? '<p class="text-2xl font-bold text-primary-red mb-5">Consultar Valor</p>'
        : `<p class="text-3xl font-bold text-primary-red mb-5">${car.price}</p>`;
        
    return `
        <div class="bg-card border border-border-color rounded-xl overflow-hidden shadow-lg
                    transition-all duration-300 hover:shadow-red hover:border-primary-red/50 hover:-translate-y-1 hover:scale-105
                    animate-fade-in group">
            <div class="relative overflow-hidden">
                <div class="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${tagClass}">
                    ${car.status}
                </div>
                
                <img src="${car.images[0]}" alt="${car.brand} ${car.model}" 
                     loading="lazy" class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110">
            </div>
            
            <div class="p-6">
                <p class="text-xs font-semibold text-muted uppercase tracking-wider">${car.brand}</p>
                <h3 class="text-2xl font-bold text-light mt-1 mb-4 truncate">${car.model}</h3>
                
                <div class="flex items-center justify-between text-muted text-sm border-t border-border-color pt-4 mb-4">
                    <span class="flex items-center gap-2">
                        <i data-lucide="calendar" class="w-4 h-4 text-secondary-yellow"></i>
                        ${car.year}
                    </span>
                    <span class="flex items-center gap-2">
                        <i data-lucide="gauge" class="w-4 h-4 text-secondary-yellow"></i>
                        ${car.km}
                    </span>
                </div>
                
                ${priceHtml}
                
                <button onclick="openModal(${car.id})" class="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary-red border-2 border-primary-red hover:bg-primary-red hover:text-white px-6 py-3 rounded-lg transition-all duration-300">
                    Ver Detalhes
                </button>
            </div>
        </div>
    `;
}

function renderFeaturedCars(featuredCars) {
    const container = document.getElementById('featuredCars');
    if (!container) return;
    
    container.innerHTML = featuredCars.map(renderCarCard).join('');
    lucide.createIcons(); 
}

function renderStockCars(cars) {
    const container = document.getElementById('stockCars');
    const countEl = document.getElementById('carCount');
    if (!container) return;

    if (cars.length > 0) {
        container.innerHTML = cars.map(renderCarCard).join('');
        if (countEl) {
            countEl.textContent = `${cars.length} ${cars.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}`;
        }
    } else {
        container.innerHTML = `
            <div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-card rounded-xl border border-border-color">
                <i data-lucide="search-x" class="w-16 h-16 text-primary-red mx-auto mb-4"></i>
                <h3 class="text-2xl font-bold text-light">Nenhum veículo encontrado</h3>
                <p class="text-muted mt-2">Tente ajustar seus filtros ou remover a busca textual.</p>
            </div>
        `;
        if (countEl) countEl.textContent = '0 veículos encontrados';
    }
    lucide.createIcons(); 
}


// --- MÓDULO 6: Filtros e Busca (Estoque) ---

// (MUDANÇA) As funções não recebem mais 'carsData' como argumento
function initFilters() {
    document.getElementById('searchBox')?.addEventListener('input', filterCars);
    document.getElementById('filterBrand')?.addEventListener('change', filterCars);
    document.getElementById('sortBy')?.addEventListener('change', filterCars);
}

function filterCars() {
    const searchBox = document.getElementById('searchBox');
    const brandFilter = document.getElementById('filterBrand');
    const sortBy = document.getElementById('sortBy');
    
    const searchTerm = searchBox ? searchBox.value.toLowerCase() : '';
    const brand = brandFilter ? brandFilter.value : 'todos';
    const sort = sortBy ? sortBy.value : 'default';

    // (MUDANÇA) Usa a variável global 'allCarsData'
    let filtered = [...allCarsData]; 

    if (searchTerm) {
        filtered = filtered.filter(car => 
            car.model.toLowerCase().includes(searchTerm) ||
            car.brand.toLowerCase().includes(searchTerm)
        );
    }

    if (brand !== 'todos') {
        filtered = filtered.filter(car => car.brand === brand);
    }
    
    switch (sort) {
        case 'price-desc':
            filtered.sort((a, b) => b.rawPrice - a.rawPrice);
            break;
        case 'price-asc':
            filtered.sort((a, b) => a.rawPrice - b.rawPrice);
            break;
        case 'year-desc':
            filtered.sort((a, b) => parseInt(b.year) - parseInt(a.year));
            break;
        case 'year-asc':
            filtered.sort((a, b) => parseInt(a.year) - parseInt(b.year));
            break;
    }

    renderStockCars(filtered);
}


// --- MÓDULO 7: Modal (Estoque) ---

function openModal(carId) {
    // (MUDANÇA) Usa a variável global 'allCarsData'
    const car = allCarsData.find(c => c.id === carId);
    if (!car) {
        showToast('Erro: Carro não encontrado.', 'error');
        return;
    }

    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    let featuresHtml = '';
    if (car.features && car.features.length > 0) {
        const featuresList = car.features.map(item => 
            `<li class="flex items-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-secondary-yellow"></i>
                <span>${item}</span>
            </li>`
        ).join('');
        
        featuresHtml = `
            <h4 class="text-lg font-bold text-light mb-3 mt-6">Destaques</h4>
            <ul class="space-y-2 text-muted text-sm">
                ${featuresList}
            </ul>
        `;
    }

    const slidesHtml = car.images.map((imgSrc, index) => `
        <div class="modal-slide w-full flex-shrink-0">
            <img src="${imgSrc}" alt="${car.brand} ${car.model} - Foto ${index + 1}" class="w-full h-full object-cover">
        </div>
    `).join('');

    const priceHtml = car.price === 'Consultar Valor' 
        ? '<p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-yellow mb-6">Consultar Valor</p>'
        : `<p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-red mb-6">${car.price}</p>`;

    modalContainer.innerHTML = `
        <div id="modal-backdrop" onclick="closeModal()"
             class="fixed inset-0 z-40 bg-dark/80 backdrop-blur-sm animate-fade-in"
             style="animation-duration: 0.3s;"></div>

        <div id="modal-content-wrapper"
             class="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto"
             onclick="closeModal()">

            <div id="modal-content" onclick="event.stopPropagation()"
                 class="w-full max-w-4xl bg-card rounded-xl shadow-2xl border border-border-color
                        animate-zoom-in my-8 md:my-auto relative"
                 style="animation-duration: 0.3s;">

                <button onclick="closeModal()"
                        class="absolute top-2 right-2 p-2 rounded-full text-muted hover:text-light hover:bg-border-color transition-colors z-30"
                        aria-label="Fechar modal">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <div class="grid grid-cols-1 md:grid-cols-2">

                    <div class="relative h-64 md:h-auto overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                        <div id="modal-slider-track" class="flex h-full transition-transform duration-300 ease-in-out">
                            ${slidesHtml}
                        </div>
                        <button id="modal-slider-prev" class="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-dark/50 rounded-full text-light hover:bg-dark z-20">
                            <i data-lucide="chevron-left" class="w-5 h-5"></i>
                        </button>
                        <button id="modal-slider-next" class="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-dark/50 rounded-full text-light hover:bg-dark z-20">
                            <i data-lucide="chevron-right" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="flex flex-col p-6 md:p-8">
                        <div>
                            <p class="text-sm font-semibold text-muted uppercase tracking-wider">${car.brand}</p>
                            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-light mt-1 mb-4">${car.model}</h2>
                            ${priceHtml}

                            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted text-sm mb-6">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="calendar" class="w-4 h-4 text-secondary-yellow"></i> ${car.year}
                                </span>
                                <span class="flex items-center gap-2">
                                    <i data-lucide="gauge" class="w-4 h-4 text-secondary-yellow"></i> ${car.km}
                                </span>
                                <span class="flex items-center gap-2">
                                    <i data-lucide="fuel" class="w-4 h-4 text-secondary-yellow"></i> ${car.specs.fuel}
                                </span>
                            </div>

                            <h4 class="text-lg font-bold text-light mb-3">Especificações</h4>
                            <ul class="space-y-2 text-muted mb-8 text-sm">
                                <li class="flex justify-between border-b border-border-color/50 pb-1"><span>Motor:</span> <span class="font-semibold text-light text-right">${car.specs.engine}</span></li>
                                <li class="flex justify-between border-b border-border-color/50 pb-1"><span>Potência:</span> <span class="font-semibold text-light text-right">${car.specs.power}</span></li>
                                <li class="flex justify-between"><span>Câmbio:</span> <span class="font-semibold text-light text-right">${car.specs.transmission}</span></li>
                            </ul>
                            
                            ${featuresHtml} 

                        </div>

                        <div class="mt-auto pt-6 border-t border-border-color">
                            <button onclick="openWhatsAppForCar('${car.brand}', '${car.model}')"
                               class="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                                <i data-lucide="message-circle" class="w-5 h-5"></i>
                                Entrar em Contato
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
    
    initModalSlider(car.images.length);
}

// (Sem mudanças)
function initModalSlider(slideCount) {
    const track = document.getElementById('modal-slider-track');
    const nextBtn = document.getElementById('modal-slider-next');
    const prevBtn = document.getElementById('modal-slider-prev');
    
    if (!track || !nextBtn || !prevBtn || slideCount <= 1) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        return;
    }

    let currentIndex = 0;
    const maxIndex = slideCount - 1;

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxIndex;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
    }

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    updateSlider();
}

// (Sem mudanças)
function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContentWrapper = document.getElementById('modal-content-wrapper');
    const modalContent = document.getElementById('modal-content');
    
    if (!modalContainer || !modalContentWrapper || !modalBackdrop || !modalContent) {
        if(modalContainer) modalContainer.innerHTML = '';
        if(modalContainer) modalContainer.classList.add('hidden');
        document.body.style.overflow = 'auto';
        return;
    }

    modalBackdrop.classList.remove('animate-fade-in'); 
    modalBackdrop.classList.add('opacity-0', 'transition-opacity', 'duration-300', 'ease-in');

    modalContent.classList.remove('animate-zoom-in'); 
    modalContent.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-300', 'ease-in');

    setTimeout(() => {
        if (document.getElementById('modal-container')) {
            modalContainer.innerHTML = ''; 
            modalContainer.classList.add('hidden');
        }
        document.body.style.overflow = 'auto'; 
    }, 300); 
}


// --- MÓDULO 8: (Removido) ---


// --- MÓDULO 9: Utilitários ---
// (Sem mudanças)
function formatCurrency(value) {
    if (isNaN(value)) {
        return 'R$ -';
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0, 
    }).format(value);
}

function openWhatsApp() {
    const number = '5589999374334'; 
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os veículos.');
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
}

function openWhatsAppForCar(brand, model) {
    const number = '5589999374334';
    const message = encodeURIComponent(`Olá, Leal Veículos! Tenho interesse no ${brand} ${model} e gostaria de mais informações.`);
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
}

// --- MÓDULO 10: Formatadores de Input (Máscaras) ---
// (Sem mudanças)
function formatCPF(e) {
    let value = e.target.value.replace(/\D/g, ''); 
    value = value.substring(0, 11); 

    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    e.target.value = value;
}

function formatDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 8); 

    if (value.length > 4) {
        value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    e.target.value = value;
}

function formatCurrencyInput(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    
    if (value) {
        let number = parseInt(value, 10);
        if (isNaN(number)) {
            value = '';
        } else {
             value = 'R$ ' + number.toLocaleString('pt-BR');
        }
    } else {
        value = '';
    }
    e.target.value = value;
}