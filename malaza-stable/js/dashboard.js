// Module Dashboard Mobile Optimisé - Version Corrigée
console.log('Module Dashboard Mobile Optimisé - Version Corrigée chargée');

// Variables globales pour les graphiques
let revenuesDepensesChart = null;
let paiementsChart = null;
let evolutionLocationsChart = null;

// Variable pour éviter les mises à jour multiples simultanées
let isUpdatingCharts = false;
let chartUpdateTimeout = null;

// Variable pour tracker si les graphiques sont initialisés
let chartsInitialized = false;

function getDashboardHTML() {
    return `
        <style>
            /* Chart tabs styling */
            .chart-tab {
                position: relative;
                color: #6b7280;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
            }
            
            .chart-tab:hover {
                color: #3b82f6;
                background-color: #f9fafb;
            }
            
            .chart-tab.active {
                color: #3b82f6;
                border-bottom-color: #3b82f6;
                background-color: #eff6ff;
            }
            
            /* Chart containers - hide by default */
            .chart-container {
                display: none !important;
            }
            
            .chart-container.active {
                display: block !important;
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
        
        <div class="space-y-4 sm:space-y-6 fade-in">
            <!-- En-tête avec Actions -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
                    <p class="text-gray-600 text-sm sm:text-base">Vue d'ensemble de votre activité</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="refreshDashboard()" class="bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <i class="fas fa-sync-alt mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Actualiser</span>
                    </button>
                    <button onclick="exportDashboard()" class="bg-green-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <i class="fas fa-download mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            <!-- Alertes Intelligentes -->
            <div id="alertsSection" class="space-y-2">
                <!-- Alertes générées dynamiquement -->
            </div>

            <!-- KPI Principaux - Cliquables -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div onclick="showModule('paiements')" class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 rounded-xl text-white cursor-pointer transform hover:scale-105 transition-transform">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-blue-100 text-xs sm:text-sm">Revenus/mois</p>
                            <p class="text-lg sm:text-2xl font-bold" id="revenusMoisDash">0 Ar</p>
                            <p class="text-blue-100 text-xs mt-1">
                                <span id="revenusEvolution">+0%</span>
                            </p>
                        </div>
                        <div class="p-2 sm:p-3 bg-blue-400 bg-opacity-30 rounded-full">
                            <i class="fas fa-chart-line text-xl sm:text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div onclick="showModule('gps')" class="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-xl text-white cursor-pointer transform hover:scale-105 transition-transform">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-green-100 text-xs sm:text-sm">Occupation</p>
                            <p class="text-lg sm:text-2xl font-bold" id="tauxOccupation">0%</p>
                            <p class="text-green-100 text-xs mt-1">
                                <span id="gpsLoues">0</span>/<span id="gpsTotal">0</span> GPS
                            </p>
                        </div>
                        <div class="p-2 sm:p-3 bg-green-400 bg-opacity-30 rounded-full">
                            <i class="fas fa-satellite text-xl sm:text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div onclick="showModule('caisse')" class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 sm:p-6 rounded-xl text-white cursor-pointer transform hover:scale-105 transition-transform">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-purple-100 text-xs sm:text-sm">Caisse</p>
                            <p class="text-lg sm:text-2xl font-bold" id="caisseTotal">0 Ar</p>
                            <p class="text-purple-100 text-xs mt-1">
                                Total disponible
                            </p>
                        </div>
                        <div class="p-2 sm:p-3 bg-purple-400 bg-opacity-30 rounded-full">
                            <i class="fas fa-wallet text-xl sm:text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div onclick="showModule('sim')" class="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 rounded-xl text-white cursor-pointer transform hover:scale-105 transition-transform">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-orange-100 text-xs sm:text-sm">SIM Actives</p>
                            <p class="text-lg sm:text-2xl font-bold" id="simActivesCount">0</p>
                            <p class="text-orange-100 text-xs mt-1">
                                <span id="simExpirantCount">0</span> expirent
                            </p>
                        </div>
                        <div class="p-2 sm:p-3 bg-orange-400 bg-opacity-30 rounded-full">
                            <i class="fas fa-sim-card text-xl sm:text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Graphiques avec Tabs Mobile -->
            <div class="bg-white rounded-lg shadow-sm">
                <!-- Tabs pour mobile -->
                <div class="flex border-b overflow-x-auto">
                    <button onclick="switchChart('revenus')" class="chart-tab active px-4 py-3 text-sm font-medium whitespace-nowrap" data-chart="revenus">
                        <i class="fas fa-chart-line mr-1"></i>
                        Revenus/Dépenses
                    </button>
                    <button onclick="switchChart('paiements')" class="chart-tab px-4 py-3 text-sm font-medium whitespace-nowrap" data-chart="paiements">
                        <i class="fas fa-chart-pie mr-1"></i>
                        Méthodes
                    </button>
                    <button onclick="switchChart('locations')" class="chart-tab px-4 py-3 text-sm font-medium whitespace-nowrap" data-chart="locations">
                        <i class="fas fa-chart-bar mr-1"></i>
                        Locations
                    </button>
                </div>
                
                <!-- Container des graphiques -->
                <div class="p-4 sm:p-6">
                    <!-- Graphique Revenus/Dépenses -->
                    <div id="chartRevenus" class="chart-container active">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Revenus vs Dépenses</h3>
                            <select id="revenuesDepensesPeriod" onchange="updateRevenuesDepensesChart()" class="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1">
                                <option value="6">6 derniers mois</option>
                                <option value="12">12 derniers mois</option>
                            </select>
                        </div>
                        <div class="h-48 sm:h-64">
                            <canvas id="revenuesDepensesChart"></canvas>
                        </div>
                    </div>

                    <!-- Graphique Répartition Paiements -->
                    <div id="chartPaiements" class="chart-container">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Méthodes de Paiement</h3>
                            <span class="text-xs sm:text-sm text-gray-500">Ce mois</span>
                        </div>
                        <div class="h-48 sm:h-64">
                            <canvas id="paiementsChart"></canvas>
                        </div>
                    </div>

                    <!-- Graphique Évolution Locations -->
                    <div id="chartLocations" class="chart-container">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Évolution Locations</h3>
                            <span class="text-xs sm:text-sm text-gray-500">6 derniers mois</span>
                        </div>
                        <div class="h-48 sm:h-64">
                            <canvas id="evolutionLocationsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tableaux détaillés -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <!-- Top Clients -->
                <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Top Clients</h3>
                    <div class="space-y-3" id="topClientsSection">
                        <!-- Généré dynamiquement -->
                    </div>
                </div>

                <!-- Locations à renouveler -->
                <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Locations à renouveler</h3>
                    <div class="space-y-3" id="locationsExpiringSection">
                        <!-- Généré dynamiquement -->
                    </div>
                </div>
            </div>

            <!-- Actions Rapides Mobile - Version simplifiée -->
            <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <button onclick="showModule('clients'); setTimeout(() => openClientModal(), 100)" class="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <i class="fas fa-user-plus text-blue-600 text-2xl sm:text-3xl mb-2 sm:mb-3"></i>
                        <span class="text-xs sm:text-sm font-medium text-blue-600 text-center">Nouveau Client</span>
                    </button>
                    <button onclick="showModule('locations'); setTimeout(() => openLocationModal(), 100)" class="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <i class="fas fa-map-pin text-green-600 text-2xl sm:text-3xl mb-2 sm:mb-3"></i>
                        <span class="text-xs sm:text-sm font-medium text-green-600 text-center">Nouvelle Location</span>
                    </button>
                    <button onclick="showModule('sim'); setTimeout(() => openSIMModal(), 100)" class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                        <i class="fas fa-sim-card text-purple-600 text-2xl sm:text-3xl mb-2 sm:mb-3"></i>
                        <span class="text-xs sm:text-sm font-medium text-purple-600 text-center">Nouvelle SIM</span>
                    </button>
                    <button onclick="showModule('sim'); setTimeout(() => {
                        const simSelect = prompt('Entrez le numéro de la SIM à recharger:');
                        if (simSelect) {
                            const sim = appData.sim.find(s => s.id === simSelect);
                            if (sim) {
                                openForfaitModal(simSelect);
                            } else {
                                showAlert('SIM non trouvée', 'error');
                            }
                        }
                    }, 100)" class="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                        <i class="fas fa-credit-card text-orange-600 text-2xl sm:text-3xl mb-2 sm:mb-3"></i>
                        <span class="text-xs sm:text-sm font-medium text-orange-600 text-center">Achat Forfait</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour changer de graphique
function switchChart(chartName) {
    // Mettre à jour les tabs
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-chart="${chartName}"]`).classList.add('active');
    
    // Mettre à jour les containers
    document.querySelectorAll('.chart-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // Afficher le bon graphique
    switch(chartName) {
        case 'revenus':
            document.getElementById('chartRevenus').classList.add('active');
            break;
        case 'paiements':
            document.getElementById('chartPaiements').classList.add('active');
            break;
        case 'locations':
            document.getElementById('chartLocations').classList.add('active');
            break;
    }
}

