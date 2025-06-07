// Module Paiements - Version Firebase avec transactions automatiques et Phase 2.1
console.log('Module Paiements chargé - Version Firebase avec Phase 2.1');

function getPaiementsHTML() {
    return `
        <div class="space-y-4 sm:space-y-6 fade-in">
            <!-- En-tête -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Suivi des Paiements</h1>
                    <p class="text-gray-600 text-sm sm:text-base">Gérez les paiements et l'état de votre caisse</p>
                </div>
                <button onclick="openPaiementModal()" class="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                    <i class="fas fa-plus mr-1 sm:mr-2"></i>
                    <span class="sm:hidden">Paiement</span>
                    <span class="hidden sm:inline">Nouveau Paiement</span>
                </button>
            </div>

            <!-- État de la Caisse -->
            <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900">État de la Caisse</h3>
                    <button onclick="showCaisseMovements()" class="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
                        <i class="fas fa-history mr-1"></i>
                        <span class="hidden sm:inline">Voir mouvements</span>
                        <span class="sm:hidden">Mouvements</span>
                    </button>
                </div>
                <div class="grid grid-cols-3 gap-3 sm:gap-4">
                    <div class="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                        <i class="fas fa-money-bill-wave text-green-600 text-xl sm:text-2xl mb-1 sm:mb-2"></i>
                        <p class="text-xs sm:text-sm text-gray-600">Espèces</p>
                        <p class="text-base sm:text-2xl font-bold text-green-600" id="caisseEspeces">0 Ar</p>
                    </div>
                    <div class="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                        <i class="fas fa-mobile-alt text-blue-600 text-xl sm:text-2xl mb-1 sm:mb-2"></i>
                        <p class="text-xs sm:text-sm text-gray-600">MVola</p>
                        <p class="text-base sm:text-2xl font-bold text-blue-600" id="caisseMVola">0 Ar</p>
                    </div>
                    <div class="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <i class="fas fa-wallet text-gray-600 text-xl sm:text-2xl mb-1 sm:mb-2"></i>
                        <p class="text-xs sm:text-sm text-gray-600">Total</p>
                        <p class="text-base sm:text-2xl font-bold text-gray-900" id="caisseTotal">0 Ar</p>
                    </div>
                </div>
            </div>

            <!-- Statistiques Paiements -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-1.5 sm:p-2 bg-green-100 rounded-full">
                            <i class="fas fa-receipt text-green-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Total</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="totalPaiements">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-1.5 sm:p-2 bg-blue-100 rounded-full">
                            <i class="fas fa-calendar-day text-blue-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Aujourd'hui</p>
                            <p class="text-sm sm:text-xl font-bold text-gray-900" id="paiementsAujourdhui">0 Ar</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-1.5 sm:p-2 bg-purple-100 rounded-full">
                            <i class="fas fa-calendar-month text-purple-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Ce Mois</p>
                            <p class="text-sm sm:text-xl font-bold text-gray-900" id="paiementsCeMois">0 Ar</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-1.5 sm:p-2 bg-yellow-100 rounded-full">
                            <i class="fas fa-chart-line text-yellow-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Moy/Jour</p>
                            <p class="text-sm sm:text-xl font-bold text-gray-900" id="moyenneJour">0 Ar</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtres -->
            <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                    <div class="flex items-center space-x-2">
                        <label class="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Méthode:</label>
                        <select id="filterMethode" onchange="filterPaiements()" class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-none">
                            <option value="">Toutes</option>
                            <!-- Options générées dynamiquement -->
                        </select>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Client:</label>
                        <select id="filterClientPaiement" onchange="filterPaiements()" class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-none">
                            <option value="">Tous</option>
                            <!-- Options générées dynamiquement -->
                        </select>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Période:</label>
                        <select id="filterPeriode" onchange="filterPaiements()" class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-none">
                            <option value="">Toutes</option>
                            <option value="month">Ce mois</option>
                            <option value="trimester">Ce trimestre</option>
                            <option value="year">Cette année</option>
                        </select>
                    </div>
                    <div class="flex items-center space-x-3 sm:ml-auto">
                        <button onclick="resetPaiementFilters()" class="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
                            <i class="fas fa-undo mr-1"></i>
                            <span class="hidden sm:inline">Réinitialiser</span>
                            <span class="sm:hidden">Reset</span>
                        </button>
                        <button onclick="exportPaiements()" class="text-green-600 hover:text-green-800 text-xs sm:text-sm">
                            <i class="fas fa-download mr-1"></i>
                            <span class="hidden sm:inline">Exporter</span>
                            <span class="sm:hidden">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Desktop Table (Hidden on mobile) -->
            <div class="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Historique des Paiements</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Paiement
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Montant
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Méthode
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payé jusqu'au
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody id="paiementsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Contenu généré dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Cards (Hidden on desktop) -->
            <div class="lg:hidden">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-base font-medium text-gray-900">Historique</h3>
                    <span class="text-sm text-gray-500" id="mobilePaiementsCount">0 paiements</span>
                </div>
                <div id="mobilePaiementsContainer" class="space-y-3">
                    <!-- Mobile cards générées dynamiquement -->
                </div>
            </div>
        </div>

        <!-- Modal Nouveau Paiement - Mobile Responsive -->
        <div id="paiementModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2">
                    <h3 class="text-lg font-semibold text-gray-900">Nouveau Paiement</h3>
                    <button onclick="closeModal('paiementModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="paiementForm">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                            <select 
                                name="locationId" 
                                id="paiementLocationId"
                                required 
                                onchange="updatePaiementInfo()"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner une location</option>
                                <!-- Options générées dynamiquement -->
                            </select>
                        </div>
                        
                        <!-- Infos location sélectionnée -->
                        <div id="locationInfo" class="hidden bg-gray-50 p-3 rounded-lg">
                            <h4 class="font-medium text-gray-900 mb-2">Informations location</h4>
                            <div id="locationInfoContent" class="text-sm text-gray-600 space-y-1">
                                <!-- Contenu généré dynamiquement -->
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de mois *</label>
                            <input 
                                type="number" 
                                name="mois" 
                                id="paiementMois"
                                required
                                min="1"
                                value="1"
                                onchange="calculatePaiementTotal()"
                                oninput="calculatePaiementTotal()"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                inputmode="numeric"
                            >
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Montant total</label>
                            <div class="relative">
                                <input 
                                    type="number" 
                                    name="montant" 
                                    id="paiementMontant"
                                    readonly
                                    class="w-full p-3 text-base border rounded-lg bg-gray-100 font-bold text-lg pr-12"
                                    placeholder="0"
                                    inputmode="numeric"
                                >
                                <span class="absolute right-3 top-3 text-gray-500">Ar</span>
                            </div>
                            <div class="text-xs text-gray-500 mt-1" id="montantDetails"></div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement *</label>
                            <div class="space-y-2" id="paiementMethodeContainer">
                                <!-- Options générées dynamiquement -->
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date de paiement</label>
                            <input 
                                type="date" 
                                name="datePaiement" 
                                id="paiementDate"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                            <textarea 
                                name="commentaire" 
                                id="paiementCommentaire"
                                rows="2"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Commentaire optionnel..."
                            ></textarea>
                        </div>
                        
                        <!-- Vérification du solde -->
                        <div id="soldeVerification" class="hidden">
                            <div class="bg-gray-50 p-3 rounded">
                                <div class="space-y-1 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Solde actuel:</span>
                                        <span class="font-medium" id="currentSoldePaiement">0 Ar</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Montant paiement:</span>
                                        <span class="font-medium" id="montantPaiementDisplay">0 Ar</span>
                                    </div>
                                    <div class="flex justify-between border-t pt-1">
                                        <span class="text-gray-600">Solde après:</span>
                                        <span class="font-medium" id="afterPaymentBalance">0 Ar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div class="flex items-center">
                                <i class="fas fa-info-circle text-green-600 mr-2"></i>
                                <p class="text-green-800 text-sm">
                                    Le montant sera automatiquement ajouté à votre caisse
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sticky bottom-0 bg-white border-t mt-4">
                            <button 
                                type="submit" 
                                id="paiementSubmitBtn"
                                class="w-full sm:flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-base font-medium"
                            >
                                <i class="fas fa-save mr-2"></i>
                                Enregistrer
                            </button>
                            <button 
                                type="button" 
                                onclick="closeModal('paiementModal')" 
                                class="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-base font-medium"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Mouvements Caisse - Mobile Responsive -->
        <div id="caisseMovementsModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Mouvements de Caisse</h3>
                    <button onclick="closeModal('caisseMovementsModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div id="caisseMovementsContent" class="space-y-4">
                    <!-- Contenu généré dynamiquement -->
                </div>
                
                <div class="flex justify-end pt-4">
                    <button 
                        onclick="closeModal('caisseMovementsModal')" 
                        class="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Variable globale pour stocker le tarif de la location sélectionnée
let currentLocationTarif = 0;

async function initPaiements() {
    console.log('Initialisation du module Paiements avec transactions automatiques');
    
    // Recalculer la caisse depuis les transactions
    window.calculateCaisseFromTransactions();
    
    // Charger les données
    populatePaiementFilters();
    generatePaymentMethodOptions();
    renderPaiementsTable();
    renderMobilePaiements();
    updatePaiementsStats();
    updateCaisseDisplay();
    
    // Initialiser le formulaire
    setupPaiementForm();
    
    // Écouter les changements en temps réel
    listenToPaiementsChanges();
}

// Écouter les changements en temps réel depuis Firebase
function listenToPaiementsChanges() {
    if (!window.firebaseDB) {
        console.error('Firebase DB non initialisé');
        setTimeout(() => {
            listenToPaiementsChanges();
        }, 1000);
        return;
    }
    
    // Écouter les changements sur la collection paiements
    window.firebaseDB.collection('paiements').onSnapshot((snapshot) => {
        console.log('Changements détectés dans les paiements');
        
        // Mettre à jour le cache local
        window.appData.paiements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Rafraîchir l'affichage
        renderPaiementsTable();
        renderMobilePaiements();
        updatePaiementsStats();
        populatePaiementFilters();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements paiements:', error);
    });
    
    // Écouter les changements sur les transactions pour recalculer la caisse
    window.firebaseDB.collection('transactions').onSnapshot((snapshot) => {
        window.appData.transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Recalculer la caisse
        window.calculateCaisseFromTransactions();
        updateCaisseDisplay();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements transactions:', error);
    });
}

function setupPaiementForm() {
    const form = document.getElementById('paiementForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Ajouter la méthode de paiement depuis le radio button sélectionné
            const selectedPaymentMethod = document.querySelector('input[name="methodePaiement"]:checked');
            if (selectedPaymentMethod) {
                data.methode = selectedPaymentMethod.value;
            }
            
            await handlePaiementSubmit(data);
        });
    }
    
    // Pré-remplir les selects
    populatePaiementSelects();
    
    // Date par défaut = aujourd'hui
    document.getElementById('paiementDate').value = window.getCurrentDate();
}

function generatePaymentMethodOptions() {
    const container = document.getElementById('paiementMethodeContainer');
    if (container) {
        container.innerHTML = window.generatePaymentMethodRadios('methodePaiement', null, 'updatePaymentBalance');
    }
}

function updatePaymentBalance() {
    const selectedMethodInput = document.querySelector('input[name="methodePaiement"]:checked');
    if (!selectedMethodInput) return;
    
    const montant = parseInt(document.getElementById('paiementMontant').value) || 0;
    if (montant <= 0) {
        document.getElementById('soldeVerification').classList.add('hidden');
        return;
    }
    
    const selectedMethodId = selectedMethodInput.value.toLowerCase();
    const currentSolde = window.getPaymentMethodBalance(selectedMethodId);
    
    // Afficher les informations de solde
    document.getElementById('currentSoldePaiement').textContent = window.formatCurrency(currentSolde);
    document.getElementById('montantPaiementDisplay').textContent = window.formatCurrency(montant);
    document.getElementById('afterPaymentBalance').textContent = window.formatCurrency(currentSolde + montant);
    document.getElementById('soldeVerification').classList.remove('hidden');
}

function populatePaiementSelects() {
    // Locations en cours
    const locationSelect = document.getElementById('paiementLocationId');
    if (locationSelect) {
        locationSelect.innerHTML = '<option value="">Sélectionner une location</option>';
        window.appData.locations.filter(l => l.statut === 'en cours').forEach(location => {
            locationSelect.innerHTML += `<option value="${location.id}">${location.id} - ${location.nomClient}</option>`;
        });
    }
}

function populatePaiementFilters() {
    // Filtre méthodes - utiliser les méthodes dynamiques
    const methodeFilter = document.getElementById('filterMethode');
    if (methodeFilter) {
        methodeFilter.innerHTML = '<option value="">Toutes</option>';
        const methods = window.getAvailablePaymentMethods();
        methods.forEach(method => {
            methodeFilter.innerHTML += `<option value="${method.name}">${method.name}</option>`;
        });
    }
    
    // Filtre clients
    const clientFilter = document.getElementById('filterClientPaiement');
    if (clientFilter) {
        const uniqueClients = [...new Set(window.appData.paiements.map(p => p.clientId))];
        clientFilter.innerHTML = '<option value="">Tous</option>';
        uniqueClients.forEach(clientId => {
            const client = window.appData.clients.find(c => c.id === clientId);
            if (client) {
                clientFilter.innerHTML += `<option value="${client.id}">${client.nom}</option>`;
            }
        });
    }
}

window.updatePaiementInfo = function() {
    const locationId = document.getElementById('paiementLocationId').value;
    const locationInfo = document.getElementById('locationInfo');
    const locationInfoContent = document.getElementById('locationInfoContent');
    
    if (locationId) {
        const location = window.appData.locations.find(l => l.id === locationId);
        if (location) {
            currentLocationTarif = location.tarif;
            
            // Calculer la dernière période payée
            const dernierPaiement = window.appData.paiements
                .filter(p => p.locationId === locationId)
                .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))[0];
            
            let dernierePeriodeInfo = '';
            if (dernierPaiement && dernierPaiement.payeJusquau) {
                const payeJusquauDate = new Date(dernierPaiement.payeJusquau);
                const today = new Date();
                const daysRemaining = Math.ceil((payeJusquauDate - today) / (1000 * 60 * 60 * 24));
                
                if (daysRemaining > 0) {
                    dernierePeriodeInfo = `<div class="text-green-600">Payé jusqu'au: <strong>${window.formatDate(dernierPaiement.payeJusquau)}</strong> (${daysRemaining}j restants)</div>`;
                } else {
                    dernierePeriodeInfo = `<div class="text-red-600">Dernier paiement expiré depuis ${Math.abs(daysRemaining)} jours</div>`;
                }
            } else {
                dernierePeriodeInfo = '<div class="text-orange-600">Aucun paiement enregistré</div>';
            }
            
            // Afficher les infos
            locationInfoContent.innerHTML = `
                <div>Client: <strong>${location.nomClient}</strong></div>
                <div>GPS: <strong>${location.gpsId}</strong></div>
                <div>Tarif mensuel: <strong>${window.formatCurrency(location.tarif)}</strong></div>
                <div>Début location: <strong>${window.formatDate(location.dateDebut)}</strong></div>
                ${dernierePeriodeInfo}
            `;
            locationInfo.classList.remove('hidden');
            
            // Calculer le montant total
            calculatePaiementTotal();
        }
    } else {
        locationInfo.classList.add('hidden');
        currentLocationTarif = 0;
        document.getElementById('paiementMontant').value = '';
        document.getElementById('montantDetails').innerHTML = '';
        document.getElementById('soldeVerification').classList.add('hidden');
    }
}

