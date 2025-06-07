// Configuration principale de l'application Malaza Stable - Version Firebase

// Variables Firebase - utiliser celles déjà déclarées dans index.html
// NE PAS redéclarer db et auth, ils existent déjà

// Initialiser Firebase quand disponible
function waitForFirebase() {
    return new Promise((resolve) => {
        const checkFirebase = setInterval(() => {
            if (window.firebaseDB && window.firebaseAuth) {
                clearInterval(checkFirebase);
                resolve();
            }
        }, 100);
        
        // Timeout après 10 secondes
        setTimeout(() => {
            clearInterval(checkFirebase);
            console.error('Firebase timeout - utilisation des valeurs par défaut');
            resolve();
        }, 10000);
    });
}

// Données globales de l'application (cache local) - GLOBAL pour tous les modules
window.appData = {
    clients: [],
    gps: [],
    sim: [],
    locations: [],
    paiements: [],
    transactions: [],
    promotions: [], // AJOUT pour les promotions
    caisse: { espece: 0, mvola: 0, total: 0 }, // Sera calculé dynamiquement
    paymentMethods: [],
    simOperators: []
};

// Configuration étendue
const CONFIG = {
    APP_NAME: 'Malaza Track GPS',
    VERSION: '2.0.0',
    STORAGE_PREFIX: 'malaza_',
    CURRENCY: 'Ar',
    DATE_FORMAT: 'fr-FR',
    
    // ========== CONFIGURATION DYNAMIQUE ==========
    
    // Méthodes de paiement disponibles
    PAYMENT_METHODS: [
        {
            id: 'espece',
            name: 'Espèce',
            icon: 'money-bill-wave',
            color: 'green',
            caisseKey: 'espece'
        },
        {
            id: 'mvola',
            name: 'MVola',
            icon: 'mobile-alt',
            color: 'blue',
            caisseKey: 'mvola'
        }
    ],
    
    // Opérateurs SIM disponibles
    SIM_OPERATORS: [
        {
            id: 'telma',
            name: 'Telma',
            color: 'red'
        },
        {
            id: 'orange',
            name: 'Orange',
            color: 'orange'
        }
    ],
    
    // Types de forfaits disponibles
    FORFAIT_TYPES: [
        {
            id: 'week',
            name: 'week',
            displayName: 'Forfait Week',
            description: '1 semaine',
            duration: 7,
            price: 3000
        },
        {
            id: 'month',
            name: 'month',
            displayName: 'Forfait Month',
            description: '1 mois',
            duration: 30,
            price: 15000
        }
    ],
    
    // Coûts standard
    COSTS: {
        SIM_PURCHASE: 3000
    }
};

// Variable pour stocker le module actuel
let currentModule = 'dashboard';

// ========== FONCTIONS FIREBASE ==========

// Charger toutes les données depuis Firebase
async function loadAllDataFromFirebase() {
    try {
        // S'assurer que Firebase est initialisé
        if (!window.firebaseDB) {
            await waitForFirebase();
        }
        
        const db = window.firebaseDB;
        
        showAlert('Chargement des données...', 'info');
        
        // Charger les clients
        const clientsSnapshot = await db.collection('clients').get();
        window.appData.clients = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Charger les GPS
        const gpsSnapshot = await db.collection('gps').get();
        window.appData.gps = gpsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Charger les SIM
        const simSnapshot = await db.collection('sim').get();
        window.appData.sim = simSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Charger les locations
        const locationsSnapshot = await db.collection('locations').get();
        window.appData.locations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Charger les paiements
        const paiementsSnapshot = await db.collection('paiements').get();
        window.appData.paiements = paiementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Charger les transactions
        const transactionsSnapshot = await db.collection('transactions').get();
        window.appData.transactions = transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // AJOUT : Charger les promotions
        const promotionsSnapshot = await db.collection('promotions').get();
        window.appData.promotions = promotionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // IMPORTANT: Calculer la caisse depuis les transactions au lieu de la charger
        calculateCaisseFromTransactions();
        
        console.log('Données chargées:', window.appData);
        showAlert('Données chargées avec succès', 'success');
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showAlert('Erreur lors du chargement des données', 'error');
    }
}