function initDashboard() {
    console.log('Initialisation du Dashboard Mobile Optimisé - Version Corrigée');
    
    // Nettoyer les graphiques existants d'abord
    cleanupCharts();
    
    // Charger Chart.js depuis CDN si pas déjà chargé
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
        script.onload = () => {
            console.log('Chart.js chargé');
            setTimeout(initializeAllComponents, 100);
        };
        document.head.appendChild(script);
    } else {
        initializeAllComponents();
    }
}

function initializeAllComponents() {
    // Initialiser tous les composants
    updateKPIs();
    generateAlerts();
    updateTopClients();
    updateLocationsExpiring();
    
    // Initialiser les graphiques une seule fois
    if (!chartsInitialized) {
        initCharts();
        chartsInitialized = true;
    } else {
        // Si déjà initialisés, juste mettre à jour
        updateAllCharts();
    }
}

// Nettoyer proprement les graphiques
function cleanupCharts() {
    console.log('Nettoyage des graphiques existants');
    
    if (revenuesDepensesChart) {
        revenuesDepensesChart.destroy();
        revenuesDepensesChart = null;
    }
    
    if (paiementsChart) {
        paiementsChart.destroy();
        paiementsChart = null;
    }
    
    if (evolutionLocationsChart) {
        evolutionLocationsChart.destroy();
        evolutionLocationsChart = null;
    }
    
    chartsInitialized = false;
}