function calculatePaiementTotal() {
    const mois = parseInt(document.getElementById('paiementMois').value) || 0;
    const locationId = document.getElementById('paiementLocationId').value;
    const location = window.appData.locations.find(l => l.id === locationId);
    
    if (!location) {
        document.getElementById('paiementMontant').value = '';
        document.getElementById('montantDetails').innerHTML = '';
        return;
    }
    
    let montantTotal = currentLocationTarif * mois;
    let details = `${mois} mois × ${window.formatCurrency(currentLocationTarif)}`;
    
    // Vérifier si c'est le premier paiement
    const paiementsLocation = window.appData.paiements.filter(p => p.locationId === locationId);
    
    if (paiementsLocation.length === 0) {
        // C'est le premier paiement - vérifier les frais et promotions
        if (location.fraisActivation > 0 && !location.fraisActivationGratuit) {
            montantTotal += location.fraisActivation;
            details += ` + Frais d'activation: ${window.formatCurrency(location.fraisActivation)}`;
        }
        
        if (location.premierMoisGratuit && mois >= 1) {
            // Si le premier mois est gratuit, on déduit un mois
            montantTotal -= currentLocationTarif;
            details += ` - Premier mois gratuit`;
        }
        
        if (location.montantRemise > 0) {
            montantTotal -= location.montantRemise;
            details += ` - Remise promotion: ${window.formatCurrency(location.montantRemise)}`;
        }
    }
    
    // S'assurer que le montant n'est pas négatif
    montantTotal = Math.max(0, montantTotal);
    
    document.getElementById('paiementMontant').value = montantTotal;
    document.getElementById('montantDetails').innerHTML = details + ` = <strong>${window.formatCurrency(montantTotal)}</strong>`;
    
    // Mettre à jour la vérification du solde
    updatePaymentBalance();
}

