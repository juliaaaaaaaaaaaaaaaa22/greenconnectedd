document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gráfico de consumo de água
    const waterCtx = document.getElementById('waterChart').getContext('2d');
    const waterChart = new Chart(waterCtx, {
        type: 'bar',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Consumo de Água (L)',
                data: [10.5, 12.3, 8.7, 14.2, 11.8, 9.5, 12.5],
                backgroundColor: 'rgba(46, 125, 50, 0.7)',
                borderColor: 'rgba(46, 125, 50, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Litros (L)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Atualizar círculo de progresso
    const progressCircle = document.querySelector('.progress-ring-circle');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
    
    function setProgress(percent) {
        const offset = circumference - percent / 100 * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    setProgress(78); // Definir progresso inicial para 78%

    // Controle do modal
    const modal = document.getElementById('irrigationModal');
    const openModalBtn = document.querySelector('.irrigation-now');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.btn.cancel');
    
    function toggleModal() {
        modal.classList.toggle('active');
    }
    
    openModalBtn.addEventListener('click', toggleModal);
    closeModalBtn.addEventListener('click', toggleModal);
    cancelBtn.addEventListener('click', toggleModal);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            toggleModal();
        }
    });

    // Controle de zona de irrigação
    const zoneButtons = document.querySelectorAll('.zone-btn');
    
    zoneButtons.forEach(button => {
        button.addEventListener('click', function() {
            zoneButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Controle de duração
    const durationButtons = document.querySelectorAll('.duration-btn');
    const customDuration = document.querySelector('.custom-duration input');
    
    durationButtons.forEach(button => {
        button.addEventListener('click', function() {
            durationButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            customDuration.value = this.textContent.match(/\d+/)[0];
        });
    });
    
    customDuration.addEventListener('change', function() {
        durationButtons.forEach(btn => btn.classList.remove('active'));
    });

    // Controle de intensidade
    const intensitySlider = document.querySelector('.intensity-slider');
    const currentValue = document.querySelector('.current-value');
    
    intensitySlider.addEventListener('input', function() {
        currentValue.textContent = `${this.value}%`;
    });

    // Simular dados dos sensores (atualização periódica)
    function updateSensorData() {
        const sensors = [
            { selector: '.temperature strong', min: 18, max: 32 },
            { selector: '.humidity strong', min: 30, max: 80 },
            { selector: '.light strong', min: 200, max: 1200 },
            { selector: '.soil strong', min: 20, max: 80 }
        ];
        
        sensors.forEach(sensor => {
            const element = document.querySelector(sensor.selector);
            if (element) {
                const currentValue = parseInt(element.textContent);
                const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 a +2
                let newValue = currentValue + fluctuation;
                
                // Manter dentro dos limites
                newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));
                
                element.textContent = sensor.selector.includes('light') ? 
                    `${newValue} lux` : 
                    sensor.selector.includes('temperature') ? 
                    `${newValue}°C` : 
                    `${newValue}%`;
            }
        });
        
        // Atualizar umidade do solo no progresso
        const soilValue = parseInt(document.querySelector('.soil strong').textContent);
        const progressText = document.querySelector('.progress-text');
        const newProgress = Math.min(100, Math.floor((soilValue / 65) * 100));
        
        progressText.textContent = `${newProgress}%`;
        setProgress(newProgress);
    }
    
    // Atualizar a cada 5 segundos
    setInterval(updateSensorData, 5000);

    // Navegação entre seções
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Ativar link de navegação
            navLinks.forEach(item => item.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Mostrar seção correspondente
            const target = this.getAttribute('href');
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target.substring(1)) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Botão de irrigação manual
    const confirmBtn = document.querySelector('.btn.confirm');
    
    confirmBtn.addEventListener('click', function() {
        const zone = document.querySelector('.zone-btn.active').textContent;
        const duration = customDuration.value;
        const intensity = intensitySlider.value;
        
        // Simular início da irrigação
        alert(`Iniciando irrigação na ${zone} por ${duration} minutos com intensidade de ${intensity}%`);
        toggleModal();
        
        // Adicionar notificação
        const alertList = document.querySelector('.alert-list');
        const newAlert = document.createElement('div');
        newAlert.className = 'alert-item success';
        newAlert.innerHTML = `
            <div class="alert-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="alert-content">
                <strong>Irrigação manual iniciada</strong>
                <p>${zone} por ${duration} minutos (${intensity}%)</p>
                <small>Agora</small>
            </div>
        `;
        alertList.prepend(newAlert);
    });

    // Botão de parada de emergência
    const emergencyStop = document.querySelector('.emergency-stop');
    
    emergencyStop.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja parar todo o sistema de irrigação?')) {
            // Simular parada de emergência
            alert('Sistema de irrigação desativado com segurança');
            
            // Adicionar notificação
            const alertList = document.querySelector('.alert-list');
            const newAlert = document.createElement('div');
            newAlert.className = 'alert-item warning';
            newAlert.innerHTML = `
                <div class="alert-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="alert-content">
                    <strong>Parada de emergência ativada</strong>
                    <p>Todas as zonas de irrigação foram desativadas</p>
                    <small>Agora</small>
                </div>
            `;
            alertList.prepend(newAlert);
        }
    });
});
// Banco de dados de plantas pré-cadastradas
const plantDatabase = [
    {
        id: 1,
        name: "Tomate Cereja",
        type: "vegetable",
        typeName: "Hortaliça",
        waterNeed: "medium",
        waterNeedName: "Média",
        idealHumidity: "60-75%",
        dailyWater: "500-700ml",
        photo: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Alface",
        type: "vegetable",
        typeName: "Hortaliça",
        waterNeed: "high",
        waterNeedName: "Alta",
        idealHumidity: "70-85%",
        dailyWater: "800-1000ml",
        photo: "https://images.unsplash.com/photo-1604339454409-701c5278c546?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Manjericão",
        type: "herb",
        typeName: "Erva",
        waterNeed: "medium-high",
        waterNeedName: "Média-alta",
        idealHumidity: "50-70%",
        dailyWater: "300-500ml",
        photo: "https://images.unsplash.com/photo-1605210057204-50f1100d59c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Suculenta",
        type: "ornamental",
        typeName: "Ornamental",
        waterNeed: "low",
        waterNeedName: "Baixa",
        idealHumidity: "30-50%",
        dailyWater: "50-100ml",
        photo: "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Morango",
        type: "fruit",
        typeName: "Frutífera",
        waterNeed: "medium",
        waterNeedName: "Média",
        idealHumidity: "60-75%",
        dailyWater: "500-700ml",
        photo: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Pimenta",
        type: "vegetable",
        typeName: "Hortaliça",
        waterNeed: "medium-low",
        waterNeedName: "Média-baixa",
        idealHumidity: "40-60%",
        dailyWater: "300-400ml",
        photo: "https://images.unsplash.com/photo-1603048719537-93e55a9e8f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
];

// Variáveis para controle das plantas
let currentPlant = plantDatabase[0]; // Tomate como padrão
let customPlants = [];
let plantModal, customPlantModal;

// Inicializar modais de plantas
function initPlantModals() {
    plantModal = document.getElementById('plantModal');
    customPlantModal = document.getElementById('customPlantModal');
    
    // Botões para abrir modais
    document.getElementById('editPlantBtn').addEventListener('click', () => {
        plantModal.classList.add('active');
        loadPlantGrid();
    });
    
    document.getElementById('addCustomPlantBtn').addEventListener('click', () => {
        plantModal.classList.remove('active');
        customPlantModal.classList.add('active');
    });
    
    // Fechar modais
    plantModal.querySelector('.close-modal').addEventListener('click', () => {
        plantModal.classList.remove('active');
    });
    
    customPlantModal.querySelector('.close-modal').addEventListener('click', () => {
        customPlantModal.classList.remove('active');
    });
    
    // Cancelar
    customPlantModal.querySelector('.btn.cancel').addEventListener('click', () => {
        customPlantModal.classList.remove('active');
    });
    
    // Salvar planta personalizada
    document.getElementById('saveCustomPlantBtn').addEventListener('click', saveCustomPlant);
    
    // Controles de range
    const humidityMin = document.getElementById('customPlantHumidityMin');
    const humidityMax = document.getElementById('customPlantHumidityMax');
    const humidityMinValue = document.getElementById('humidityMinValue');
    const humidityMaxValue = document.getElementById('humidityMaxValue');
    
    humidityMin.addEventListener('input', () => {
        humidityMinValue.textContent = humidityMin.value;
        if (parseInt(humidityMin.value) > parseInt(humidityMax.value)) {
            humidityMax.value = humidityMin.value;
            humidityMaxValue.textContent = humidityMin.value;
        }
    });
    
    humidityMax.addEventListener('input', () => {
        humidityMaxValue.textContent = humidityMax.value;
        if (parseInt(humidityMax.value) < parseInt(humidityMin.value)) {
            humidityMin.value = humidityMax.value;
            humidityMinValue.textContent = humidityMax.value;
        }
    });
}

// Carregar grid de plantas
function loadPlantGrid(filter = '', category = 'all') {
    const plantGrid = document.getElementById('plantGrid');
    plantGrid.innerHTML = '';
    
    const plantsToShow = [...plantDatabase, ...customPlants]
        .filter(plant => {
            const matchesSearch = plant.name.toLowerCase().includes(filter.toLowerCase());
            const matchesCategory = category === 'all' || plant.type === category;
            return matchesSearch && matchesCategory;
        });
    
    if (plantsToShow.length === 0) {
        plantGrid.innerHTML = '<p class="no-plants">Nenhuma planta encontrada</p>';
        return;
    }
    
    plantsToShow.forEach(plant => {
        const plantItem = document.createElement('div');
        plantItem.className = 'plant-item';
        plantItem.innerHTML = `
            <div class="plant-item-img">
                ${plant.photo ? 
                    `<img src="${plant.photo}" alt="${plant.name}">` : 
                    `<i class="fas fa-seedling"></i>`}
            </div>
            <div class="plant-item-info">
                <div class="plant-item-name">${plant.name}</div>
                <div class="plant-item-type">${plant.typeName}</div>
            </div>
        `;
        
        plantItem.addEventListener('click', () => selectPlant(plant));
        plantGrid.appendChild(plantItem);
    });
}

// Selecionar uma planta
function selectPlant(plant) {
    currentPlant = plant;
    updatePlantProfile();
    plantModal.classList.remove('active');
    
    // Atualizar meta de umidade no painel principal
    const idealHumidity = plant.idealHumidity.split('-')[1].replace('%', '');
    document.querySelector('.progress-info .info-item:nth-child(2) strong').textContent = `${idealHumidity}%`;
    
    // Mostrar notificação
    const alertList = document.querySelector('.alert-list');
    const newAlert = document.createElement('div');
    newAlert.className = 'alert-item success';
    newAlert.innerHTML = `
        <div class="alert-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="alert-content">
            <strong>Planta atualizada</strong>
            <p>Perfil alterado para ${plant.name}</p>
            <small>Agora</small>
        </div>
    `;
    alertList.prepend(newAlert);
}

// Atualizar perfil da planta no painel
function updatePlantProfile() {
    document.getElementById('plantName').textContent = currentPlant.name;
    document.getElementById('plantType').textContent = currentPlant.typeName;
    document.getElementById('plantWaterNeed').textContent = currentPlant.waterNeedName;
    document.getElementById('plantIdealHumidity').textContent = currentPlant.idealHumidity;
    document.getElementById('plantDailyWater').textContent = currentPlant.dailyWater;
    
    if (currentPlant.photo) {
        document.getElementById('plantImagePreview').src = currentPlant.photo;
    } else {
        document.getElementById('plantImagePreview').src = 'https://via.placeholder.com/150?text=' + encodeURIComponent(currentPlant.name);
    }
    
    // Ajustar sistema de irrigação com base na planta
    adjustIrrigationForPlant();
}

// Ajustar irrigação com base no tipo de planta
function adjustIrrigationForPlant() {
    const waterNeed = currentPlant.waterNeed;
    let duration, intensity;
    
    switch(waterNeed) {
        case 'low':
            duration = 5;
            intensity = 40;
            break;
        case 'medium-low':
            duration = 8;
            intensity = 50;
            break;
        case 'medium':
            duration = 10;
            intensity = 65;
            break;
        case 'medium-high':
            duration = 12;
            intensity = 75;
            break;
        case 'high':
            duration = 15;
            intensity = 85;
            break;
        default:
            duration = 10;
            intensity = 65;
    }
    
    // Atualizar controles de irrigação
    document.querySelector('.duration-options .duration-btn.active')?.classList.remove('active');
    const durationBtn = [...document.querySelectorAll('.duration-btn')].find(
        btn => parseInt(btn.textContent) === duration
    );
    if (durationBtn) durationBtn.classList.add('active');
    
    document.querySelector('.custom-duration input').value = duration;
    document.querySelector('.intensity-slider').value = intensity;
    document.querySelector('.current-value').textContent = `${intensity}%`;
}

// Salvar planta personalizada
function saveCustomPlant() {
    const name = document.getElementById('customPlantName').value;
    const type = document.getElementById('customPlantType').value;
    const typeName = document.getElementById('customPlantType').options[document.getElementById('customPlantType').selectedIndex].text;
    const waterNeed = document.getElementById('customPlantWaterNeed').value;
    const waterNeedName = document.getElementById('customPlantWaterNeed').options[document.getElementById('customPlantWaterNeed').selectedIndex].text;
    const humidityMin = document.getElementById('customPlantHumidityMin').value;
    const humidityMax = document.getElementById('customPlantHumidityMax').value;
    const dailyWater = document.getElementById('customPlantDailyWater').value;
    const photo = document.getElementById('customPlantPhoto').value;
    
    if (!name || !type || !waterNeed || !dailyWater) {
        alert('Preencha todos os campos obrigatórios');
        return;
    }
    
    const newPlant = {
        id: Date.now(),
        name,
        type,
        typeName,
        waterNeed,
        waterNeedName,
        idealHumidity: `${humidityMin}-${humidityMax}%`,
        dailyWater: `${dailyWater}ml`,
        photo: photo || null
    };
    
    customPlants.push(newPlant);
    selectPlant(newPlant);
    customPlantModal.classList.remove('active');
    document.getElementById('customPlantForm').reset();
    
    // Mostrar notificação
    const alertList = document.querySelector('.alert-list');
    const newAlert = document.createElement('div');
    newAlert.className = 'alert-item success';
    newAlert.innerHTML = `
        <div class="alert-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="alert-content">
            <strong>Planta personalizada salva</strong>
            <p>${name} foi adicionada ao seu catálogo</p>
            <small>Agora</small>
        </div>
    `;
    alertList.prepend(newAlert);
}

// Filtros e busca
function setupPlantFilters() {
    // Filtro por categoria
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            const searchTerm = document.getElementById('plantSearch').value;
            loadPlantGrid(searchTerm, category);
        });
    });
    
    // Barra de busca
    document.getElementById('plantSearch').addEventListener('input', function() {
        const searchTerm = this.value;
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        loadPlantGrid(searchTerm, activeCategory);
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // ... (código anterior permanece igual)
    
    // Inicializar sistema de plantas
    initPlantModals();
    setupPlantFilters();
    updatePlantProfile();
    
    // Carregar plantas do localStorage se existirem
    const savedPlants = localStorage.getItem('customPlants');
    if (savedPlants) {
        customPlants = JSON.parse(savedPlants);
    }
    
    const savedCurrentPlant = localStorage.getItem('currentPlant');
    if (savedCurrentPlant) {
        currentPlant = JSON.parse(savedCurrentPlant);
        updatePlantProfile();
    }
    
    // Salvar plantas no localStorage quando adicionadas
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('customPlants', JSON.stringify(customPlants));
        localStorage.setItem('currentPlant', JSON.stringify(currentPlant));
    });
});