function initCharts() {
    console.log('Initialisation des graphiques');
    
    // S'assurer que les canvas existent
    const canvas1 = document.getElementById('revenuesDepensesChart');
    const canvas2 = document.getElementById('paiementsChart');
    const canvas3 = document.getElementById('evolutionLocationsChart');
    
    if (!canvas1 || !canvas2 || !canvas3) {
        console.error('Canvas des graphiques non trouvés');
        return;
    }
    
    // Initialiser chaque graphique
    initRevenuesDepensesChart();
    initPaiementsChart();
    initEvolutionLocationsChart();
}

// Fonction pour mettre à jour tous les graphiques avec protection
function updateAllCharts() {
    if (isUpdatingCharts) {
        console.log('Mise à jour des graphiques déjà en cours, annulation');
        return;
    }
    
    // Annuler le timeout précédent s'il existe
    if (chartUpdateTimeout) {
        clearTimeout(chartUpdateTimeout);
    }
    
    // Attendre 500ms avant de mettre à jour (debounce)
    chartUpdateTimeout = setTimeout(() => {
        isUpdatingCharts = true;
        
        try {
            // Mettre à jour chaque graphique s'il existe
            if (revenuesDepensesChart) {
                const data = getRevenuesDepensesData(6);
                revenuesDepensesChart.data.labels = data.labels;
                revenuesDepensesChart.data.datasets[0].data = data.revenus;
                revenuesDepensesChart.data.datasets[1].data = data.depenses;
                revenuesDepensesChart.update('none'); // 'none' = pas d'animation
            }
            
            if (paiementsChart) {
                const data = getPaiementsData();
                paiementsChart.data.labels = data.labels;
                paiementsChart.data.datasets[0].data = data.values;
                paiementsChart.update('none');
            }
            
            if (evolutionLocationsChart) {
                const data = getEvolutionLocationsData();
                evolutionLocationsChart.data.labels = data.labels;
                evolutionLocationsChart.data.datasets[0].data = data.nouvelles;
                evolutionLocationsChart.data.datasets[1].data = data.terminees;
                evolutionLocationsChart.update('none');
            }
            
            console.log('Graphiques mis à jour avec succès');
        } catch (error) {
            console.error('Erreur lors de la mise à jour des graphiques:', error);
        } finally {
            isUpdatingCharts = false;
        }
    }, 500);
}