// NOUVELLE FONCTION: Calculer la caisse depuis l'historique des transactions
function calculateCaisseFromTransactions() {
    // Réinitialiser la caisse
    CONFIG.PAYMENT_METHODS.forEach(method => {
        window.appData.caisse[method.caisseKey] = 0;
    });
    
    // Parcourir toutes les transactions et calculer les soldes
    window.appData.transactions.forEach(transaction => {
        if (transaction.methode) {
            // Trouver la méthode de paiement correspondante
            const method = CONFIG.PAYMENT_METHODS.find(m => 
                m.name.toLowerCase() === transaction.methode.toLowerCase()
            );
            
            if (method) {
                // Si c'est un revenu, on ajoute
                if (transaction.type === 'revenu') {
                    window.appData.caisse[method.caisseKey] += transaction.montant;
                }
                // Si c'est une dépense, on soustrait
                else if (transaction.type === 'depense_manuel' || transaction.type === 'depense_automatique') {
                    window.appData.caisse[method.caisseKey] -= transaction.montant;
                }
            }
        }
    });
    
    // Calculer le total
    window.appData.caisse.total = CONFIG.PAYMENT_METHODS.reduce((total, method) => {
        return total + window.appData.caisse[method.caisseKey];
    }, 0);
    
    console.log('Caisse calculée depuis les transactions:', window.appData.caisse);
}

// Sauvegarder un client dans Firebase
async function saveClientToFirebase(client) {
    try {
        // S'assurer que Firebase est initialisé
        if (!window.firebaseDB) {
            await waitForFirebase();
        }
        
        const db = window.firebaseDB;
        
        if (client.id && client.id.startsWith('CL')) {
            // Mettre à jour un client existant
            await db.collection('clients').doc(client.id).set(client);
        } else {
            // Créer un nouveau client
            const docRef = await db.collection('clients').add(client);
            client.id = docRef.id;
            // Mettre à jour l'ID dans le document
            await db.collection('clients').doc(docRef.id).update({ id: docRef.id });
        }
        
        // Mettre à jour le cache local
        const index = window.appData.clients.findIndex(c => c.id === client.id);
        if (index !== -1) {
            window.appData.clients[index] = client;
        } else {
            window.appData.clients.push(client);
        }
        
        return client;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du client:', error);
        throw error;
    }
}

// Supprimer un client de Firebase
async function deleteClientFromFirebase(clientId) {
    try {
        // S'assurer que Firebase est initialisé
        if (!window.firebaseDB) {
            await waitForFirebase();
        }
        
        const db = window.firebaseDB;
        await db.collection('clients').doc(clientId).delete();
        
        // Mettre à jour le cache local
        window.appData.clients = window.appData.clients.filter(c => c.id !== clientId);
        
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du client:', error);
        throw error;
    }
}

// Fonction de sauvegarde générique pour Firebase
async function saveToFirebase(collection, data) {
    try {
        // S'assurer que Firebase est initialisé
        if (!window.firebaseDB) {
            await waitForFirebase();
        }
        
        const db = window.firebaseDB;
        
        if (data.id) {
            await db.collection(collection).doc(data.id).set(data);
        } else {
            const docRef = await db.collection(collection).add(data);
            data.id = docRef.id;
            await db.collection(collection).doc(docRef.id).update({ id: docRef.id });
        }
        
        // Si c'est une transaction, recalculer la caisse
        if (collection === 'transactions') {
            // Ajouter la transaction au cache local
            const index = window.appData.transactions.findIndex(t => t.id === data.id);
            if (index !== -1) {
                window.appData.transactions[index] = data;
            } else {
                window.appData.transactions.push(data);
            }
            // Recalculer la caisse
            calculateCaisseFromTransactions();
        }
        
        return data;
    } catch (error) {
        console.error(`Erreur lors de la sauvegarde dans ${collection}:`, error);
        throw error;
    }
}

// Fonction de suppression générique pour Firebase
async function deleteFromFirebase(collection, id) {
    try {
        // S'assurer que Firebase est initialisé
        if (!window.firebaseDB) {
            await waitForFirebase();
        }
        
        const db = window.firebaseDB;
        await db.collection(collection).doc(id).delete();
        
        // Si c'est une transaction, recalculer la caisse
        if (collection === 'transactions') {
            // Supprimer du cache local
            window.appData.transactions = window.appData.transactions.filter(t => t.id !== id);
            // Recalculer la caisse
            calculateCaisseFromTransactions();
        }
        
        return true;
    } catch (error) {
        console.error(`Erreur lors de la suppression dans ${collection}:`, error);
        throw error;
    }
}

