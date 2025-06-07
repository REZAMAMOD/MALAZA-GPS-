// Fichier d'initialisation - Charger AVANT app.js
console.log('Initialisation des fonctions globales...');

// Variable pour stocker le module actuel
window.currentModule = 'dashboard';

// Fonction showModule globale
window.showModule = function(moduleName) {
    console.log('showModule appelée avec:', moduleName);
    window.currentModule = moduleName;

    // Masquer tous les modules
    const modules = document.querySelectorAll('.module-content');
    modules.forEach(module => module.classList.remove('active'));

    // Mettre à jour la navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Activer le bouton sélectionné
    const activeBtn = document.querySelector(`[onclick="showModule('${moduleName}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Afficher le contenu du module
    const container = document.getElementById('moduleContainer');
    if (!container) {
        console.error('Container moduleContainer non trouvé');
        return;
    }

    // Chargement du module approprié
    switch (moduleName) {
        case 'dashboard':
            if (typeof getDashboardHTML === 'function') {
                container.innerHTML = getDashboardHTML();
                if (typeof initDashboard === 'function') initDashboard();
            } else {
                container.innerHTML = getModulePlaceholder('Dashboard', 'tachometer-alt');
            }
            break;

        case 'clients':
            if (typeof getClientsHTML === 'function') {
                container.innerHTML = getClientsHTML();
                if (typeof initClients === 'function') initClients();
            } else {
                container.innerHTML = getModulePlaceholder('Clients', 'users');
            }
            break;

        case 'gps':
            if (typeof getGPSHTML === 'function') {
                container.innerHTML = getGPSHTML();
                if (typeof initGPS === 'function') initGPS();
            } else {
                container.innerHTML = getModulePlaceholder('GPS', 'map-pin');
            }
            break;

        case 'sim':
            if (typeof getSIMHTML === 'function') {
                container.innerHTML = getSIMHTML();
                if (typeof initSIM === 'function') initSIM();
            } else {
                container.innerHTML = getModulePlaceholder('SIM', 'sim-card');
            }
            break;

        case 'locations':
            if (typeof getLocationsHTML === 'function') {
                container.innerHTML = getLocationsHTML();
                if (typeof initLocations === 'function') initLocations();
            } else {
                container.innerHTML = getModulePlaceholder('Locations', 'map-marked-alt');
            }
            break;

        case 'paiements':
            if (typeof getPaiementsHTML === 'function') {
                container.innerHTML = getPaiementsHTML();
                if (typeof initPaiements === 'function') initPaiements();
            } else {
                container.innerHTML = getModulePlaceholder('Paiements', 'credit-card');
            }
            break;

        case 'caisse':
            if (typeof getCaisseHTML === 'function') {
                container.innerHTML = getCaisseHTML();
                if (typeof initCaisse === 'function') initCaisse();
            } else {
                container.innerHTML = getModulePlaceholder('Caisse', 'cash-register');
            }
            break;

        default:
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
                    <h2 class="text-xl font-semibold text-gray-600">Module non trouvé</h2>
                    <p class="text-gray-500">Le module "${moduleName}" n'existe pas.</p>
                </div>
            `;
    }

    // Mettre à jour l'URL (optionnel)
    if (history.pushState) {
        history.pushState(null, null, `#${moduleName}`);
    }
};

// Fonction placeholder pour les modules non chargés
window.getModulePlaceholder = function(moduleName, icon) {
    return `
        <div class="text-center py-12">
            <i class="fas fa-${icon} text-4xl text-gray-400 mb-4"></i>
            <h2 class="text-xl font-semibold text-gray-600">Module ${moduleName}</h2>
            <p class="text-gray-500">Le module ${moduleName} n'est pas encore chargé.</p>
            <p class="text-sm text-gray-400 mt-2">Vérifiez que le fichier JS correspondant est inclus.</p>
        </div>
    `;
};

console.log('Fonctions globales initialisées avec succès');