function updateKPIs() {
    const stats = calculateAdvancedStats();
    
    // Revenus ce mois avec animation
    animateValue('revenusMoisDash', 0, stats.revenusMois, 1000, true);
    document.getElementById('revenusEvolution').textContent = `${stats.revenusEvolution >= 0 ? '+' : ''}${stats.revenusEvolution}%`;
    document.getElementById('revenusEvolution').className = stats.revenusEvolution >= 0 ? 'text-green-200' : 'text-red-200';
    
    // Taux d'occupation
    animateValue('tauxOccupation', 0, stats.tauxOccupation, 1000, false, '%');
    document.getElementById('gpsLoues').textContent = stats.gpsLoues;
    document.getElementById('gpsTotal').textContent = stats.gpsTotal;
    
    // État caisse
    animateValue('caisseTotal', 0, stats.caisseTotal, 1000, true);
    
    // SIM actives
    animateValue('simActivesCount', 0, stats.simActives, 1000, false);
    document.getElementById('simExpirantCount').textContent = stats.simExpirant;
}

// Fonction d'animation des valeurs
function animateValue(id, start, end, duration, isCurrency = false, suffix = '') {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        if (isCurrency) {
            element.textContent = formatCurrency(Math.round(current));
        } else {
            element.textContent = Math.round(current) + suffix;
        }
    }, 16);
}

function calculateAdvancedStats() {
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
    
    // Calculer depuis l'historique des transactions
    const totals = typeof calculateCaisseFromHistory === 'function' ? calculateCaisseFromHistory() : { total: appData.caisse.total };
    
    // Revenus ce mois (paiements + transactions revenus)
    const revenusMoisActuel = appData.paiements
        .filter(p => {
            const pDate = new Date(p.datePaiement);
            return pDate.getMonth() === thisMonth.getMonth() && 
                   pDate.getFullYear() === thisMonth.getFullYear();
        })
        .reduce((sum, p) => sum + p.montant, 0);
    
    const revenusManuelsMois = (appData.transactions || [])
        .filter(t => t.type === 'revenu_manuel')
        .filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === thisMonth.getMonth() && 
                   tDate.getFullYear() === thisMonth.getFullYear();
        })
        .reduce((sum, t) => sum + t.montant, 0);
    
    const revenusMois = revenusMoisActuel + revenusManuelsMois;
    
    // Revenus mois dernier pour évolution
    const revenusMoisDernier = appData.paiements
        .filter(p => {
            const pDate = new Date(p.datePaiement);
            return pDate.getMonth() === lastMonth.getMonth() && 
                   pDate.getFullYear() === lastMonth.getFullYear();
        })
        .reduce((sum, p) => sum + p.montant, 0);
    
    const revenusEvolution = revenusMoisDernier > 0 
        ? Math.round(((revenusMois - revenusMoisDernier) / revenusMoisDernier) * 100)
        : 0;
    
    // Taux d'occupation GPS
    const gpsTotal = appData.gps.length;
    const gpsLoues = appData.gps.filter(g => g.statut === 'Loué').length;
    const tauxOccupation = gpsTotal > 0 ? Math.round((gpsLoues / gpsTotal) * 100) : 0;
    
    // SIM actives et qui expirent
    const simActives = appData.sim.filter(s => getSimStatus(s) === 'Active').length;
    const simExpirant = appData.sim.filter(s => {
        if (!s.dateExpiration) return false;
        const daysLeft = getDaysUntilExpiry(s.dateExpiration);
        return daysLeft !== null && daysLeft > 0 && daysLeft <= 7;
    }).length;
    
    return {
        revenusMois,
        revenusEvolution,
        gpsTotal,
        gpsLoues,
        tauxOccupation,
        caisseTotal: totals.total,
        simActives,
        simExpirant
    };
}