// FONCTION MODIFIÉE: Ne plus sauvegarder la caisse dans Firebase
async function updateCaisseInFirebase(caisse) {
    // Cette fonction ne fait plus rien car la caisse est calculée dynamiquement
    console.log('updateCaisseInFirebase appelée mais ignorée - la caisse est maintenant calculée dynamiquement');
    return true;
}

// ========== FONCTIONS UTILITAIRES DYNAMIQUES ==========

// Obtenir toutes les méthodes de paiement disponibles
function getAvailablePaymentMethods() {
    return CONFIG.PAYMENT_METHODS;
}

// Obtenir tous les opérateurs SIM disponibles
function getAvailableOperators() {
    return CONFIG.SIM_OPERATORS;
}

// Obtenir le solde d'une méthode de paiement
function getPaymentMethodBalance(methodId) {
    const method = CONFIG.PAYMENT_METHODS.find(m => m.id === methodId);
    if (!method) return 0;
    
    return window.appData.caisse[method.caisseKey] || 0;
}

// FONCTION MODIFIÉE: Créer une transaction au lieu de modifier directement la caisse
async function updatePaymentMethodBalance(methodId, amount, description = '', category = '', additionalData = {}) {
    const method = CONFIG.PAYMENT_METHODS.find(m => m.id === methodId);
    if (!method) {
        showAlert('Méthode de paiement invalide', 'error');
        return false;
    }
    
    // Vérifier les fonds disponibles pour les dépenses
    if (amount < 0) {
        const currentBalance = getPaymentMethodBalance(methodId);
        if (currentBalance < Math.abs(amount)) {
            showAlert(`Transaction refusée : Solde ${method.name} insuffisant (${formatCurrency(currentBalance)} disponible)`, 'error');
            return false;
        }
    }
    
    // Créer une transaction automatique
    const transaction = {
        id: generateId('TXN', window.appData.transactions),
        type: amount > 0 ? 'revenu' : 'depense_automatique',
        description: description || (amount > 0 ? 'Revenu automatique' : 'Dépense automatique'),
        categorie: category || 'Autre',
        montant: Math.abs(amount),
        methode: method.name,
        date: getCurrentDate(),
        createdAt: new Date().toISOString(),
        ...additionalData // Permet d'ajouter des données supplémentaires comme simId, locationId, etc.
    };
    
    try {
        // Sauvegarder la transaction
        await saveToFirebase('transactions', transaction);
        return true;
    } catch (error) {
        console.error('Erreur lors de la création de la transaction:', error);
        showAlert('Erreur lors de l\'enregistrement de la transaction', 'error');
        return false;
    }
}

// Vérifier si les fonds sont suffisants
function checkFundsAvailability(methodId, amount) {
    const currentBalance = getPaymentMethodBalance(methodId);
    return currentBalance >= amount;
}

// Obtenir les détails d'une méthode de paiement
function getPaymentMethodDetails(methodId) {
    return CONFIG.PAYMENT_METHODS.find(m => m.id === methodId);
}

// Obtenir les détails d'un opérateur
function getOperatorDetails(operatorId) {
    return CONFIG.SIM_OPERATORS.find(o => o.id === operatorId);
}

// Générer le HTML pour les options de méthodes de paiement
function generatePaymentMethodOptions(selectedMethod = null) {
    return CONFIG.PAYMENT_METHODS.map(method => {
        const selected = selectedMethod === method.id ? 'selected' : '';
        return `<option value="${method.id}" ${selected}>${method.name}</option>`;
    }).join('');
}

// Générer le HTML pour les radio buttons de méthodes de paiement
function generatePaymentMethodRadios(name, selectedMethod = null, onChangeFunction = null) {
    const onChange = onChangeFunction ? `onchange="${onChangeFunction}()"` : '';
    
    return CONFIG.PAYMENT_METHODS.map((method, index) => {
        const checked = (selectedMethod === method.id || (selectedMethod === null && index === 0)) ? 'checked' : '';
        return `
            <label class="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                <input type="radio" name="${name}" value="${method.id}" class="mr-3" ${checked} ${onChange}>
                <i class="fas fa-${method.icon} text-${method.color}-600 mr-2"></i>
                <span>${method.name}</span>
            </label>
        `;
    }).join('');
}

