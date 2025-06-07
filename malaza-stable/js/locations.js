// Module Locations - Version Firebase avec Frais et Promotions
console.log('Module Locations chargé - Version Firebase avec Phase 2.1');

// Variables globales pour les promotions
let currentPromotion = null;
let firstPaymentDetails = {
    tarif: 0,
    fraisActivation: 5000,
    remisePromo: 0,
    premierMoisGratuit: false,
    total: 5000
};

function getLocationsHTML() {
    return `
        <div class="space-y-6 fade-in">
            <!-- En-tête -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Locations</h1>
                    <p class="text-gray-600 text-sm sm:text-base">Gérez les locations GPS de vos clients</p>
                </div>
                <button onclick="openLocationModal()" class="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    <i class="fas fa-plus mr-1 sm:mr-2"></i>
                    <span class="hidden sm:inline">Nouvelle</span> Location
                </button>
            </div>

            <!-- Statistiques Locations -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 rounded-full">
                            <i class="fas fa-map-pin text-blue-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Total</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="totalLocations">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-full">
                            <i class="fas fa-play-circle text-green-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">En Cours</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="locationsEnCours">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-100 rounded-full">
                            <i class="fas fa-stop-circle text-gray-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Terminées</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="locationsTerminees">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-purple-100 rounded-full">
                            <i class="fas fa-money-bill-wave text-purple-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">CA Mensuel</p>
                            <p class="text-sm sm:text-lg font-bold text-gray-900" id="caMensuel">0 Ar</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtres (Mobile-optimized) -->
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-center">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Client:</label>
                        <select id="filterClientLocation" onchange="filterLocations()" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <option value="">Tous</option>
                            <!-- Options générées dynamiquement -->
                        </select>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Paiement:</label>
                        <select id="filterPaiementStatus" onchange="filterLocations()" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <option value="">Tous</option>
                            <option value="ok">À jour (vert)</option>
                            <option value="attention">Attention (jaune)</option>
                            <option value="retard">En retard (rouge)</option>
                        </select>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Statut:</label>
                        <select id="filterStatutLocation" onchange="filterLocations()" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <option value="">Tous</option>
                            <option value="en cours">En cours</option>
                            <option value="terminée">Terminée</option>
                        </select>
                    </div>
                    <button onclick="resetLocationFilters()" class="text-blue-600 hover:text-blue-800 text-sm self-start sm:self-auto">
                        <i class="fas fa-undo mr-1"></i>
                        Réinitialiser
                    </button>
                </div>
            </div>

            <!-- Desktop Table (Hidden on mobile) -->
            <div class="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Liste des Locations</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPS/SIM</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarif</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin Forfait</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="locationsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Contenu généré dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Cards (Hidden on desktop) -->
            <div class="lg:hidden">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Locations</h3>
                    <span class="text-sm text-gray-500" id="mobileLocationsCount">0 locations</span>
                </div>
                <div id="mobileLocationsContainer" class="space-y-3">
                    <!-- Mobile cards générées dynamiquement -->
                </div>
            </div>
        </div>

        <!-- Modal Nouvelle Location - Responsive -->
        <div id="locationModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Nouvelle Location</h3>
                    <button onclick="closeModal('locationModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="locationForm">
                    <input type="hidden" id="locationOriginalId" name="originalId">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ID Location *</label>
                            <input type="text" name="id" id="locationId" required class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: BAJAJ 6117MD">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                            <select name="clientId" id="locationClientId" required class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner un client</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">GPS *</label>
                            <select name="gpsId" id="locationGpsId" required class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner un GPS</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Carte SIM *</label>
                            <select name="simId" id="locationSimId" required class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner une SIM</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">La SIM doit avoir un forfait actif pour que le GPS fonctionne</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tarif mensuel (Ar) *</label>
                            <input type="number" name="tarif" id="locationTarif" required min="0" class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 45000">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
                            <input type="date" name="dateDebut" id="locationDateDebut" required class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <!-- Section Frais et Promotions -->
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                            <h4 class="font-medium text-gray-900 flex items-center">
                                <i class="fas fa-tags mr-2 text-blue-600"></i>
                                Frais et Promotions
                            </h4>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Frais d'activation (Ar)</label>
                                <input 
                                    type="number" 
                                    name="fraisActivation" 
                                    id="locationFraisActivation" 
                                    value="5000"
                                    min="0"
                                    class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500" 
                                    onchange="calculateFirstPayment()"
                                    oninput="calculateFirstPayment()"
                                >
                            </div>
                            
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        name="fraisActivationGratuit" 
                                        id="locationFraisGratuit"
                                        class="mr-2"
                                        onchange="handleFraisGratuit()"
                                    >
                                    <span class="text-sm">Frais d'activation gratuits</span>
                                </label>
                                
                                <label class="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        name="premierMoisGratuit" 
                                        id="locationPremierMoisGratuit"
                                        class="mr-2"
                                        onchange="calculateFirstPayment()"
                                    >
                                    <span class="text-sm">Premier mois gratuit</span>
                                </label>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Code promotion</label>
                                <div class="flex space-x-2">
                                    <input 
                                        type="text" 
                                        name="promotionCode" 
                                        id="locationPromotionCode"
                                        class="flex-1 p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Ex: NOEL2024"
                                    >
                                    <button 
                                        type="button" 
                                        onclick="applyPromotion()" 
                                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Appliquer
                                    </button>
                                </div>
                                <div id="promotionMessage" class="text-sm mt-1"></div>
                            </div>
                            
                            <!-- Résumé du premier paiement -->
                            <div class="bg-white rounded p-3 border border-gray-200">
                                <h5 class="font-medium text-gray-900 mb-2">Premier paiement</h5>
                                <div id="firstPaymentSummary" class="space-y-1 text-sm">
                                    <!-- Contenu généré dynamiquement -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div class="flex items-start">
                                <i class="fas fa-info-circle text-blue-600 mr-2 mt-0.5"></i>
                                <div class="text-sm text-blue-800">
                                    <p class="font-medium">Lors de la création :</p>
                                    <ul class="mt-1 space-y-1 text-xs">
                                        <li>• Le GPS sera marqué comme "Loué"</li>
                                        <li>• La SIM sera liée à cette location</li>
                                        <li>• Le statut sera "en cours"</li>
                                        <li>• La location continuera jusqu'à résiliation manuelle</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                            <button type="submit" class="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium" id="locationSubmitBtn">Créer Location</button>
                            <button type="button" onclick="closeModal('locationModal')" class="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-base font-medium">Annuler</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}

async function initLocations() {
    console.log('Initialisation du module Locations avec Firebase');
    populateLocationFilters();
    renderLocationsTable();
    renderMobileLocations();
    updateLocationsStats();
    setupLocationForm();
    
    // Écouter les changements en temps réel
    listenToLocationsChanges();
}

// Écouter les changements en temps réel depuis Firebase
function listenToLocationsChanges() {
    if (!window.firebaseDB) {
        console.error('Firebase DB non initialisé');
        setTimeout(() => {
            listenToLocationsChanges();
        }, 1000);
        return;
    }
    
    // Écouter les changements sur la collection locations
    window.firebaseDB.collection('locations').onSnapshot((snapshot) => {
        console.log('Changements détectés dans les locations');
        
        // Mettre à jour le cache local
        window.appData.locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Rafraîchir l'affichage
        renderLocationsTable();
        renderMobileLocations();
        updateLocationsStats();
        populateLocationFilters();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements locations:', error);
    });
}

function populateLocationFilters() {
    // Filtre clients
    const clientFilter = document.getElementById('filterClientLocation');
    if (clientFilter) {
        clientFilter.innerHTML = '<option value="">Tous</option>';
        window.appData.clients.forEach(client => {
            clientFilter.innerHTML += `<option value="${client.id}">${client.nom}</option>`;
        });
    }
}

function setupLocationForm() {
    const form = document.getElementById('locationForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            await handleLocationSubmit(data);
        });
    }
    populateLocationSelects();
}

function populateLocationSelects() {
    // Clients
    const clientSelect = document.getElementById('locationClientId');
    if (clientSelect) {
        clientSelect.innerHTML = '<option value="">Sélectionner un client</option>';
        window.appData.clients.forEach(client => {
            clientSelect.innerHTML += `<option value="${client.id}">${client.nom}</option>`;
        });
    }
    
    // GPS disponibles
    const gpsSelect = document.getElementById('locationGpsId');
    if (gpsSelect) {
        gpsSelect.innerHTML = '<option value="">Sélectionner un GPS</option>';
        window.appData.gps.filter(gps => gps.statut === 'Disponible').forEach(gps => {
            gpsSelect.innerHTML += `<option value="${gps.id}">${gps.id} - ${gps.modele} (${gps.imei})</option>`;
        });
    }
    
    // SIM disponibles
    const simSelect = document.getElementById('locationSimId');
    if (simSelect) {
        simSelect.innerHTML = '<option value="">Sélectionner une SIM</option>';
        const simsInUse = window.appData.locations.filter(l => l.statut === 'en cours' && l.simId).map(l => l.simId);
        const availableSims = window.appData.sim.filter(sim => !simsInUse.includes(sim.id));
        
        availableSims.forEach(sim => {
            const simStatus = getSimStatus(sim);
            const daysLeft = sim.dateExpiration ? window.getDaysUntilExpiry(sim.dateExpiration) : null;
            let statusText = '';
            if (simStatus === 'Active' && daysLeft !== null) {
                statusText = ` (${daysLeft}j restants)`;
            } else if (simStatus === 'Inactive') {
                statusText = ' (Inactif)';
            } else if (simStatus === 'Expirée') {
                statusText = ' (Expirée)';
            }
            simSelect.innerHTML += `<option value="${sim.id}">${sim.id} - ${sim.operateur}${statusText}</option>`;
        });
    }
}

// Fonctions pour gérer les frais et promotions
function handleFraisGratuit() {
    const checkbox = document.getElementById('locationFraisGratuit');
    const fraisInput = document.getElementById('locationFraisActivation');
    
    if (checkbox.checked) {
        fraisInput.value = 0;
        fraisInput.disabled = true;
    } else {
        fraisInput.value = 5000;
        fraisInput.disabled = false;
    }
    
 // REMPLACER la fonction calculateFirstPayment() 
function calculateFirstPayment() {
    const tarif = parseInt(document.getElementById('locationTarif').value) || 0;
    const fraisActivation = parseInt(document.getElementById('locationFraisActivation').value) || 0;
    const premierMoisGratuit = document.getElementById('locationPremierMoisGratuit').checked;
    
    // Calculer le montant de base pour la promotion
    let montantPourPromo = fraisActivation;
    if (!premierMoisGratuit) {
        montantPourPromo += tarif;
    }
    
    firstPaymentDetails = {
        tarif: tarif,
        fraisActivation: fraisActivation,
        remisePromo: currentPromotion ? calculatePromotionDiscount(montantPourPromo) : 0,
        premierMoisGratuit: premierMoisGratuit,
        total: 0
    };
    
    // Calculer le total
    let total = fraisActivation;
    
    // Si le premier mois n'est PAS gratuit, on ajoute le tarif
    if (!premierMoisGratuit) {
        total += tarif;
    }
    
    // Appliquer la remise promotion
    total -= firstPaymentDetails.remisePromo;
    
    // S'assurer que le total n'est pas négatif
    firstPaymentDetails.total = Math.max(0, total);
    
    // Afficher le résumé
    updateFirstPaymentSummary();
}

// La fonction calculatePromotionDiscount reste la même
function calculatePromotionDiscount(baseAmount) {
    if (!currentPromotion) return 0;
    
    if (currentPromotion.type === 'pourcentage') {
        return Math.round(baseAmount * currentPromotion.valeur / 100);
    } else {
        return Math.min(currentPromotion.valeur, baseAmount);
    }
}

// Améliorer updateFirstPaymentSummary pour plus de clarté
function updateFirstPaymentSummary() {
    const summary = document.getElementById('firstPaymentSummary');
    if (!summary) return;
    
    let html = '';
    
    // Afficher les frais d'activation
    if (firstPaymentDetails.fraisActivation > 0) {
        html += `<div class="flex justify-between">
            <span class="text-gray-600">Frais d'activation:</span>
            <span>${window.formatCurrency(firstPaymentDetails.fraisActivation)}</span>
        </div>`;
    } else if (document.getElementById('locationFraisGratuit').checked) {
        html += `<div class="flex justify-between text-green-600">
            <span>Frais d'activation:</span>
            <span>GRATUIT</span>
        </div>`;
    }
    
    // Afficher le premier mois
    if (!firstPaymentDetails.premierMoisGratuit && firstPaymentDetails.tarif > 0) {
        html += `<div class="flex justify-between">
            <span class="text-gray-600">Premier mois:</span>
            <span>${window.formatCurrency(firstPaymentDetails.tarif)}</span>
        </div>`;
    } else if (firstPaymentDetails.premierMoisGratuit) {
        html += `<div class="flex justify-between text-green-600">
            <span>Premier mois:</span>
            <span>GRATUIT (à payer à partir du 2ème mois)</span>
        </div>`;
    }
    
    // Afficher la promotion si applicable
    if (firstPaymentDetails.remisePromo > 0) {
        let montantAvantRemise = firstPaymentDetails.fraisActivation;
        if (!firstPaymentDetails.premierMoisGratuit) {
            montantAvantRemise += firstPaymentDetails.tarif;
        }
        
        html += `<div class="flex justify-between text-green-600">
            <span>Remise promotion ${currentPromotion.code}:</span>
            <span>-${window.formatCurrency(firstPaymentDetails.remisePromo)}</span>
        </div>`;
    }
    
    // Total avec séparateur
    html += `<div class="flex justify-between border-t pt-1 font-bold">
        <span>Total à payer maintenant:</span>
        <span class="text-lg ${firstPaymentDetails.total === 0 ? 'text-green-600' : ''}">${window.formatCurrency(firstPaymentDetails.total)}</span>
    </div>`;
    
    // Message d'information si premier mois gratuit
    if (firstPaymentDetails.premierMoisGratuit && firstPaymentDetails.total === 0) {
        html += `<div class="mt-2 text-xs text-gray-600 italic">
            <i class="fas fa-info-circle mr-1"></i>
            Aucun paiement requis aujourd'hui. Le premier paiement de ${window.formatCurrency(firstPaymentDetails.tarif)} sera dû dans 1 mois.
        </div>`;
    }
    
    summary.innerHTML = html;
}

// La fonction applyPromotion reste la même
async function applyPromotion() {
    const codeInput = document.getElementById('locationPromotionCode');
    const messageDiv = document.getElementById('promotionMessage');
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        messageDiv.innerHTML = '<span class="text-red-600">Veuillez entrer un code promotion</span>';
        return;
    }
    
    try {
        // Vérifier si la promotion existe
        const promotionsSnapshot = await window.firebaseDB.collection('promotions')
            .where('code', '==', code)
            .get();
        
        if (promotionsSnapshot.empty) {
            messageDiv.innerHTML = '<span class="text-red-600">Code promotion invalide</span>';
            currentPromotion = null;
            calculateFirstPayment();
            return;
        }
        
        const promotion = promotionsSnapshot.docs[0].data();
        const today = new Date();
        const dateDebut = new Date(promotion.dateDebut);
        const dateFin = new Date(promotion.dateFin);
        
        // Vérifier la validité
        if (today < dateDebut || today > dateFin) {
            messageDiv.innerHTML = '<span class="text-orange-600">Cette promotion a expiré</span>';
            currentPromotion = null;
            calculateFirstPayment();
            return;
        }
        
        if (promotion.usageMax && promotion.usageActuel >= promotion.usageMax) {
            messageDiv.innerHTML = '<span class="text-orange-600">Cette promotion n\'est plus disponible</span>';
            currentPromotion = null;
            calculateFirstPayment();
            return;
        }
        
        // Promotion valide
        currentPromotion = promotion;
        messageDiv.innerHTML = `<span class="text-green-600">
            <i class="fas fa-check-circle mr-1"></i>
            ${promotion.description} appliquée !
        </span>`;
        
        calculateFirstPayment();
        
    } catch (error) {
        console.error('Erreur lors de la vérification de la promotion:', error);
        messageDiv.innerHTML = '<span class="text-red-600">Erreur lors de la vérification</span>';
    }
}
// Ajouter les listeners au chargement du formulaire
function enhanceLocationForm() {
    const tarifInput = document.getElementById('locationTarif');
    if (tarifInput) {
        tarifInput.addEventListener('input', calculateFirstPayment);
        tarifInput.addEventListener('change', calculateFirstPayment);
    }
    
    // Calculer au chargement
    calculateFirstPayment();
}

function renderLocationsTable() {
    const tbody = document.getElementById('locationsTableBody');
    if (!tbody) {
        console.log('Element locationsTableBody non trouvé (normal sur mobile)');
        return;
    }
    
    let locationsToShow = [...window.appData.locations];
    
    // Appliquer les filtres
    const filterClient = document.getElementById('filterClientLocation')?.value;
    const filterPaiementStatus = document.getElementById('filterPaiementStatus')?.value;
    const filterStatut = document.getElementById('filterStatutLocation')?.value;
    
    if (filterClient) {
        locationsToShow = locationsToShow.filter(l => l.clientId === filterClient);
    }
    
    if (filterStatut) {
        locationsToShow = locationsToShow.filter(l => l.statut === filterStatut);
    }
    
    if (locationsToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="px-6 py-8 text-center text-gray-500"><i class="fas fa-map-pin text-4xl mb-2"></i><p>Aucune location trouvée</p></td></tr>';
        return;
    }
    
    tbody.innerHTML = locationsToShow.map(location => {
        const statusClass = location.statut === 'en cours' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        const statusIcon = location.statut === 'en cours' ? 'play-circle' : 'stop-circle';
        
        // Calculer les jours depuis le début
        const dateDebut = new Date(location.dateDebut);
        const today = new Date();
        const diffDays = Math.ceil((today - dateDebut) / (1000 * 60 * 60 * 24));
        
        // Récupérer les infos de la SIM
        const sim = window.appData.sim.find(s => s.id === location.simId);
        let simExpiryInfo = '<span class="text-gray-400">-</span>';
        if (sim && sim.dateExpiration) {
            const daysLeft = window.getDaysUntilExpiry(sim.dateExpiration);
            if (daysLeft !== null) {
                if (daysLeft <= 0) {
                    simExpiryInfo = `<span class="text-red-600 font-bold"><i class="fas fa-times-circle mr-1"></i>Expiré</span>`;
                } else if (daysLeft <= 3) {
                    simExpiryInfo = `<span class="text-red-600 font-bold"><i class="fas fa-exclamation-circle mr-1"></i>${daysLeft}j restants</span>`;
                } else if (daysLeft <= 7) {
                    simExpiryInfo = `<span class="text-orange-600 font-bold"><i class="fas fa-exclamation-triangle mr-1"></i>${daysLeft}j restants</span>`;
                } else if (daysLeft <= 15) {
                    simExpiryInfo = `<span class="text-yellow-600"><i class="fas fa-clock mr-1"></i>${daysLeft}j restants</span>`;
                } else {
                    simExpiryInfo = `<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>${daysLeft}j restants</span>`;
                }
            }
        } else {
            simExpiryInfo = '<span class="text-red-500"><i class="fas fa-times mr-1"></i>Pas de forfait</span>';
        }
        
        // Calculer l'état du paiement
        const dernierPaiement = window.appData.paiements
            .filter(p => p.locationId === location.id)
            .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))[0];
        
        let paiementInfo = '';
        let paiementStatus = '';
        
        if (!dernierPaiement) {
            // Pas de paiement, on calcule depuis le début de la location
            const daysSinceStart = Math.floor((today - dateDebut) / (1000 * 60 * 60 * 24));
            
            if (daysSinceStart <= 0) {
                // Location commence aujourd'hui ou dans le futur
                paiementInfo = `<span class="text-gray-500"><i class="fas fa-hourglass-start mr-1"></i>Nouveau</span>`;
                paiementStatus = 'ok';
            } else if (daysSinceStart > 30) {
                paiementInfo = `<span class="text-red-600 font-bold"><i class="fas fa-exclamation-circle mr-1"></i>En retard ${daysSinceStart}j</span>`;
                paiementStatus = 'retard';
            } else if (daysSinceStart > 20) {
                paiementInfo = `<span class="text-yellow-600 font-bold"><i class="fas fa-exclamation-triangle mr-1"></i>À payer ${daysSinceStart}j</span>`;
                paiementStatus = 'attention';
            } else {
                paiementInfo = `<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>${30 - daysSinceStart}j restants</span>`;
                paiementStatus = 'ok';
            }
        } else {
            // Il y a eu au moins un paiement
            const lastPaymentDate = new Date(dernierPaiement.datePaiement);
            const coveredUntil = dernierPaiement.payeJusquau ? new Date(dernierPaiement.payeJusquau) : null;
            
            if (coveredUntil && coveredUntil >= today) {
                // Payé à l'avance
                const daysRemaining = Math.ceil((coveredUntil - today) / (1000 * 60 * 60 * 24));
                paiementInfo = `<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>${daysRemaining}j restants</span>`;
                paiementStatus = 'ok';
            } else {
                // Calculer depuis la fin de la période couverte ou le dernier paiement
                const referenceDate = coveredUntil || lastPaymentDate;
                const daysSincePayment = Math.floor((today - referenceDate) / (1000 * 60 * 60 * 24));
                
                if (daysSincePayment > 30) {
                    paiementInfo = `<span class="text-red-600 font-bold"><i class="fas fa-exclamation-circle mr-1"></i>En retard ${daysSincePayment}j</span>`;
                    paiementStatus = 'retard';
                } else if (daysSincePayment > 0) {
                    paiementInfo = `<span class="text-yellow-600 font-bold"><i class="fas fa-exclamation-triangle mr-1"></i>À payer ${daysSincePayment}j</span>`;
                    paiementStatus = 'attention';
                } else {
                    paiementInfo = `<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>À jour</span>`;
                    paiementStatus = 'ok';
                }
            }
        }
        
        // Ajouter l'attribut pour le filtrage
        location.paiementStatus = paiementStatus;
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <i class="fas fa-map-pin text-purple-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${location.id}</div>
                            <div class="text-sm text-gray-500">Depuis ${diffDays}j</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${location.nomClient}</div>
                    <div class="text-sm text-gray-500">${location.clientId}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${location.gpsId}</div>
                    ${location.simId ? `<div class="text-xs text-indigo-600 mt-1"><i class="fas fa-sim-card mr-1"></i>${location.simId}</div>` : '<div class="text-xs text-red-500 mt-1"><i class="fas fa-exclamation-triangle mr-1"></i>Pas de SIM</div>'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${window.formatCurrency(location.tarif)}</div>
                    <div class="text-sm text-gray-500">par mois</div>
                    ${location.promotionAppliquee ? `
                        <div class="text-xs text-green-600 mt-1">
                            <i class="fas fa-tag mr-1"></i>${location.promotionAppliquee}
                        </div>
                    ` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>${window.formatDate(location.dateDebut)}</div>
                    <div class="text-xs text-gray-400">En cours</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    ${simExpiryInfo}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    ${paiementInfo}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                        <i class="fas fa-${statusIcon} mr-1"></i>${location.statut}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex space-x-2">
                        ${location.statut === 'en cours' ? `
                            <button onclick="terminerLocation('${location.id}')" class="text-orange-600 hover:text-orange-900" title="Terminer">
                                <i class="fas fa-stop-circle"></i>
                            </button>
                        ` : ''}
                        <button onclick="editLocation('${location.id}')" class="text-yellow-600 hover:text-yellow-900" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteLocation('${location.id}')" class="text-red-600 hover:text-red-900" title="Supprimer">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).filter((html, index) => {
        // Filtrer par statut de paiement après le calcul
        if (filterPaiementStatus) {
            const location = locationsToShow[index];
            return location.paiementStatus === filterPaiementStatus;
        }
        return true;
    }).join('');
}

function renderMobileLocations() {
    const container = document.getElementById('mobileLocationsContainer');
    const countElement = document.getElementById('mobileLocationsCount');
    
    if (!container) {
        console.log('Element mobileLocationsContainer non trouvé (normal sur desktop)');
        return;
    }
    
    let locationsToShow = [...window.appData.locations];
    
    // Appliquer les filtres
    const filterClient = document.getElementById('filterClientLocation')?.value;
    const filterPaiementStatus = document.getElementById('filterPaiementStatus')?.value;
    const filterStatut = document.getElementById('filterStatutLocation')?.value;
    
    if (filterClient) {
        locationsToShow = locationsToShow.filter(l => l.clientId === filterClient);
    }
    
    if (filterStatut) {
        locationsToShow = locationsToShow.filter(l => l.statut === filterStatut);
    }
    
    // Mettre à jour le compteur
    if (countElement) {
        countElement.textContent = `${locationsToShow.length} location${locationsToShow.length > 1 ? 's' : ''}`;
    }
    
    if (locationsToShow.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-lg">
                <i class="fas fa-map-pin text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 mb-4">Aucune location trouvée</p>
                <button onclick="openLocationModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <i class="fas fa-plus mr-2"></i>
                    Nouvelle location
                </button>
            </div>
        `;
        return;
    }
    
    // Calculer les statuts de paiement d'abord
    locationsToShow.forEach(location => {
        const today = new Date();
        const dateDebut = new Date(location.dateDebut);
        const dernierPaiement = window.appData.paiements
            .filter(p => p.locationId === location.id)
            .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))[0];
        
        if (!dernierPaiement) {
            const daysSinceStart = Math.floor((today - dateDebut) / (1000 * 60 * 60 * 24));
            if (daysSinceStart <= 0) {
                location.paiementStatus = 'ok';
            } else if (daysSinceStart > 30) {
                location.paiementStatus = 'retard';
            } else if (daysSinceStart > 20) {
                location.paiementStatus = 'attention';
            } else {
                location.paiementStatus = 'ok';
            }
        } else {
            const coveredUntil = dernierPaiement.payeJusquau ? new Date(dernierPaiement.payeJusquau) : null;
            if (coveredUntil && coveredUntil >= today) {
                location.paiementStatus = 'ok';
            } else {
                const referenceDate = coveredUntil || new Date(dernierPaiement.datePaiement);
                const daysSincePayment = Math.floor((today - referenceDate) / (1000 * 60 * 60 * 24));
                if (daysSincePayment > 30) {
                    location.paiementStatus = 'retard';
                } else if (daysSincePayment > 0) {
                    location.paiementStatus = 'attention';
                } else {
                    location.paiementStatus = 'ok';
                }
            }
        }
    });
    
    // Appliquer le filtre de paiement si nécessaire
    if (filterPaiementStatus) {
        locationsToShow = locationsToShow.filter(l => l.paiementStatus === filterPaiementStatus);
    }
    
    container.innerHTML = locationsToShow.map(location => {
        const statusClass = location.statut === 'en cours' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        const statusIcon = location.statut === 'en cours' ? 'play-circle' : 'stop-circle';
        
        // Calculer les infos
        const dateDebut = new Date(location.dateDebut);
        const today = new Date();
        const diffDays = Math.ceil((today - dateDebut) / (1000 * 60 * 60 * 24));
        
        // Info SIM
        const sim = window.appData.sim.find(s => s.id === location.simId);
        let simInfo = null;
        if (sim && sim.dateExpiration) {
            const daysLeft = window.getDaysUntilExpiry(sim.dateExpiration);
            if (daysLeft !== null) {
                simInfo = {
                    days: daysLeft,
                    status: daysLeft <= 0 ? 'expired' : daysLeft <= 7 ? 'warning' : 'ok'
                };
            }
        }
        
        // Info Paiement
        const dernierPaiement = window.appData.paiements
            .filter(p => p.locationId === location.id)
            .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))[0];
        
        let paiementColor = 'green';
        let paiementIcon = 'check-circle';
        let paiementText = 'À jour';
        
        if (location.paiementStatus === 'retard') {
            paiementColor = 'red';
            paiementIcon = 'exclamation-circle';
            paiementText = 'En retard';
        } else if (location.paiementStatus === 'attention') {
            paiementColor = 'yellow';
            paiementIcon = 'exclamation-triangle';
            paiementText = 'À payer bientôt';
        }
        
        return `
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <!-- Header avec ID et statut -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <i class="fas fa-map-pin text-purple-600 text-lg"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 text-base">${location.id}</h3>
                            <p class="text-sm text-gray-500">Depuis ${diffDays} jours</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${statusClass}">
                        <i class="fas fa-${statusIcon} mr-1"></i>
                        ${location.statut}
                    </span>
                </div>
                
                <!-- Client et GPS -->
                <div class="grid grid-cols-2 gap-3 mb-3">
                    <div class="bg-gray-50 p-2 rounded">
                        <p class="text-xs text-gray-600 mb-1">Client</p>
                        <p class="text-sm font-medium text-gray-900">${location.nomClient}</p>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <p class="text-xs text-gray-600 mb-1">GPS</p>
                        <p class="text-sm font-medium text-gray-900">${location.gpsId}</p>
                    </div>
                </div>
                
                <!-- Infos importantes -->
                <div class="space-y-2 mb-3">
                    <div class="flex items-center text-sm">
                        <i class="fas fa-money-bill-wave text-green-500 w-5 mr-2"></i>
                        <span class="text-gray-900 font-medium">${window.formatCurrency(location.tarif)}/mois</span>
                        ${location.promotionAppliquee ? `
                            <span class="ml-2 text-xs text-green-600">
                                <i class="fas fa-tag mr-1"></i>${location.promotionAppliquee}
                            </span>
                        ` : ''}
                    </div>
                    
                    ${location.simId ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-sim-card text-indigo-500 w-5 mr-2"></i>
                            <span class="text-gray-900">${location.simId}</span>
                            ${simInfo ? `
                                <span class="ml-2 text-xs ${simInfo.status === 'expired' ? 'text-red-600' : simInfo.status === 'warning' ? 'text-orange-600' : 'text-green-600'} font-medium">
                                    (${simInfo.days <= 0 ? 'Expiré' : `${simInfo.days}j`})
                                </span>
                            ` : '<span class="ml-2 text-xs text-gray-500">(Pas de forfait)</span>'}
                        </div>
                    ` : `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-exclamation-triangle text-red-500 w-5 mr-2"></i>
                            <span class="text-red-600">Pas de SIM</span>
                        </div>
                    `}
                    
                    <div class="flex items-center text-sm">
                        <i class="fas fa-${paiementIcon} text-${paiementColor}-500 w-5 mr-2"></i>
                        <span class="text-${paiementColor}-700 font-medium">${paiementText}</span>
                    </div>
                    
                    <div class="flex items-center text-sm">
                        <i class="fas fa-calendar text-gray-400 w-5 mr-2"></i>
                        <span class="text-gray-600">Début: ${window.formatDate(location.dateDebut)}</span>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-2 pt-3 border-t">
                    ${location.statut === 'en cours' ? `
                        <button 
                            onclick="terminerLocation('${location.id}')" 
                            class="flex-1 bg-orange-50 text-orange-700 py-2 px-3 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
                        >
                            <i class="fas fa-stop-circle mr-2"></i>
                            Terminer
                        </button>
                    ` : ''}
                    <button 
                        onclick="editLocation('${location.id}')" 
                        class="flex-1 bg-yellow-50 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                    >
                        <i class="fas fa-edit mr-2"></i>
                        Modifier
                    </button>
                    ${location.paiementStatus === 'retard' || location.paiementStatus === 'attention' ? `
                        <button 
                            onclick="window.showModule('paiements'); setTimeout(() => { document.getElementById('paiementLocationId').value = '${location.id}'; updatePaiementInfo(); }, 100);" 
                            class="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                            <i class="fas fa-money-bill mr-2"></i>
                            Payer
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function updateLocationsStats() {
    const totalLocations = window.appData.locations.length;
    const locationsEnCours = window.appData.locations.filter(l => l.statut === 'en cours').length;
    const locationsTerminees = window.appData.locations.filter(l => l.statut === 'terminée').length;
    const caMensuel = window.appData.locations.filter(l => l.statut === 'en cours').reduce((sum, l) => sum + l.tarif, 0);
    
    const elements = {
        totalLocations: document.getElementById('totalLocations'),
        locationsEnCours: document.getElementById('locationsEnCours'),
        locationsTerminees: document.getElementById('locationsTerminees'),
        caMensuel: document.getElementById('caMensuel')
    };
    
    if (elements.totalLocations) elements.totalLocations.textContent = totalLocations;
    if (elements.locationsEnCours) elements.locationsEnCours.textContent = locationsEnCours;
    if (elements.locationsTerminees) elements.locationsTerminees.textContent = locationsTerminees;
    if (elements.caMensuel) elements.caMensuel.textContent = window.formatCurrency(caMensuel);
}

function openLocationModal(locationId = null) {
    populateLocationSelects();
    
    const modal = document.getElementById('locationModal');
    const title = modal.querySelector('h3');
    const submitBtn = document.getElementById('locationSubmitBtn');
    
    // Réinitialiser les variables
    currentPromotion = null;
    firstPaymentDetails = {
        tarif: 0,
        fraisActivation: 5000,
        remisePromo: 0,
        premierMoisGratuit: false,
        total: 5000
    };
    
    if (locationId) {
        // Mode modification
        const location = window.appData.locations.find(l => l.id === locationId);
        if (location) {
            title.textContent = 'Modifier Location';
            submitBtn.textContent = 'Modifier Location';
            
            document.getElementById('locationOriginalId').value = location.id;
            document.getElementById('locationId').value = location.id;
            document.getElementById('locationClientId').value = location.clientId;
            
            // Pour la modification, afficher tous les GPS (pas seulement les disponibles)
            const gpsSelect = document.getElementById('locationGpsId');
            if (gpsSelect) {
                gpsSelect.innerHTML = '<option value="">Sélectionner un GPS</option>';
                window.appData.gps.forEach(gps => {
                    const selected = gps.id === location.gpsId ? 'selected' : '';
                    const status = gps.statut === 'Disponible' ? '' : ` (${gps.statut})`;
                    gpsSelect.innerHTML += `<option value="${gps.id}" ${selected}>${gps.id} - ${gps.modele}${status}</option>`;
                });
            }
            
            document.getElementById('locationSimId').value = location.simId || '';
            document.getElementById('locationTarif').value = location.tarif;
            document.getElementById('locationDateDebut').value = location.dateDebut;
            
            // Charger les nouveaux champs
            if (location.fraisActivation !== undefined) {
                document.getElementById('locationFraisActivation').value = location.fraisActivation;
                document.getElementById('locationFraisGratuit').checked = location.fraisActivationGratuit;
                document.getElementById('locationPremierMoisGratuit').checked = location.premierMoisGratuit;
                
                if (location.fraisActivationGratuit) {
                    document.getElementById('locationFraisActivation').disabled = true;
                }
            }
        }
    } else {
        // Mode création
        title.textContent = 'Nouvelle Location';
        submitBtn.textContent = 'Créer Location';
        
        document.getElementById('locationForm').reset();
        document.getElementById('locationOriginalId').value = '';
        document.getElementById('locationDateDebut').value = window.getCurrentDate();
        document.getElementById('locationFraisActivation').value = 5000;
        document.getElementById('locationFraisActivation').disabled = false;
    }
    
    // Initialiser les calculs
    enhanceLocationForm();
    calculateFirstPayment();
    
    window.openModal('locationModal');
}

async function handleLocationSubmit(data) {
    if (!data.id || !data.clientId || !data.gpsId || !data.simId || !data.tarif || !data.dateDebut) {
        window.showAlert('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    const existingLocation = window.appData.locations.find(l => l.id === data.id && l.id !== data.originalId);
    if (existingLocation) {
        window.showAlert('Cet ID de location existe déjà', 'error');
        return;
    }
    
    const gps = window.appData.gps.find(g => g.id === data.gpsId);
    if (!gps) {
        window.showAlert('GPS introuvable', 'error');
        return;
    }
    
    if (!data.originalId && gps.statut !== 'Disponible') {
        window.showAlert('Ce GPS n\'est pas disponible', 'error');
        return;
    }
    
    const simInUse = window.appData.locations.find(l => l.simId === data.simId && l.statut === 'en cours' && l.id !== data.originalId);
    if (simInUse) {
        window.showAlert('Cette SIM est déjà utilisée dans une autre location', 'error');
        return;
    }
    
    try {
        const submitBtn = document.getElementById('locationSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enregistrement...';
        
        const client = window.appData.clients.find(c => c.id === data.clientId);
        const sim = window.appData.sim.find(s => s.id === data.simId);
        
        // Préparer les données de location avec les nouveaux champs
        const locationData = {
            id: data.id,
            clientId: data.clientId,
            nomClient: client ? client.nom : '',
            gpsId: data.gpsId,
            gpsModele: gps ? gps.modele : '',
            simId: data.simId,
            simStatut: sim ? getSimStatus(sim) : '',
            tarif: parseInt(data.tarif),
            dateDebut: data.dateDebut,
            statut: 'en cours',
            // Nouveaux champs
            fraisActivation: parseInt(data.fraisActivation) || 0,
            fraisActivationGratuit: data.fraisActivationGratuit === 'on',
            premierMoisGratuit: data.premierMoisGratuit === 'on',
            promotionAppliquee: currentPromotion ? currentPromotion.code : '',
            montantRemise: firstPaymentDetails.remisePromo || 0
        };
        
        if (data.originalId) {
            // Mode modification - conserver les valeurs existantes si pas de changement
            const oldLocation = window.appData.locations.find(l => l.id === data.originalId);
            
            if (oldLocation && oldLocation.gpsId !== data.gpsId) {
                const oldGps = window.appData.gps.find(g => g.id === oldLocation.gpsId);
                if (oldGps) {
                    oldGps.statut = 'Disponible';
                    await window.saveToFirebase('gps', oldGps);
                }
                gps.statut = 'Loué';
                await window.saveToFirebase('gps', gps);
            }
            
            if (oldLocation) {
                locationData.statut = oldLocation.statut;
                if (oldLocation.dateFin) {
                    locationData.dateFin = oldLocation.dateFin;
                }
                // Conserver les anciennes valeurs de frais si modification
                if (oldLocation.fraisActivation !== undefined) {
                    locationData.fraisActivation = oldLocation.fraisActivation;
                    locationData.fraisActivationGratuit = oldLocation.fraisActivationGratuit;
                    locationData.premierMoisGratuit = oldLocation.premierMoisGratuit;
                    locationData.promotionAppliquee = oldLocation.promotionAppliquee;
                    locationData.montantRemise = oldLocation.montantRemise;
                }
            }
            
            await window.saveToFirebase('locations', locationData);
            window.showAlert('Location modifiée avec succès', 'success');
            
        } else {
            // Mode création
            gps.statut = 'Loué';
            await window.saveToFirebase('gps', gps);
            
            await window.saveToFirebase('locations', locationData);
            
            // Mettre à jour l'usage de la promotion
            if (currentPromotion) {
                const promoUpdate = {
                    ...currentPromotion,
                    usageActuel: (currentPromotion.usageActuel || 0) + 1
                };
                await window.saveToFirebase('promotions', promoUpdate);
            }
            
            // Créer automatiquement le premier paiement si nécessaire
            if (firstPaymentDetails.total > 0) {
                const confirmPayment = confirm(`Voulez-vous enregistrer le premier paiement de ${window.formatCurrency(firstPaymentDetails.total)} maintenant ?`);
                
                if (confirmPayment) {
                    // Rediriger vers le module paiements avec la location pré-sélectionnée
                    window.showModule('paiements');
                    setTimeout(() => {
                        // Ouvrir le modal de paiement
                        if (typeof openPaiementModal === 'function') {
                            openPaiementModal();
                            // Pré-sélectionner la location
                            const locationSelect = document.getElementById('paiementLocationId');
                            if (locationSelect) {
                                locationSelect.value = locationData.id;
                                // Déclencher l'update
                                if (typeof updatePaiementInfo === 'function') {
                                    updatePaiementInfo();
                                }
                            }
                            // Ajouter une note sur les frais
                            const commentaire = document.getElementById('paiementCommentaire');
                            if (commentaire) {
                                let note = 'Premier paiement';
                                if (locationData.fraisActivation > 0) {
                                    note += ` - Inclut frais d'activation: ${window.formatCurrency(locationData.fraisActivation)}`;
                                }
                                if (locationData.promotionAppliquee) {
                                    note += ` - Promotion ${locationData.promotionAppliquee} appliquée`;
                                }
                                commentaire.value = note;
                            }
                        }
                    }, 500);
                } else {
                    window.showAlert('Location créée avec succès. N\'oubliez pas d\'enregistrer le premier paiement.', 'success');
                }
            } else {
                window.showAlert('Location créée avec succès', 'success');
            }
        }
        
        window.closeModal('locationModal');
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la location:', error);
        window.showAlert('Erreur lors de la sauvegarde de la location', 'error');
    } finally {
        const submitBtn = document.getElementById('locationSubmitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = data.originalId ? 'Modifier Location' : 'Créer Location';
        // Réinitialiser la promotion
        currentPromotion = null;
    }
}