function generateAlerts() {
    const alertsContainer = document.getElementById('alertsSection');
    const alerts = [];
    
    // SIM qui expirent bientôt
    const simExpirant = appData.sim.filter(s => {
        if (!s.dateExpiration) return false;
        const daysLeft = getDaysUntilExpiry(s.dateExpiration);
        return daysLeft !== null && daysLeft > 0 && daysLeft <= 7;
    });
    
    if (simExpirant.length > 0) {
        alerts.push({
            type: 'warning',
            icon: 'exclamation-triangle',
            title: `${simExpirant.length} SIM expire(nt) bientôt`,
            message: `${simExpirant.map(s => s.id).join(', ')} - Pensez à recharger`,
            action: () => showModule('sim')
        });
    }
    
    // Paiements en retard (plus de 30 jours)
    const today = new Date();
    const locationsEnRetard = appData.locations.filter(l => {
        if (l.statut !== 'en cours') return false;
        const dernierPaiement = appData.paiements
            .filter(p => p.locationId === l.id)
            .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))[0];
        
        if (!dernierPaiement) return true; // Aucun paiement
        
        const daysSincePayment = Math.floor((today - new Date(dernierPaiement.datePaiement)) / (1000 * 60 * 60 * 24));
        return daysSincePayment > 30;
    });
    
    if (locationsEnRetard.length > 0) {
        alerts.push({
            type: 'error',
            icon: 'exclamation-circle',
            title: `${locationsEnRetard.length} paiement(s) en retard`,
            message: `Locations sans paiement depuis plus de 30 jours`,
            action: () => showModule('paiements')
        });
    }
    
    // Caisse faible (moins de 50 000 Ar)
    const totals = typeof calculateCaisseFromHistory === 'function' ? calculateCaisseFromHistory() : { total: appData.caisse.total };
    if (totals.total < 50000) {
        alerts.push({
            type: 'warning',
            icon: 'wallet',
            title: 'Caisse faible',
            message: `${formatCurrency(totals.total)} - Pensez à alimenter`,
            action: () => showModule('caisse')
        });
    }
    
    // GPS inactifs (disponibles depuis plus de 15 jours)
    const gpsInactifs = appData.gps.filter(g => {
        if (g.statut !== 'Disponible') return false;
        const derniereLocation = appData.locations
            .filter(l => l.gpsId === g.id)
            .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut))[0];
        
        if (!derniereLocation) return true;
        
        const daysSinceLocation = Math.floor((today - new Date(derniereLocation.dateFin || derniereLocation.dateDebut)) / (1000 * 60 * 60 * 24));
        return daysSinceLocation > 15;
    });
    
    if (gpsInactifs.length > 0) {
        alerts.push({
            type: 'info',
            icon: 'info-circle',
            title: `${gpsInactifs.length} GPS inactif(s)`,
            message: `GPS disponibles depuis plus de 15 jours`,
            action: () => showModule('gps')
        });
    }
    
    // Afficher les alertes
    if (alerts.length === 0) {
        alertsContainer.innerHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-600 mr-3"></i>
                    <div>
                        <h4 class="font-medium text-green-800 text-sm sm:text-base">Tout va bien !</h4>
                        <p class="text-green-700 text-xs sm:text-sm">Aucune alerte à signaler</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="bg-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-50 border border-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-200 rounded-lg p-3 sm:p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center flex-1">
                        <i class="fas fa-${alert.icon} text-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-600 mr-3"></i>
                        <div class="flex-1">
                            <h4 class="font-medium text-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-800 text-sm sm:text-base">${alert.title}</h4>
                            <p class="text-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-700 text-xs sm:text-sm">${alert.message}</p>
                        </div>
                    </div>
                    <button onclick="(${alert.action})()" class="ml-3 text-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-600 hover:text-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-800 p-2">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function initRevenuesDepensesChart() {
    const ctx = document.getElementById('revenuesDepensesChart');
    if (!ctx) {
        console.error('Canvas revenuesDepensesChart non trouvé');
        return;
    }
    
    // Détruire le graphique existant s'il existe
    if (revenuesDepensesChart) {
        revenuesDepensesChart.destroy();
        revenuesDepensesChart = null;
    }
    
    const data = getRevenuesDepensesData(6);
    
    revenuesDepensesChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Revenus',
                data: data.revenus,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Dépenses',
                data: data.depenses,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        },
                        font: {
                            size: 10
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

function getRevenuesDepensesData(months) {
    const data = { labels: [], revenus: [], depenses: [] };
    const today = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        
        // Revenus du mois (paiements + transactions)
        const revenus = appData.paiements
            .filter(p => {
                const pDate = new Date(p.datePaiement);
                return pDate.getMonth() === date.getMonth() && 
                       pDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum, p) => sum + p.montant, 0);
            
        const revenusManuel = (appData.transactions || [])
            .filter(t => t.type === 'revenu' || t.type === 'revenu_manuel')
            .filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && 
                       tDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum, t) => sum + t.montant, 0);
        
        // Dépenses du mois
        const depenses = (appData.transactions || [])
            .filter(t => t.type === 'depense_manuel' || t.type === 'depense_auto' || t.type === 'depense_automatique')
            .filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && 
                       tDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum, t) => sum + t.montant, 0);
        
        data.labels.push(monthName);
        data.revenus.push(revenus + revenusManuel);
        data.depenses.push(depenses);
    }
    
    return data;
}