function calculatePayeJusquau(locationId, datePaiement, mois) {
    // Récupérer la location
    const location = window.appData.locations.find(l => l.id === locationId);
    if (!location) return null;
    
    // Trouver tous les paiements pour cette location
    const paiementsLocation = window.appData.paiements
        .filter(p => p.locationId === locationId)
        .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement));
    
    let startDate;
    
    // S'il y a des paiements existants
    if (paiementsLocation.length > 0) {
        // Trouver le paiement avec la date "payé jusqu'au" la plus récente
        let latestPayeJusquau = null;
        
        paiementsLocation.forEach(p => {
            if (p.payeJusquau) {
                const pDate = new Date(p.payeJusquau);
                if (!latestPayeJusquau || pDate > latestPayeJusquau) {
                    latestPayeJusquau = pDate;
                }
            }
        });
        
        if (latestPayeJusquau) {
            // Commencer le jour après la dernière période couverte
            startDate = new Date(latestPayeJusquau);
            startDate.setDate(startDate.getDate() + 1);
        } else {
            // Si aucun paiement n'a de date "payé jusqu'au", commencer à la date de début
            startDate = new Date(location.dateDebut);
        }
    } else {
        // Pas de paiement précédent, commencer à la date de début de location
        startDate = new Date(location.dateDebut);
    }
    
    // Ajouter le nombre de mois
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(mois));
    endDate.setDate(endDate.getDate() - 1); // Le dernier jour couvert
    
    return endDate.toISOString().split('T')[0];
}