// Générer le HTML pour les options d'opérateurs
function generateOperatorOptions(selectedOperator = null) {
    return CONFIG.SIM_OPERATORS.map(operator => {
        const selected = selectedOperator === operator.name ? 'selected' : '';
        return `<option value="${operator.name}" ${selected}>${operator.name}</option>`;
    }).join('');
}

// Initialiser la structure de caisse selon les méthodes de paiement
function initializeCaisseStructure() {
    // S'assurer que toutes les méthodes de paiement ont une entrée dans la caisse
    CONFIG.PAYMENT_METHODS.forEach(method => {
        if (!(method.caisseKey in window.appData.caisse)) {
            window.appData.caisse[method.caisseKey] = 0;
        }
    });
    
    // La caisse sera recalculée depuis les transactions
    calculateCaisseFromTransactions();
}

// Initialisation des données
async function initializeData() {
    try {
        // Attendre que Firebase soit prêt
        await waitForFirebase();
        
        // Charger toutes les données depuis Firebase
        await loadAllDataFromFirebase();
        
        // Initialiser la structure de caisse
        initializeCaisseStructure();
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showAlert('Erreur lors de l\'initialisation', 'error');
    }
}

// Sauvegarde des données (maintenant synchronise avec Firebase)
async function saveData() {
    try {
        // Pour Firebase, les données sont sauvegardées au fur et à mesure
        // Cette fonction est conservée pour la compatibilité
        console.log('Données synchronisées avec Firebase');
    } catch (error) {
        console.warn('Erreur lors de la synchronisation:', error);
        showAlert('Erreur lors de la synchronisation', 'warning');
    }
}

// Placeholder pour les modules non chargés
function getModulePlaceholder(moduleName, icon) {
    return `
        <div class="text-center py-12">
            <i class="fas fa-${icon} text-4xl text-gray-400 mb-4"></i>
            <h2 class="text-xl font-semibold text-gray-600">Module ${moduleName}</h2>
            <p class="text-gray-500">Le module ${moduleName} n'est pas encore chargé.</p>
            <p class="text-sm text-gray-400 mt-2">Vérifiez que le fichier JS correspondant est inclus.</p>
        </div>
    `;
}

// Fonction pour rafraîchir le module actuel
function updateCurrentModule() {
    if (window.currentModule) {
        window.showModule(window.currentModule);
    }
}

// ========== FONCTION SHOWMODULE FINALE ==========
// Cette fonction remplace la version temporaire de init.js
window.realShowModule = function(moduleName) {
    currentModule = moduleName;
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

        // AJOUT : Case pour le module Promotions
        case 'promotions':
            if (typeof getPromotionsHTML === 'function') {
                container.innerHTML = getPromotionsHTML();
                if (typeof initPromotions === 'function') initPromotions();
            } else {
                container.innerHTML = getModulePlaceholder('Promotions', 'tags');
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
    
    // Remplacer la fonction temporaire
    window.showModule = window.realShowModule;
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM chargé, initialisation Firebase...');
    
    // Initialiser les données depuis Firebase
    await initializeData();
    
    // Détecter le module depuis l'URL
    const hash = window.location.hash.substring(1);
    const initialModule = hash || 'dashboard';
    
    // Charger le module initial
    if (window.showModule) {
        window.showModule(initialModule);
    } else {
        console.error('showModule non définie');
    }
});

// Gestion du bouton retour du navigateur
window.addEventListener('popstate', function(e) {
    const hash = window.location.hash.substring(1);
    const module = hash || 'dashboard';
    if (window.showModule) {
        window.showModule(module);
    }
});

// ========== SYSTÈME D'ALERTES ==========