function updateRevenuesDepensesChart() {
    if (!revenuesDepensesChart) {
        console.error('Graphique revenus/dépenses non initialisé');
        return;
    }
    
    const period = parseInt(document.getElementById('revenuesDepensesPeriod').value);
    const data = getRevenuesDepensesData(period);
    
    revenuesDepensesChart.data.labels = data.labels;
    revenuesDepensesChart.data.datasets[0].data = data.revenus;
    revenuesDepensesChart.data.datasets[1].data = data.depenses;
    revenuesDepensesChart.update('none');
}

function initPaiementsChart() {
    const ctx = document.getElementById('paiementsChart');
    if (!ctx) {
        console.error('Canvas paiementsChart non trouvé');
        return;
    }
    
    // Détruire le graphique existant s'il existe
    if (paiementsChart) {
        paiementsChart.destroy();
        paiementsChart = null;
    }
    
    const data = getPaiementsData();
    
    paiementsChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    'rgb(34, 197, 94)',   // Espèce - Vert
                    'rgb(59, 130, 246)',  // MVola - Bleu
                    'rgb(147, 51, 234)'   // Virement - Violet
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function getPaiementsData() {
    const thisMonth = new Date();
    const paiementsMois = appData.paiements.filter(p => {
        const pDate = new Date(p.datePaiement);
        return pDate.getMonth() === thisMonth.getMonth() && 
               pDate.getFullYear() === thisMonth.getFullYear();
    });
    
    const methods = window.getAvailablePaymentMethods ? window.getAvailablePaymentMethods() : [
        { id: 'espece', name: 'Espèce' },
        { id: 'mvola', name: 'MVola' }
    ];
    
    const labels = [];
    const values = [];
    
    methods.forEach(method => {
        const total = paiementsMois
            .filter(p => p.methode.toLowerCase() === method.id || p.methode === method.name)
            .reduce((sum, p) => sum + p.montant, 0);
        
        labels.push(method.name);
        values.push(total);
    });
    
    // Ajouter Virement si présent
    const virement = paiementsMois
        .filter(p => p.methode === 'Virement')
        .reduce((sum, p) => sum + p.montant, 0);
    
    if (virement > 0) {
        labels.push('Virement');
        values.push(virement);
    }
    
    return { labels, values };
}

function initEvolutionLocationsChart() {
    const ctx = document.getElementById('evolutionLocationsChart');
    if (!ctx) {
        console.error('Canvas evolutionLocationsChart non trouvé');
        return;
    }
    
    // Détruire le graphique existant s'il existe
    if (evolutionLocationsChart) {
        evolutionLocationsChart.destroy();
        evolutionLocationsChart = null;
    }
    
    const data = getEvolutionLocationsData();
    
    evolutionLocationsChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Nouvelles',
                data: data.nouvelles,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }, {
                label: 'Terminées',
                data: data.terminees,
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

function getEvolutionLocationsData() {
    const data = { labels: [], nouvelles: [], terminees: [] };
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
        
        const nouvelles = appData.locations.filter(l => {
            const lDate = new Date(l.dateDebut);
            return lDate.getMonth() === date.getMonth() && 
                   lDate.getFullYear() === date.getFullYear();
        }).length;
        
        const terminees = appData.locations.filter(l => {
            if (!l.dateFin || l.statut !== 'terminée') return false;
            const lDate = new Date(l.dateFin);
            return lDate.getMonth() === date.getMonth() && 
                   lDate.getFullYear() === date.getFullYear();
        }).length;
        
        data.labels.push(monthName);
        data.nouvelles.push(nouvelles);
        data.terminees.push(terminees);
    }
    
    return data;
}

function updateTopClients() {
    const clientStats = {};
    
    appData.paiements.forEach(paiement => {
        if (!clientStats[paiement.clientId]) {
            clientStats[paiement.clientId] = {
                nom: paiement.nomClient,
                total: 0,
                count: 0
            };
        }
        clientStats[paiement.clientId].total += paiement.montant;
        clientStats[paiement.clientId].count++;
    });
    
    const topClients = Object.values(clientStats)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
    
    const container = document.getElementById('topClientsSection');
    if (topClients.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">Aucun client avec paiement</p>';
        return;
    }
    
    container.innerHTML = topClients.map((client, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onclick="showModule('clients')">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-bold text-sm">${index + 1}</span>
                </div>
                <div>
                    <p class="font-medium text-gray-900 text-sm">${client.nom}</p>
                    <p class="text-xs text-gray-500">${client.count} paiement(s)</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold text-green-600 text-sm">${formatCurrency(client.total)}</p>
            </div>
        </div>
    `).join('');
}

function updateLocationsExpiring() {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    // Trouver les locations dont le paiement expire bientôt
    const locationsExpiring = appData.locations
        .filter(l => l.statut === 'en cours')
        .map(location => {
            // Trouver le dernier paiement
            const dernierPaiement = appData.paiements
                .filter(p => p.locationId === location.id)
                .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))[0];
            
            if (!dernierPaiement || !dernierPaiement.payeJusquau) {
                return null;
            }
            
            const payeJusquau = new Date(dernierPaiement.payeJusquau);
            const daysRemaining = Math.ceil((payeJusquau - today) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining <= 30 && daysRemaining > 0) {
                return {
                    location,
                    daysRemaining,
                    payeJusquau: dernierPaiement.payeJusquau
                };
            }
            
            return null;
        })
        .filter(item => item !== null)
        .sort((a, b) => a.daysRemaining - b.daysRemaining)
        .slice(0, 5);
    
    const container = document.getElementById('locationsExpiringSection');
    
    if (locationsExpiring.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">Aucune location à renouveler prochainement</p>';
        return;
    }
    
    container.innerHTML = locationsExpiring.map(item => {
        const urgencyClass = item.daysRemaining <= 7 ? 'text-red-600' : item.daysRemaining <= 15 ? 'text-orange-600' : 'text-yellow-600';
        const urgencyBg = item.daysRemaining <= 7 ? 'bg-red-100' : item.daysRemaining <= 15 ? 'bg-orange-100' : 'bg-yellow-100';
        
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onclick="showModule('paiements')">
                <div class="flex items-center flex-1">
                    <div class="w-10 h-10 ${urgencyBg} rounded-full flex items-center justify-center mr-3">
                        <span class="${urgencyClass} font-bold text-xs">${item.daysRemaining}j</span>
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-900 text-sm">${item.location.id}</p>
                        <p class="text-xs text-gray-500">${item.location.nomClient}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs text-gray-500">Expire le</p>
                    <p class="font-medium ${urgencyClass} text-sm">${formatDate(item.payeJusquau)}</p>
                </div>
            </div>
        `;
    }).join('');
}

function refreshDashboard() {
    showAlert('Actualisation du dashboard...', 'info', 1000);
    
    // Annuler les mises à jour en cours
    if (chartUpdateTimeout) {
        clearTimeout(chartUpdateTimeout);
    }
    
    setTimeout(() => {
        // Mettre à jour tous les composants
        updateKPIs();
        generateAlerts();
        updateTopClients();
        updateLocationsExpiring();
        
        // Mettre à jour les graphiques de manière sécurisée
        updateAllCharts();
        
        showAlert('Dashboard actualisé', 'success');
    }, 1000);
}

function exportDashboard() {
    try {
        const stats = calculateAdvancedStats();
        const reportData = {
            date: new Date().toISOString(),
            kpis: stats,
            alerts: document.getElementById('alertsSection').children.length - 1,
            topClients: Array.from(document.querySelectorAll('#topClientsSection .flex')).length,
            locationsExpiring: Array.from(document.querySelectorAll('#locationsExpiringSection .flex')).length
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `dashboard-report-${getCurrentDate()}.json`;
        link.click();
        
        showAlert('Rapport dashboard exporté', 'success');
    } catch (error) {
        console.error('Erreur export dashboard:', error);
        showAlert('Erreur lors de l\'export', 'error');
    }
}

// Fonctions utilitaires réutilisées
function getSimStatus(sim) {
    if (!sim.dateExpiration) return sim.statut || 'Inactive';
    const today = new Date();
    const expiryDate = new Date(sim.dateExpiration);
    return expiryDate < today ? 'Expirée' : (sim.statut || 'Inactive');
}

function getDaysUntilExpiry(dateExpiration) {
    if (!dateExpiration) return null;
    const today = new Date();
    const expiryDate = new Date(dateExpiration);
    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Fonction de nettoyage appelée quand on quitte le dashboard
function cleanupDashboard() {
    console.log('Nettoyage Dashboard');
    
    // Annuler les timeouts en cours
    if (chartUpdateTimeout) {
        clearTimeout(chartUpdateTimeout);
    }
    
    // Nettoyer les graphiques
    cleanupCharts();
}

// Exposer la fonction de mise à jour pour l'appeler depuis d'autres modules
window.updateDashboardCharts = updateAllCharts;