async function terminerLocation(locationId) {
    const location = window.appData.locations.find(l => l.id === locationId);
    if (!location) return;
    
    if (confirm(`Êtes-vous sûr de vouloir terminer la location "${location.id}" ?`)) {
        try {
            window.showAlert('Traitement en cours...', 'info');
            
            // Mettre à jour la location
            location.statut = 'terminée';
            location.dateFin = window.getCurrentDate();
            await window.saveToFirebase('locations', location);
            
            // Libérer le GPS
            const gps = window.appData.gps.find(g => g.id === location.gpsId);
            if (gps) {
                gps.statut = 'Disponible';
                await window.saveToFirebase('gps', gps);
            }
            
            window.showAlert('Location terminée avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la terminaison de la location:', error);
            window.showAlert('Erreur lors de la terminaison', 'error');
        }
    }
}

function editLocation(locationId) {
    openLocationModal(locationId);
}

async function deleteLocation(locationId) {
    const location = window.appData.locations.find(l => l.id === locationId);
    if (!location) return;
    
    const hasPaiements = window.appData.paiements.some(p => p.locationId === locationId);
    let confirmMessage = `Êtes-vous sûr de vouloir supprimer la location "${location.id}" ?`;
    if (hasPaiements) {
        confirmMessage += '\n\nAttention: Cette location a des paiements associés qui seront également supprimés.';
    }
    
    if (confirm(confirmMessage)) {
        try {
            window.showAlert('Suppression en cours...', 'info');
            
            // Libérer le GPS si la location est en cours
            if (location.statut === 'en cours') {
                const gps = window.appData.gps.find(g => g.id === location.gpsId);
                if (gps) {
                    gps.statut = 'Disponible';
                    await window.saveToFirebase('gps', gps);
                }
            }
            
            // Supprimer les paiements associés et mettre à jour la caisse
            if (hasPaiements) {
                const paiementsToDelete = window.appData.paiements.filter(p => p.locationId === locationId);
                
                for (const paiement of paiementsToDelete) {
                    // Annuler l'impact sur la caisse
                    const methodId = paiement.methode.toLowerCase();
                    await window.updatePaymentMethodBalance(methodId, -paiement.montant);
                    
                    // Supprimer le paiement
                    await window.deleteFromFirebase('paiements', paiement.id);
                }
            }
            
            // Supprimer la location
            await window.deleteFromFirebase('locations', locationId);
            
            window.showAlert('Location supprimée avec succès', 'success');
            
        } catch (error) {
            console.error('Erreur lors de la suppression de la location:', error);
            window.showAlert('Erreur lors de la suppression de la location', 'error');
        }
    }
}

function getSimStatus(sim) {
    if (!sim.dateExpiration) {
        return sim.statut || 'Inactive';
    }
    const today = new Date();
    const expiryDate = new Date(sim.dateExpiration);
    if (expiryDate < today) {
        return 'Expirée';
    }
    return sim.statut || 'Active';
}

function filterLocations() {
    renderLocationsTable();
    renderMobileLocations();
}

function resetLocationFilters() {
    document.getElementById('filterClientLocation').value = '';
    document.getElementById('filterPaiementStatus').value = '';
    document.getElementById('filterStatutLocation').value = '';
    renderLocationsTable();
    renderMobileLocations();
}