window.showAlert = function(message, type = 'info', duration = 3000) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        console.error('Alert container non trouvé');
        return;
    }
    
    const alert = document.createElement('div');
    
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)} mr-2"></i>
        ${message}
    `;
    
    alertContainer.appendChild(alert);
    
    // Animation d'entrée
    setTimeout(() => alert.classList.add('show'), 100);
    
    // Suppression automatique
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, duration);
}

function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ========== UTILITAIRES POUR LES DONNÉES ==========

window.generateId = function(prefix, collection) {
    const maxId = collection.reduce((max, item) => {
        const numStr = item.id.replace(prefix, '');
        const num = parseInt(numStr) || 0;
        return num > max ? num : max;
    }, 0);
    return prefix + String(maxId + 1).padStart(3, '0');
}

window.formatCurrency = function(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + CONFIG.CURRENCY;
}

window.formatDate = function(dateString) {
    return new Date(dateString).toLocaleDateString(CONFIG.DATE_FORMAT);
}

window.getCurrentDate = function() {
    return new Date().toISOString().split('T')[0];
}

// ========== GESTION DES MODALS ==========

let currentModal = null;

window.openModal = function(modalId, data = null) {
    closeModal(); // Fermer les autres modals
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        currentModal = modalId;
        
        // Focus sur le premier input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

window.closeModal = function(modalId = null) {
    const targetModal = modalId || currentModal;
    if (targetModal) {
        const modal = document.getElementById(targetModal);
        if (modal) {
            modal.classList.remove('active');
            
            // Reset form si présent
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
        currentModal = null;
    }
}

// Fermeture des modals par clic extérieur
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Fermeture des modals par Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentModal) {
        closeModal();
    }
});

// ========== GESTION DES FORMULAIRES ==========

function handleFormSubmit(formId, callback) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            callback(data);
        });
    }
}

// ========== CALCULS STATISTIQUES ==========

function calculateStats() {
    return {
        totalClients: window.appData.clients.length,
        gpsDisponibles: window.appData.gps.filter(g => g.statut === 'Disponible').length,
        gpsLoues: window.appData.gps.filter(g => g.statut === 'Loué').length,
        locationsActives: window.appData.locations.filter(l => l.statut === 'en cours').length,
        simActives: window.appData.sim.filter(s => s.statut === 'Active').length,
        simInactives: window.appData.sim.filter(s => s.statut === 'Inactive').length,
        revenuMensuel: window.appData.paiements
            .filter(p => {
                const paiementDate = new Date(p.datePaiement);
                const now = new Date();
                return paiementDate.getMonth() === now.getMonth() && 
                       paiementDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, p) => sum + p.montant, 0),
        caisse: window.appData.caisse
    };
}

// ========== VALIDATION DES DONNÉES ==========

function validateRequired(data, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].toString().trim() === '') {
            errors.push(`Le champ ${field} est requis`);
        }
    });
    
    return errors;
}

function validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9\s\-\+\(\)]{8,15}$/;
    return phoneRegex.test(phone);
}

window.validateIMEI = function(imei) {
    const imeiRegex = /^[0-9]{15}$/;
    return imeiRegex.test(imei);
}

// ========== GESTION DES ERREURS ==========

function handleError(error, context = '') {
    console.error(`Erreur ${context}:`, error);
    showAlert(`Une erreur s'est produite ${context}`, 'error');
}

// ========== EXPORT/IMPORT DES DONNÉES ==========

async function exportData() {
    try {
        // Recharger toutes les données depuis Firebase pour avoir la dernière version
        await loadAllDataFromFirebase();
        
        const dataStr = JSON.stringify(window.appData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `malaza-backup-${getCurrentDate()}.json`;
        link.click();
        
        showAlert('Sauvegarde exportée avec succès', 'success');
    } catch (error) {
        handleError(error, 'lors de l\'export');
    }
}

// L'import n'est pas recommandé avec Firebase (risque de corruption)
// Mais on garde la fonction pour la compatibilité
async function importData(file) {
    if (!confirm('ATTENTION: L\'import écrasera toutes les données actuelles dans Firebase. Êtes-vous sûr ?')) {
        return;
    }
    
    showAlert('L\'import de données n\'est pas recommandé avec Firebase', 'warning');
}

// ========== RECHERCHE ET FILTRAGE ==========

function searchInData(collection, searchTerm, fields) {
    const term = searchTerm.toLowerCase();
    return collection.filter(item => {
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(term);
        });
    });
}

// ========== GESTION DES CONFIGURATIONS ==========

// Les fonctions de configuration restent identiques
function addPaymentMethod(method) {
    if (!CONFIG.PAYMENT_METHODS.find(m => m.id === method.id)) {
        CONFIG.PAYMENT_METHODS.push(method);
        
        if (!(method.caisseKey in window.appData.caisse)) {
            window.appData.caisse[method.caisseKey] = 0;
        }
        
        initializeCaisseStructure();
        
        console.log(`Nouvelle méthode de paiement ajoutée: ${method.name}`);
    }
}