function renderPaiementsTable() {
    const tbody = document.getElementById('paiementsTableBody');
    
    if (!tbody) {
        console.log('Element paiementsTableBody non trouvé (normal sur mobile)');
        return;
    }
    
    let paiementsToShow = [...window.appData.paiements];
    
    // Appliquer les filtres
    const filterMethode = document.getElementById('filterMethode')?.value;
    const filterClient = document.getElementById('filterClientPaiement')?.value;
    const filterPeriode = document.getElementById('filterPeriode')?.value;
    
    if (filterMethode) {
        paiementsToShow = paiementsToShow.filter(p => p.methode === filterMethode);
    }
    
    if (filterClient) {
        paiementsToShow = paiementsToShow.filter(p => p.clientId === filterClient);
    }
    
    if (filterPeriode) {
        const now = new Date();
        let startDate;
        
        switch(filterPeriode) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'trimester':
                const currentQuarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }
        
        if (startDate) {
            paiementsToShow = paiementsToShow.filter(p => new Date(p.datePaiement) >= startDate);
        }
    }
    
    // Trier par date décroissante
    paiementsToShow.sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement));
    
    if (paiementsToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-receipt text-4xl mb-2"></i>
                    <p>Aucun paiement trouvé</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = paiementsToShow.map(paiement => {
        const method = window.getPaymentMethodDetails(paiement.methode.toLowerCase());
        const methodeColor = method ? `text-${method.color}-600` : 'text-gray-600';
        const methodeIcon = method ? method.icon : 'money-bill-wave';
        
        // Calculer l'état du "payé jusqu'au"
        let payeJusquauDisplay = '-';
        
        if (paiement.payeJusquau) {
            const payeJusquauDate = new Date(paiement.payeJusquau);
            const today = new Date();
            const daysRemaining = Math.ceil((payeJusquauDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining < 0) {
                payeJusquauDisplay = `<span class="text-red-600 font-bold">Expiré (${Math.abs(daysRemaining)}j)</span>`;
            } else if (daysRemaining <= 7) {
                payeJusquauDisplay = `<span class="text-orange-600 font-bold">${window.formatDate(paiement.payeJusquau)} (${daysRemaining}j)</span>`;
            } else {
                payeJusquauDisplay = `<span class="text-green-600">${window.formatDate(paiement.payeJusquau)}</span>`;
            }
        }
        
        // Ajouter l'indicateur de promotion
        let promotionBadge = '';
        if (paiement.promotionAppliquee) {
            promotionBadge = `<span class="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                <i class="fas fa-tag mr-1"></i>${paiement.promotionAppliquee}
            </span>`;
        }
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <i class="fas fa-receipt text-green-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${paiement.id}</div>
                            ${paiement.mois ? `<div class="text-sm text-gray-500">${paiement.mois} mois</div>` : ''}
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${paiement.nomClient}</div>
                    <div class="text-sm text-gray-500">${paiement.clientId}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${paiement.locationId}</div>
                    ${promotionBadge}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-green-600">${window.formatCurrency(paiement.montant)}</div>
                    ${paiement.montantRemise ? `<div class="text-xs text-gray-500">Remise: ${window.formatCurrency(paiement.montantRemise)}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <i class="fas fa-${methodeIcon} ${methodeColor} mr-2"></i>
                        <span class="text-sm text-gray-900">${paiement.methode}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${window.formatDate(paiement.datePaiement)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    ${payeJusquauDisplay}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex space-x-2">
                        <button 
                            onclick="showPaiementDetails('${paiement.id}')" 
                            class="text-blue-600 hover:text-blue-900" 
                            title="Voir détails"
                        >
                            <i class="fas fa-eye"></i>
                        </button>
                        <button 
                            onclick="deletePaiement('${paiement.id}')" 
                            class="text-red-600 hover:text-red-900" 
                            title="Supprimer"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderMobilePaiements() {
    const container = document.getElementById('mobilePaiementsContainer');
    const countElement = document.getElementById('mobilePaiementsCount');
    
    if (!container) {
        console.log('Element mobilePaiementsContainer non trouvé (normal sur desktop)');
        return;
    }
    
    let paiementsToShow = [...window.appData.paiements];
    
    // Appliquer les mêmes filtres que pour la table desktop
    const filterMethode = document.getElementById('filterMethode')?.value;
    const filterClient = document.getElementById('filterClientPaiement')?.value;
    const filterPeriode = document.getElementById('filterPeriode')?.value;
    
    if (filterMethode) {
        paiementsToShow = paiementsToShow.filter(p => p.methode === filterMethode);
    }
    
    if (filterClient) {
        paiementsToShow = paiementsToShow.filter(p => p.clientId === filterClient);
    }
    
    if (filterPeriode) {
        const now = new Date();
        let startDate;
        
        switch(filterPeriode) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'trimester':
                const currentQuarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }
        
        if (startDate) {
            paiementsToShow = paiementsToShow.filter(p => new Date(p.datePaiement) >= startDate);
        }
    }
    
    // Trier par date décroissante
    paiementsToShow.sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement));
    
    // Mettre à jour le compteur
    if (countElement) {
        countElement.textContent = `${paiementsToShow.length} paiement${paiementsToShow.length > 1 ? 's' : ''}`;
    }
    
    if (paiementsToShow.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-lg">
                <i class="fas fa-receipt text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 mb-4">Aucun paiement trouvé</p>
                <button onclick="openPaiementModal()" class="bg-green-600 text-white px-4 py-2 rounded-lg">
                    <i class="fas fa-plus mr-2"></i>
                    Ajouter un paiement
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = paiementsToShow.map(paiement => {
        const method = window.getPaymentMethodDetails(paiement.methode.toLowerCase());
        const config = method ? 
            { color: method.color, icon: method.icon, bg: `bg-${method.color}-100` } :
            { color: 'gray', icon: 'money-bill-wave', bg: 'bg-gray-100' };
        
        // Calculer l'état du paiement
        let statusBadge = '';
        if (paiement.payeJusquau) {
            const payeJusquauDate = new Date(paiement.payeJusquau);
            const today = new Date();
            const daysRemaining = Math.ceil((payeJusquauDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining < 0) {
                statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Expiré</span>`;
            } else if (daysRemaining <= 7) {
                statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">${daysRemaining}j restants</span>`;
            } else {
                statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">À jour</span>`;
            }
        }
        
        // Badge promotion
        let promotionBadge = '';
        if (paiement.promotionAppliquee) {
            promotionBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                <i class="fas fa-tag mr-1"></i>${paiement.promotionAppliquee}
            </span>`;
        }
        
        return `
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <!-- Header avec ID et statut -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full ${config.bg} flex items-center justify-center mr-3">
                            <i class="fas fa-${config.icon} text-${config.color}-600"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">${paiement.id}</h3>
                            <p class="text-sm text-gray-500">${window.formatDate(paiement.datePaiement)}</p>
                        </div>
                    </div>
                    <div class="flex flex-col items-end space-y-1">
                        ${statusBadge}
                        ${promotionBadge}
                    </div>
                </div>
                
                <!-- Informations principales -->
                <div class="space-y-2 mb-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Client:</span>
                        <span class="text-sm font-medium text-gray-900">${paiement.nomClient}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Location:</span>
                        <span class="text-sm font-medium text-gray-900">${paiement.locationId}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Période:</span>
                        <span class="text-sm font-medium text-gray-900">${paiement.mois || 1} mois</span>
                    </div>
                    ${paiement.payeJusquau ? `
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Payé jusqu'au:</span>
                            <span class="text-sm font-medium text-gray-900">${window.formatDate(paiement.payeJusquau)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Montant -->
                <div class="bg-gray-50 rounded-lg p-3 mb-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Montant:</span>
                        <span class="text-xl font-bold text-green-600">${window.formatCurrency(paiement.montant)}</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                        Payé en ${paiement.methode}
                        ${paiement.montantRemise ? ` • Remise: ${window.formatCurrency(paiement.montantRemise)}` : ''}
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-2 pt-3 border-t">
                    <button 
                        onclick="showPaiementDetails('${paiement.id}')" 
                        class="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                        <i class="fas fa-eye mr-2"></i>
                        Détails
                    </button>
                    <button 
                        onclick="deletePaiement('${paiement.id}')" 
                        class="flex-1 bg-red-50 text-red-700 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                        <i class="fas fa-trash-alt mr-2"></i>
                        Supprimer
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updatePaiementsStats() {
    const totalPaiements = window.appData.paiements.length;
    
    // Paiements aujourd'hui
    const today = window.getCurrentDate();
    const paiementsAujourdhui = window.appData.paiements
        .filter(p => p.datePaiement === today)
        .reduce((sum, p) => sum + p.montant, 0);
    
    // Paiements ce mois
    const thisMonth = new Date();
    const paiementsCeMois = window.appData.paiements
        .filter(p => {
            const pDate = new Date(p.datePaiement);
            return pDate.getMonth() === thisMonth.getMonth() && 
                   pDate.getFullYear() === thisMonth.getFullYear();
        })
        .reduce((sum, p) => sum + p.montant, 0);
    
    // Moyenne par jour (sur 30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const paiementsRecents = window.appData.paiements.filter(p => new Date(p.datePaiement) >= thirtyDaysAgo);
    const totalRecents = paiementsRecents.reduce((sum, p) => sum + p.montant, 0);
    const moyenneJour = Math.round(totalRecents / 30);
    
    // Mise à jour des éléments
    const elements = {
        totalPaiements: document.getElementById('totalPaiements'),
        paiementsAujourdhui: document.getElementById('paiementsAujourdhui'),
        paiementsCeMois: document.getElementById('paiementsCeMois'),
        moyenneJour: document.getElementById('moyenneJour')
    };
    
    if (elements.totalPaiements) elements.totalPaiements.textContent = totalPaiements;
    if (elements.paiementsAujourdhui) elements.paiementsAujourdhui.textContent = window.formatCurrency(paiementsAujourdhui);
    if (elements.paiementsCeMois) elements.paiementsCeMois.textContent = window.formatCurrency(paiementsCeMois);
    if (elements.moyenneJour) elements.moyenneJour.textContent = window.formatCurrency(moyenneJour);
}

function updateCaisseDisplay() {
    const elements = {
        caisseEspeces: document.getElementById('caisseEspeces'),
        caisseMVola: document.getElementById('caisseMVola'),
        caisseTotal: document.getElementById('caisseTotal')
    };
    
    if (elements.caisseEspeces) elements.caisseEspeces.textContent = window.formatCurrency(window.appData.caisse.espece);
    if (elements.caisseMVola) elements.caisseMVola.textContent = window.formatCurrency(window.appData.caisse.mvola);
    if (elements.caisseTotal) elements.caisseTotal.textContent = window.formatCurrency(window.appData.caisse.total);
}

function openPaiementModal() {
    // Actualiser les selects
    populatePaiementSelects();
    generatePaymentMethodOptions();
    
    // Réinitialiser le formulaire
    document.getElementById('paiementForm').reset();
    document.getElementById('paiementDate').value = window.getCurrentDate();
    document.getElementById('paiementMois').value = 1;
    document.getElementById('locationInfo').classList.add('hidden');
    document.getElementById('soldeVerification').classList.add('hidden');
    currentLocationTarif = 0;
    document.getElementById('paiementMontant').value = '';
    document.getElementById('montantDetails').innerHTML = '';
    
    window.openModal('paiementModal');
}

async function handlePaiementSubmit(data) {
    // Validation
    if (!data.locationId || !data.mois || !data.methode) {
        window.showAlert('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    const montant = parseInt(data.montant);
    const mois = parseInt(data.mois);
    
    if (mois <= 0) {
        window.showAlert('Le nombre de mois doit être supérieur à 0', 'error');
        return;
    }
    
    if (montant <= 0) {
        window.showAlert('Le montant doit être supérieur à 0', 'error');
        return;
    }
    
    try {
        // Désactiver le bouton pendant la sauvegarde
        const submitBtn = document.getElementById('paiementSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enregistrement...';
        
        const location = window.appData.locations.find(l => l.id === data.locationId);
        if (!location) {
            window.showAlert('Location non trouvée', 'error');
            return;
        }
        
        // Vérifier si c'est le premier paiement
        const paiementsLocation = window.appData.paiements.filter(p => p.locationId === data.locationId);
        
        // Calculer la date "payé jusqu'au"
        const payeJusquau = calculatePayeJusquau(data.locationId, data.datePaiement || window.getCurrentDate(), mois);
        
        // Créer le paiement
        const newPaiement = {
            id: window.generateId('PAY', window.appData.paiements),
            locationId: data.locationId,
            clientId: location.clientId,
            nomClient: location.nomClient,
            methode: data.methode,
            montant: montant,
            mois: mois,
            datePaiement: data.datePaiement || window.getCurrentDate(),
            payeJusquau: payeJusquau,
            commentaire: data.commentaire || '',
            createdAt: new Date().toISOString()
        };
        
        // Si c'est le premier paiement et qu'il y a une promotion
        if (paiementsLocation.length === 0 && location.promotionAppliquee) {
            newPaiement.promotionAppliquee = location.promotionAppliquee;
            newPaiement.montantRemise = location.montantRemise || 0;
        }
        
        // Sauvegarder le paiement
        await window.saveToFirebase('paiements', newPaiement);
        
        // Créer la transaction associée
        const methodDetails = window.getPaymentMethodDetails(data.methode.toLowerCase());
        
        // Préparer les notes
        let notes = `${mois} mois - ${location.nomClient}`;
        if (paiementsLocation.length === 0) {
            if (location.fraisActivation > 0) {
                notes += ` - Inclut frais activation: ${window.formatCurrency(location.fraisActivation)}`;
            }
            if (location.promotionAppliquee) {
                notes += ` - Promo: ${location.promotionAppliquee}`;
            }
        }
        
        const transaction = {
            id: window.generateId('TXN', window.appData.transactions || []),
            type: 'revenu',
            description: `Paiement location ${data.locationId}`,
            categorie: 'Location GPS',
            montant: montant,
            methode: methodDetails ? methodDetails.name : data.methode,
            date: data.datePaiement || window.getCurrentDate(),
            paiementId: newPaiement.id,
            locationId: data.locationId,
            clientId: location.clientId,
            notes: notes,
            createdAt: new Date().toISOString()
        };
        
        await window.saveToFirebase('transactions', transaction);
        
        window.closeModal('paiementModal');
        window.showAlert('Paiement enregistré avec succès', 'success');
        
        // Mettre à jour aussi le module Locations si nécessaire
        if (typeof renderLocationsTable === 'function') {
            renderLocationsTable();
        }
        if (typeof renderMobileLocations === 'function') {
            renderMobileLocations();
        }
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du paiement:', error);
        window.showAlert('Erreur lors de la sauvegarde du paiement', 'error');
    } finally {
        // Réactiver le bouton
        const submitBtn = document.getElementById('paiementSubmitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Enregistrer';
    }
}

function showPaiementDetails(paiementId) {
    const paiement = window.appData.paiements.find(p => p.id === paiementId);
    if (!paiement) return;
    
    const location = window.appData.locations.find(l => l.id === paiement.locationId);
    const client = window.appData.clients.find(c => c.id === paiement.clientId);
    
    const details = `
        <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Détails du Paiement ${paiement.id}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-600">Client:</span>
                    <span class="font-medium ml-2">${paiement.nomClient}</span>
                </div>
                <div>
                    <span class="text-gray-600">Location:</span>
                    <span class="font-medium ml-2">${paiement.locationId}</span>
                </div>
                <div>
                    <span class="text-gray-600">Montant:</span>
                    <span class="font-medium ml-2 text-green-600">${window.formatCurrency(paiement.montant)}</span>
                </div>
                <div>
                    <span class="text-gray-600">Méthode:</span>
                    <span class="font-medium ml-2">${paiement.methode}</span>
                </div>
                <div>
                    <span class="text-gray-600">Date:</span>
                    <span class="font-medium ml-2">${window.formatDate(paiement.datePaiement)}</span>
                </div>
                ${paiement.mois ? `
                    <div>
                        <span class="text-gray-600">Période:</span>
                        <span class="font-medium ml-2">${paiement.mois} mois</span>
                    </div>
                ` : ''}
                ${paiement.payeJusquau ? `
                    <div>
                        <span class="text-gray-600">Payé jusqu'au:</span>
                        <span class="font-medium ml-2">${window.formatDate(paiement.payeJusquau)}</span>
                    </div>
                ` : ''}
                ${paiement.promotionAppliquee ? `
                    <div>
                        <span class="text-gray-600">Promotion:</span>
                        <span class="font-medium ml-2 text-green-600">${paiement.promotionAppliquee}</span>
                    </div>
                ` : ''}
                ${paiement.montantRemise ? `
                    <div>
                        <span class="text-gray-600">Remise:</span>
                        <span class="font-medium ml-2 text-green-600">${window.formatCurrency(paiement.montantRemise)}</span>
                    </div>
                ` : ''}
            </div>
            ${paiement.commentaire ? `
                <div class="mt-3 pt-3 border-t">
                    <span class="text-gray-600">Commentaire:</span>
                    <p class="mt-1 text-sm text-gray-900">${paiement.commentaire}</p>
                </div>
            ` : ''}
            ${location ? `
                <div class="mt-3 pt-3 border-t bg-gray-50 p-3 rounded">
                    <h5 class="font-medium text-gray-900 mb-2">Informations Location</h5>
                    <div class="text-sm text-gray-600 space-y-1">
                        <div>Tarif mensuel: <strong>${window.formatCurrency(location.tarif)}</strong></div>
                        <div>Début location: <strong>${window.formatDate(location.dateDebut)}</strong></div>
                        <div>GPS: <strong>${location.gpsId}</strong></div>
                        ${location.promotionAppliquee ? `<div>Promotion active: <strong>${location.promotionAppliquee}</strong></div>` : ''}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // Afficher dans une alerte ou modal simple
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    alertDiv.onclick = () => alertDiv.remove();
    
    alertDiv.innerHTML = `
        <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
            ${details}
            <div class="flex justify-end mt-4">
                <button onclick="this.closest('.fixed').remove()" class="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                    Fermer
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
}

async function deletePaiement(paiementId) {
   const paiement = window.appData.paiements.find(p => p.id === paiementId);
   if (!paiement) return;
   
   if (confirm(`Êtes-vous sûr de vouloir supprimer le paiement de ${window.formatCurrency(paiement.montant)} de ${paiement.nomClient} ?\n\nNote: La transaction associée sera conservée dans l'historique.`)) {
       try {
           window.showAlert('Suppression en cours...', 'info');
           
           // Supprimer seulement le paiement de Firebase
           await window.deleteFromFirebase('paiements', paiementId);
           
           // Note: La transaction associée reste dans l'historique pour la traçabilité
          
          window.showAlert('Paiement supprimé avec succès', 'success');
          
      } catch (error) {
          console.error('Erreur lors de la suppression du paiement:', error);
          window.showAlert('Erreur lors de la suppression du paiement', 'error');
      }
  }
}

function showCaisseMovements() {
  // Créer la liste des mouvements depuis les transactions
  const movements = window.appData.transactions.map(t => ({
      type: t.type === 'revenu' ? 'entrée' : 'sortie',
      description: t.description,
      montant: t.montant,
      date: t.date,
      methode: t.methode,
      categorie: t.categorie,
      id: t.id
  }));
  
  // Trier par date décroissante
  movements.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Calculer les totaux par méthode
  const totalsHtml = window.getAvailablePaymentMethods().map(method => {
      const balance = window.getPaymentMethodBalance(method.id);
      return `
          <div class="text-center">
              <p class="text-gray-600">${method.name}</p>
              <p class="font-bold text-${method.color}-600">${window.formatCurrency(balance)}</p>
          </div>
      `;
  }).join('');
  
  const content = `
      <div class="space-y-4">
          <!-- Résumé -->
          <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-3">Résumé des Soldes</h4>
              <div class="grid grid-cols-${window.getAvailablePaymentMethods().length + 1} gap-4 text-sm">
                  ${totalsHtml}
                  <div class="text-center">
                      <p class="text-gray-600">Total</p>
                      <p class="font-bold text-gray-900">${window.formatCurrency(window.appData.caisse.total)}</p>
                  </div>
              </div>
          </div>
          
          <!-- Mouvements -->
          <div>
              <h4 class="font-medium text-gray-900 mb-3">Derniers Mouvements (${movements.length})</h4>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                  ${movements.slice(0, 50).map(mov => `
                      <div class="flex justify-between items-center p-3 bg-white border rounded-lg">
                          <div class="flex items-center">
                              <div class="p-2 rounded-full ${mov.type === 'entrée' ? 'bg-green-100' : 'bg-red-100'} mr-3">
                                  <i class="fas fa-${mov.type === 'entrée' ? 'arrow-down' : 'arrow-up'} text-${mov.type === 'entrée' ? 'green' : 'red'}-600"></i>
                              </div>
                              <div>
                                  <p class="text-sm font-medium text-gray-900">${mov.description}</p>
                                  <p class="text-xs text-gray-500">${window.formatDate(mov.date)} - ${mov.methode} - ${mov.categorie}</p>
                              </div>
                          </div>
                          <div class="text-right">
                              <p class="text-sm font-bold ${mov.type === 'entrée' ? 'text-green-600' : 'text-red-600'}">
                                  ${mov.type === 'entrée' ? '+' : '-'}${window.formatCurrency(mov.montant)}
                              </p>
                          </div>
                      </div>
                  `).join('')}
              </div>
          </div>
      </div>
  `;
  
  document.getElementById('caisseMovementsContent').innerHTML = content;
  window.openModal('caisseMovementsModal');
}

function exportPaiements() {
  try {
      // Préparer les données pour l'export
      const exportData = window.appData.paiements.map(p => ({
          'ID Paiement': p.id,
          'Date': p.datePaiement,
          'Client': p.nomClient,
          'Location': p.locationId,
          'Montant': p.montant,
          'Méthode': p.methode,
          'Mois': p.mois || 1,
          'Payé jusqu\'au': p.payeJusquau || '',
          'Promotion': p.promotionAppliquee || '',
          'Remise': p.montantRemise || 0,
          'Commentaire': p.commentaire || ''
      }));
      
      // Convertir en CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
          headers.join(','),
          ...exportData.map(row => 
              headers.map(header => 
                  `"${row[header] || ''}"`
              ).join(',')
          )
      ].join('\n');
      
      // Télécharger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `paiements-${window.getCurrentDate()}.csv`;
      link.click();
      
      window.showAlert('Export des paiements réussi', 'success');
      
  } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      window.showAlert('Erreur lors de l\'export', 'error');
  }
}

function filterPaiements() {
  renderPaiementsTable();
  renderMobilePaiements();
}

function resetPaiementFilters() {
  document.getElementById('filterMethode').value = '';
  document.getElementById('filterClientPaiement').value = '';
  document.getElementById('filterPeriode').value = '';
  renderPaiementsTable();
  renderMobilePaiements();
}

// Ajouter les fonctions Firebase dans app.js si pas déjà présentes
if (typeof window.savePaiementToFirebase === 'undefined') {
  window.savePaiementToFirebase = async function(paiement) {
      return await window.saveToFirebase('paiements', paiement);
  };
}

if (typeof window.deletePaiementFromFirebase === 'undefined') {
  window.deletePaiementFromFirebase = async function(paiementId) {
      return await window.deleteFromFirebase('paiements', paiementId);
  };
}