function addSimOperator(operator) {
    if (!CONFIG.SIM_OPERATORS.find(o => o.id === operator.id)) {
        CONFIG.SIM_OPERATORS.push(operator);
        console.log(`Nouvel opérateur SIM ajouté: ${operator.name}`);
        return true;
    }
    return false;
}

function removeSimOperator(operatorId) {
    const index = CONFIG.SIM_OPERATORS.findIndex(o => o.id === operatorId);
    if (index !== -1) {
        CONFIG.SIM_OPERATORS.splice(index, 1);
        return true;
    }
    return false;
}

// ========== GESTION DES FORFAITS ==========

function getForfaitTypes() {
    return CONFIG.FORFAIT_TYPES || [];
}

function addForfaitType(forfait) {
    if (!CONFIG.FORFAIT_TYPES) {
        CONFIG.FORFAIT_TYPES = [];
    }
    
    if (!CONFIG.FORFAIT_TYPES.find(f => f.id === forfait.id)) {
        CONFIG.FORFAIT_TYPES.push(forfait);
        return true;
    }
    return false;
}

function removeForfaitType(forfaitId) {
    if (!CONFIG.FORFAIT_TYPES) return false;
    
    const index = CONFIG.FORFAIT_TYPES.findIndex(f => f.id === forfaitId);
    if (index !== -1) {
        CONFIG.FORFAIT_TYPES.splice(index, 1);
        return true;
    }
    return false;
}

function updateForfaitType(forfaitId, updatedForfait) {
    if (!CONFIG.FORFAIT_TYPES) return false;
    
    const index = CONFIG.FORFAIT_TYPES.findIndex(f => f.id === forfaitId);
    if (index !== -1) {
        CONFIG.FORFAIT_TYPES[index] = updatedForfait;
        return true;
    }
    return false;
}

function getForfaitPrice(forfaitId) {
    const forfait = CONFIG.FORFAIT_TYPES.find(f => f.id === forfaitId);
    return forfait ? forfait.price : 0;
}

function getForfaitDuration(forfaitId) {
    const forfait = CONFIG.FORFAIT_TYPES.find(f => f.id === forfaitId);
    return forfait ? forfait.duration : 0;
}

// ========== GESTION DES COÛTS ==========

function getSimPurchaseCost() {
    return CONFIG.COSTS.SIM_PURCHASE || 3000;
}

function updateSimPurchaseCost(newCost) {
    if (newCost >= 0) {
        CONFIG.COSTS.SIM_PURCHASE = newCost;
        return true;
    }
    return false;
}

// Rendre les fonctions globales pour les autres modules
window.saveToFirebase = saveToFirebase;
window.deleteFromFirebase = deleteFromFirebase;
window.saveClientToFirebase = saveClientToFirebase;
window.deleteClientFromFirebase = deleteClientFromFirebase;
window.updateCaisseInFirebase = updateCaisseInFirebase;
window.calculateCaisseFromTransactions = calculateCaisseFromTransactions;
window.getAvailablePaymentMethods = getAvailablePaymentMethods;
window.getPaymentMethodBalance = getPaymentMethodBalance;
window.updatePaymentMethodBalance = updatePaymentMethodBalance;
window.checkFundsAvailability = checkFundsAvailability;
window.getPaymentMethodDetails = getPaymentMethodDetails;
window.generatePaymentMethodOptions = generatePaymentMethodOptions;
window.generatePaymentMethodRadios = generatePaymentMethodRadios;
window.generateOperatorOptions = generateOperatorOptions;
window.CONFIG = CONFIG;
window.getDaysUntilExpiry = function(dateExpiration) {
    if (!dateExpiration) return null;
    const today = new Date();
    const expiryDate = new Date(dateExpiration);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Initialisation globale
console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} - Connecté à Firebase avec caisse dynamique`);
console.log('Méthodes de paiement disponibles:', CONFIG.PAYMENT_METHODS.map(m => m.name));
console.log('Opérateurs SIM disponibles:', CONFIG.SIM_OPERATORS.map(o => o.name));
console.log('Types de forfaits disponibles:', CONFIG.FORFAIT_TYPES.map(f => f.displayName));