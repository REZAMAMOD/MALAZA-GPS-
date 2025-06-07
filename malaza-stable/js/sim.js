// Module SIM - Version Firebase avec transactions automatiques
console.log('Module SIM chargé - Version Firebase avec transactions automatiques');

function getSIMHTML() {
    return `
        <div class="space-y-6 fade-in">
            <!-- En-tête -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Cartes SIM</h1>
                    <p class="text-gray-600 text-sm sm:text-base">Gérez vos cartes SIM et leurs forfaits</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="openTarifsModal()" class="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                        <i class="fas fa-coins mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Gérer</span> Tarifs
                    </button>
                    <button onclick="openOperateursModal()" class="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
                        <i class="fas fa-network-wired mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Gérer</span> Opérateurs
                    </button>
                    <button onclick="openSIMModal()" class="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                        <i class="fas fa-plus mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Nouvelle</span> SIM
                    </button>
                </div>
            </div>

            <!-- Statistiques SIM -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 rounded-full">
                            <i class="fas fa-sim-card text-blue-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Total SIM</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="totalSIM">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-full">
                            <i class="fas fa-check-circle text-green-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Actives</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="simActives">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-gray-100 rounded-full">
                            <i class="fas fa-pause-circle text-gray-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Inactives</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="simInactives">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-yellow-100 rounded-full">
                            <i class="fas fa-clock text-yellow-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">À renouveler</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="simARenouveler">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtres (Mobile-optimized) -->
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-center">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Statut:</label>
                        <select id="filterStatutSim" onchange="filterSIM()" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <option value="">Tous</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Opérateur:</label>
                        <select id="filterOperateur" onchange="filterSIM()" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <option value="">Tous</option>
                            <!-- Options générées dynamiquement -->
                        </select>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Recherche:</label>
                        <input 
                            type="text" 
                            id="searchSIM" 
                            placeholder="Numéro SIM..." 
                            onkeyup="filterSIM()"
                            class="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                    </div>
                    <button onclick="resetSIMFilters()" class="text-blue-600 hover:text-blue-800 text-sm self-start sm:self-auto">
                        <i class="fas fa-undo mr-1"></i>
                        Réinitialiser
                    </button>
                </div>
            </div>

            <!-- Alertes d'expiration -->
            <div id="simAlerts" class="hidden">
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-yellow-600 mr-3 mt-1"></i>
                        <div>
                            <h4 class="text-yellow-800 font-medium">SIM à renouveler prochainement</h4>
                            <div id="expiringSIMList" class="mt-2 space-y-1">
                                <!-- Liste générée dynamiquement -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Desktop Table (Hidden on mobile) -->
            <div class="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Liste des Cartes SIM</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Numéro SIM
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Opérateur
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expiration
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody id="simTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Contenu généré dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Cards (Hidden on desktop) -->
            <div class="lg:hidden">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Cartes SIM</h3>
                    <span class="text-sm text-gray-500" id="mobileSIMCount">0 SIM</span>
                </div>
                <div id="mobileSIMContainer" class="space-y-3">
                    <!-- Mobile cards générées dynamiquement -->
                </div>
            </div>
        </div>

        <!-- Modal Nouvelle SIM - Responsive avec Date d'Achat -->
        <div id="simModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Nouvelle SIM</h3>
                    <button onclick="closeModal('simModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="simForm">
                    <input type="hidden" id="simOriginalId" name="originalId">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Numéro SIM *</label>
                            <input 
                                type="text" 
                                name="numero" 
                                id="simNumero"
                                required 
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 387754054"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Opérateur *</label>
                            <select 
                                name="operateur" 
                                id="simOperateur"
                                required 
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner un opérateur</option>
                                <!-- Options générées dynamiquement -->
                            </select>
                        </div>
                        
                        <!-- Section coût SIM (uniquement pour création) -->
                        <div id="simCostSection" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 class="font-medium text-gray-900 mb-3">Achat de la SIM</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-700">Prix SIM:</span>
                                    <span class="font-bold text-gray-900" id="simCostDisplay">0 Ar</span>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Date d'achat *</label>
                                    <input 
                                        type="date" 
                                        id="simPurchaseDate"
                                        class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                    <p class="text-xs text-gray-500 mt-1">Date à laquelle vous avez acheté cette SIM</p>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement *</label>
                                    <div class="space-y-2" id="simPaymentMethodsContainer">
                                        <!-- Options générées dynamiquement -->
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-3 rounded">
                                    <div class="space-y-1 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Solde actuel:</span>
                                            <span class="font-medium" id="currentSoldeSimModal">0 Ar</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Coût SIM:</span>
                                            <span class="font-medium" id="simCostInSummary">0 Ar</span>
                                        </div>
                                        <div class="flex justify-between border-t pt-1">
                                            <span class="text-gray-600">Après achat:</span>
                                            <span class="font-medium" id="afterSimPurchase">0 Ar</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="simFundsWarning" class="hidden bg-red-50 border border-red-200 rounded p-3">
                                    <div class="flex items-center">
                                        <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                                        <p class="text-red-800 text-sm">Fonds insuffisants pour cette méthode de paiement</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                            <button 
                                type="submit" 
                                class="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
                                id="simSubmitBtn"
                            >
                                Ajouter SIM
                            </button>
                            <button 
                                type="button" 
                                onclick="closeModal('simModal')" 
                                class="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-base font-medium"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Gestion Tarifs - Responsive -->
        <div id="tarifsModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Gestion des Tarifs</h3>
                    <button onclick="closeModal('tarifsModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Section Coût d'achat SIM -->
                <div class="mb-8 bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-3">Coût d'achat des cartes SIM</h4>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label class="text-sm text-gray-700">Prix unitaire :</label>
                        <div class="flex items-center">
                            <input 
                                type="number" 
                                id="simPurchaseCost"
                                min="0"
                                step="500"
                                class="w-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                            <span class="ml-2 text-gray-700">Ar</span>
                        </div>
                        <button 
                            onclick="updateSimCost()" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <i class="fas fa-save mr-2"></i>
                            Enregistrer
                        </button>
                    </div>
                </div>
                
                <!-- Section Forfaits -->
                <div>
                    <h4 class="font-medium text-gray-900 mb-3">Types de forfaits disponibles</h4>
                    
                    <!-- Ajouter nouveau forfait -->
                    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h5 class="text-sm font-medium text-gray-700 mb-3">Ajouter un nouveau forfait</h5>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Nom court (unique)</label>
                                <input 
                                    type="text" 
                                    id="newForfaitId"
                                    placeholder="Ex: week, month, year"
                                    class="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    maxlength="20"
                                >
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Nom d'affichage</label>
                                <input 
                                    type="text" 
                                    id="newForfaitName"
                                    placeholder="Ex: Forfait Week"
                                    class="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    maxlength="30"
                                >
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Description</label>
                                <input 
                                    type="text" 
                                    id="newForfaitDescription"
                                    placeholder="Ex: 1 semaine"
                                    class="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    maxlength="50"
                                >
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Durée (jours)</label>
                                <input 
                                    type="number" 
                                    id="newForfaitDuration"
                                    placeholder="Ex: 7"
                                    min="1"
                                    max="365"
                                    class="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                                >
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Prix (Ar)</label>
                                <input 
                                    type="number" 
                                    id="newForfaitPrice"
                                    placeholder="Ex: 3000"
                                    min="0"
                                    step="500"
                                    class="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                                >
                            </div>
                            <div class="flex items-end">
                                <button 
                                    onclick="ajouterForfait()" 
                                    class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <i class="fas fa-plus mr-2"></i>
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Liste des forfaits existants -->
                    <div class="space-y-2" id="listeForfaits">
                        <!-- Généré dynamiquement -->
                    </div>
                </div>

                <div class="flex justify-end pt-4 border-t mt-6">
                    <button 
                        onclick="closeModal('tarifsModal')" 
                        class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Gestion Opérateurs - Responsive -->
        <div id="operateursModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Gestion des Opérateurs</h3>
                    <button onclick="closeModal('operateursModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Ajouter nouvel opérateur -->
                <div class="mb-6">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            id="nouvelOperateur"
                            placeholder="Ex: Airtel, Bip..."
                            class="flex-1 p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            maxlength="20"
                        >
                        <button 
                            onclick="ajouterOperateur()" 
                            class="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Ajoutez les opérateurs télécom disponibles</p>
                </div>

                <!-- Liste des opérateurs existants -->
                <div class="space-y-2 max-h-64 overflow-y-auto" id="listeOperateurs">
                    <!-- Généré dynamiquement -->
                </div>

                <div class="flex justify-end pt-4 border-t mt-4">
                    <button 
                        onclick="closeModal('operateursModal')" 
                        class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Achat Forfait - Responsive -->
        <div id="forfaitModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Acheter Forfait</h3>
                    <button onclick="closeModal('forfaitModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-900 mb-2">Informations SIM</h4>
                        <div id="forfaitSimInfo" class="space-y-1 text-sm text-gray-600">
                            <!-- Informations générées dynamiquement -->
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Type de forfait *</label>
                        <div class="space-y-2" id="forfaitTypesContainer">
                            <!-- Options de forfaits générées dynamiquement -->
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date de début du forfait *</label>
                        <input 
                            type="date" 
                            id="forfaitDateDebut"
                            class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            onchange="updateForfaitCost()"
                        >
                        <p class="text-xs text-gray-500 mt-1">Le forfait commencera à cette date et durera selon le type choisi</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement *</label>
                        <div class="space-y-2" id="forfaitPaymentMethodsContainer">
                            <!-- Options générées dynamiquement -->
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-900 mb-2">Détails achat</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Coût forfait:</span>
                                <span class="font-medium" id="forfaitCost">0 Ar</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Date début:</span>
                                <span class="font-medium" id="forfaitStartDate">-</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Date fin:</span>
                                <span class="font-medium" id="forfaitEndDate">-</span>
                            </div>
                            <div class="flex justify-between border-t pt-2">
                                <span class="text-gray-600">Solde après achat:</span>
                                <span class="font-medium" id="afterForfaitPurchase">0 Ar</span>
                            </div>
                        </div>
                    </div>
                    
                    <div id="forfaitFundsWarning" class="hidden bg-red-50 border border-red-200 rounded p-3">
                        <div class="flex items-center">
                            <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                            <p class="text-red-800 text-sm">Fonds insuffisants pour cette méthode de paiement</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <button 
                            onclick="confirmForfaitPurchase()" 
                            class="w-full sm:flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-base font-medium"
                            id="confirmForfaitBtn"
                        >
                            <i class="fas fa-credit-card mr-2"></i>
                            Acheter Forfait
                        </button>
                        <button 
                            onclick="closeModal('forfaitModal')" 
                            class="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-base font-medium"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Variables pour stocker les configurations
let simOperators = [];
let forfaitTypes = [];
let simPurchaseCost = 3000;
let selectedSIMForForfait = null;

async function initSIM() {
    console.log('Initialisation du module SIM avec transactions automatiques');
    
    // Recalculer la caisse depuis les transactions
    window.calculateCaisseFromTransactions();
    
    // Charger les configurations depuis Firebase
    await loadSIMConfigurations();
    
    // Mettre à jour les statuts des SIM expirées
    updateExpiredSIMStatuses();
    
    // Charger les données
    populateOperatorFilters();
    renderSIMTable();
    renderMobileSIM();
    updateSIMStats();
    checkExpiringSIMs();
    
    // Initialiser le formulaire
    setupSIMForm();
    
    // Écouter les changements en temps réel
    listenToSIMChanges();
}

// Charger les configurations depuis Firebase
async function loadSIMConfigurations() {
    try {
        // Charger les opérateurs
        const operatorsDoc = await window.firebaseDB.collection('configurations').doc('simOperators').get();
        if (operatorsDoc.exists) {
            simOperators = operatorsDoc.data().operators || [
                { id: 'telma', name: 'Telma', color: 'red' },
                { id: 'orange', name: 'Orange', color: 'orange' }
            ];
        } else {
            // Initialiser avec les opérateurs par défaut
            simOperators = [
                { id: 'telma', name: 'Telma', color: 'red' },
                { id: 'orange', name: 'Orange', color: 'orange' }
            ];
            await saveSIMOperators();
        }
        
        // Charger les forfaits
        const forfaitsDoc = await window.firebaseDB.collection('configurations').doc('forfaitTypes').get();
        if (forfaitsDoc.exists) {
            forfaitTypes = forfaitsDoc.data().types || [
                { id: 'week', name: 'week', displayName: 'Forfait Week', description: '1 semaine', duration: 7, price: 3000 },
                { id: 'month', name: 'month', displayName: 'Forfait Month', description: '1 mois', duration: 30, price: 15000 }
            ];
        } else {
            // Initialiser avec les forfaits par défaut
            forfaitTypes = [
                { id: 'week', name: 'week', displayName: 'Forfait Week', description: '1 semaine', duration: 7, price: 3000 },
                { id: 'month', name: 'month', displayName: 'Forfait Month', description: '1 mois', duration: 30, price: 15000 }
            ];
            await saveForfaitTypes();
        }
        
        // Charger le coût d'achat SIM
        const costsDoc = await window.firebaseDB.collection('configurations').doc('simCosts').get();
        if (costsDoc.exists) {
            simPurchaseCost = costsDoc.data().purchaseCost || 3000;
        } else {
            // Initialiser avec le coût par défaut
            simPurchaseCost = 3000;
            await saveSIMCosts();
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des configurations SIM:', error);
        // Utiliser les valeurs par défaut en cas d'erreur
        simOperators = [
            { id: 'telma', name: 'Telma', color: 'red' },
            { id: 'orange', name: 'Orange', color: 'orange' }
        ];
        forfaitTypes = [
            { id: 'week', name: 'week', displayName: 'Forfait Week', description: '1 semaine', duration: 7, price: 3000 },
            { id: 'month', name: 'month', displayName: 'Forfait Month', description: '1 mois', duration: 30, price: 15000 }
        ];
        simPurchaseCost = 3000;
    }
}

// Sauvegarder les opérateurs dans Firebase
async function saveSIMOperators() {
    try {
        await window.firebaseDB.collection('configurations').doc('simOperators').set({
            operators: simOperators,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des opérateurs:', error);
        throw error;
    }
}

// Sauvegarder les forfaits dans Firebase
async function saveForfaitTypes() {
    try {
        await window.firebaseDB.collection('configurations').doc('forfaitTypes').set({
            types: forfaitTypes,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des forfaits:', error);
        throw error;
    }
}

// Sauvegarder les coûts dans Firebase
async function saveSIMCosts() {
    try {
        await window.firebaseDB.collection('configurations').doc('simCosts').set({
            purchaseCost: simPurchaseCost,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des coûts:', error);
        throw error;
    }
}

// Écouter les changements en temps réel depuis Firebase
function listenToSIMChanges() {
    if (!window.firebaseDB) {
        console.error('Firebase DB non initialisé');
        setTimeout(() => {
            listenToSIMChanges();
        }, 1000);
        return;
    }
    
    // Écouter les changements sur la collection SIM
    window.firebaseDB.collection('sim').onSnapshot((snapshot) => {
        console.log('Changements détectés dans les SIM');
        
        // Mettre à jour le cache local
        window.appData.sim = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Mettre à jour les statuts expirés
        updateExpiredSIMStatuses();
        
        // Rafraîchir l'affichage
        renderSIMTable();
        renderMobileSIM();
        updateSIMStats();
        checkExpiringSIMs();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements SIM:', error);
    });
    
    // Écouter les changements sur les transactions pour recalculer la caisse
    window.firebaseDB.collection('transactions').onSnapshot((snapshot) => {
        window.appData.transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Recalculer la caisse
        window.calculateCaisseFromTransactions();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements transactions:', error);
    });
    
    // Écouter les changements sur les configurations
    window.firebaseDB.collection('configurations').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'modified' || change.type === 'added') {
                const docId = change.doc.id;
                const data = change.doc.data();
                
                switch (docId) {
                    case 'simOperators':
                        simOperators = data.operators || [];
                        populateOperatorFilters();
                        populateOperatorOptions();
                        renderListeOperateurs();
                        break;
                    case 'forfaitTypes':
                        forfaitTypes = data.types || [];
                        renderListeForfaits();
                        break;
                    case 'simCosts':
                        simPurchaseCost = data.purchaseCost || 3000;
                        const costDisplay = document.getElementById('simCostDisplay');
                        if (costDisplay) {
                            costDisplay.textContent = window.formatCurrency(simPurchaseCost);
                        }
                        break;
                }
            }
        });
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements de configuration:', error);
    });
}

// Mettre à jour les statuts des SIM expirées
async function updateExpiredSIMStatuses() {
    let updated = false;
    const today = new Date();
    
    for (const sim of window.appData.sim) {
        if (sim.dateExpiration) {
            const expiryDate = new Date(sim.dateExpiration);
            if (expiryDate < today && sim.statut === 'Active') {
                sim.statut = 'Inactive';
                updated = true;
                // Mettre à jour dans Firebase
                try {
                    await window.saveToFirebase('sim', sim);
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du statut de la SIM:', error);
                }
            }
        }
    }
}

function setupSIMForm() {
    const form = document.getElementById('simForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Ajouter la méthode de paiement depuis le radio button sélectionné
            const selectedPaymentMethod = document.querySelector('input[name="methodePaiementSim"]:checked');
            if (selectedPaymentMethod) {
                data.methodePaiementSim = selectedPaymentMethod.value;
            }
            
            // Ajouter la date d'achat
            data.dateAchat = document.getElementById('simPurchaseDate')?.value;
            
            await handleSIMSubmit(data);
        });
    }
}

// Peupler les filtres d'opérateurs dynamiquement
function populateOperatorFilters() {
    const filterOperateur = document.getElementById('filterOperateur');
    if (filterOperateur) {
        const currentValue = filterOperateur.value;
        
        filterOperateur.innerHTML = '<option value="">Tous</option>';
        simOperators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.name;
            option.textContent = operator.name;
            if (operator.name === currentValue) option.selected = true;
            filterOperateur.appendChild(option);
        });
    }
}

// Générer les options d'opérateurs pour les modals
function populateOperatorOptions() {
    const operatorSelect = document.getElementById('simOperateur');
    if (operatorSelect) {
        const currentValue = operatorSelect.value;
        
        operatorSelect.innerHTML = '<option value="">Sélectionner un opérateur</option>';
        simOperators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.name;
            option.textContent = operator.name;
            if (operator.name === currentValue) option.selected = true;
            operatorSelect.appendChild(option);
        });
        
        // Sélectionner le premier par défaut si aucun n'est sélectionné
        if (!currentValue && simOperators.length > 0) {
            operatorSelect.value = simOperators[0].name;
        }
    }
}

// Générer les méthodes de paiement pour SIM
function generateSimPaymentMethods() {
    const container = document.getElementById('simPaymentMethodsContainer');
    if (container) {
        container.innerHTML = window.generatePaymentMethodRadios('methodePaiementSim', null, 'updateSimPaymentInfo');
    }
}

// Générer les méthodes de paiement pour forfait
function generateForfaitPaymentMethods() {
    const container = document.getElementById('forfaitPaymentMethodsContainer');
    if (container) {
        container.innerHTML = window.generatePaymentMethodRadios('methodePaiementForfait', null, 'updateForfaitCost');
    }
}

function updateSimPaymentInfo() {
    const selectedMethodInput = document.querySelector('input[name="methodePaiementSim"]:checked');
    if (!selectedMethodInput) return;
    
    const selectedMethodId = selectedMethodInput.value.toLowerCase();
    const currentSolde = window.getPaymentMethodBalance(selectedMethodId);
    const simCost = simPurchaseCost;
    
    // Mettre à jour les affichages
    document.getElementById('simCostDisplay').textContent = window.formatCurrency(simCost);
    document.getElementById('simCostInSummary').textContent = window.formatCurrency(simCost);
    document.getElementById('currentSoldeSimModal').textContent = window.formatCurrency(currentSolde);
    document.getElementById('afterSimPurchase').textContent = window.formatCurrency(currentSolde - simCost);
    
    const warningDiv = document.getElementById('simFundsWarning');
    const submitBtn = document.getElementById('simSubmitBtn');
    
    // Vérification directe
    if (currentSolde < simCost) {
        warningDiv.classList.remove('hidden');
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.type = 'button'; // Empêcher la soumission
    } else {
        warningDiv.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        submitBtn.type = 'submit'; // Permettre la soumission
    }
}

function updateForfaitCost() {
    const selectedType = document.querySelector('input[name="typeForfait"]:checked')?.value;
    const selectedMethodInput = document.querySelector('input[name="methodePaiementForfait"]:checked');
    const startDate = document.getElementById('forfaitDateDebut')?.value;
    
    if (!selectedType || !selectedMethodInput || !startDate) return;
    
    const selectedMethodId = selectedMethodInput.value.toLowerCase();
    const forfait = forfaitTypes.find(f => f.id === selectedType);
    
    if (!forfait) return;
    
    const cost = forfait.price;
    const currentSolde = window.getPaymentMethodBalance(selectedMethodId);
    
    // Calculer les dates
    const dateDebut = new Date(startDate);
    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + forfait.duration - 1); // -1 car le jour de début compte
    
    // Mettre à jour les affichages
    document.getElementById('forfaitCost').textContent = window.formatCurrency(cost);
    document.getElementById('forfaitStartDate').textContent = window.formatDate(startDate);
    document.getElementById('forfaitEndDate').textContent = window.formatDate(dateFin.toISOString().split('T')[0]);
    document.getElementById('afterForfaitPurchase').textContent = window.formatCurrency(currentSolde - cost);
    
    const warningDiv = document.getElementById('forfaitFundsWarning');
    const confirmBtn = document.getElementById('confirmForfaitBtn');
    
    // Vérification directe
    if (currentSolde < cost) {
        warningDiv.classList.remove('hidden');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Fonds insuffisants';
        confirmBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        confirmBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
    } else {
        warningDiv.classList.add('hidden');
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fas fa-credit-card mr-2"></i>Acheter Forfait';
        confirmBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        confirmBtn.classList.add('bg-green-600', 'hover:bg-green-700');
    }
}

function renderSIMTable() {
    const tbody = document.getElementById('simTableBody');
    
    if (!tbody) {
        console.log('Element simTableBody non trouvé (normal sur mobile)');
        return;
    }
    
    let simsToShow = [...window.appData.sim];
    
    // Appliquer les filtres
    const filterStatut = document.getElementById('filterStatutSim')?.value;
    const filterOperateur = document.getElementById('filterOperateur')?.value;
    const searchTerm = document.getElementById('searchSIM')?.value;
    
    if (filterStatut) {
        simsToShow = simsToShow.filter(sim => getSimStatus(sim) === filterStatut);
    }
    
    if (filterOperateur) {
        simsToShow = simsToShow.filter(sim => sim.operateur === filterOperateur);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        simsToShow = simsToShow.filter(sim => 
            sim.id.toLowerCase().includes(term)
        );
    }
    
    if (simsToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-sim-card text-4xl mb-2"></i>
                    <p>Aucune SIM trouvée</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = simsToShow.map(sim => {
        const status = getSimStatus(sim);
        const statusClass = {
            'Active': 'bg-green-100 text-green-800',
            'Inactive': 'bg-gray-100 text-gray-800'
        };
        
        const statusIcon = {
            'Active': 'check-circle',
            'Inactive': 'pause-circle'
        };
        
        // Obtenir la couleur de l'opérateur
        const operatorDetails = simOperators.find(o => o.name === sim.operateur);
        const operatorColor = operatorDetails ? `text-${operatorDetails.color}-600` : 'text-gray-900';
        
        const daysUntilExpiry = sim.dateExpiration ? window.getDaysUntilExpiry(sim.dateExpiration) : null;
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <i class="fas fa-sim-card text-indigo-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${sim.id}</div>
                            <div class="text-sm text-gray-500">Carte SIM</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium ${operatorColor}">${sim.operateur}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass[status]}">
                        <i class="fas fa-${statusIcon[status]} mr-1"></i>
                        ${status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${sim.dateExpiration ? `
                        <div>
                            <div>${window.formatDate(sim.dateExpiration)}</div>
                            ${daysUntilExpiry !== null ? `
                                <div class="text-xs ${daysUntilExpiry <= 7 && daysUntilExpiry > 0 ? 'text-orange-600 font-medium' : 
                                    daysUntilExpiry <= 0 ? 'text-red-600 font-medium' : 'text-gray-400'}">
                                    ${daysUntilExpiry > 0 ? `${daysUntilExpiry}j restants` : 
                                      daysUntilExpiry === 0 ? 'Expire aujourd\'hui' : 'Expirée'}
                                </div>
                            ` : ''}
                        </div>
                    ` : '<span class="text-gray-400">Pas de forfait</span>'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex space-x-2">
                        <button 
                            onclick="editSIM('${sim.id}')" 
                            class="text-yellow-600 hover:text-yellow-900" 
                            title="Modifier"
                        >
                            <i class="fas fa-edit"></i>
                        </button>
                        <button 
                            onclick="openForfaitModal('${sim.id}')" 
                            class="text-green-600 hover:text-green-900" 
                            title="Acheter forfait"
                        >
                            <i class="fas fa-credit-card"></i>
                        </button>
                        <button 
                            onclick="deleteSIM('${sim.id}')" 
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

function renderMobileSIM() {
    const container = document.getElementById('mobileSIMContainer');
    const countElement = document.getElementById('mobileSIMCount');
    
    if (!container) {
        console.log('Element mobileSIMContainer non trouvé (normal sur desktop)');
        return;
    }
    
    let simsToShow = [...window.appData.sim];
    
    // Appliquer les filtres
    const filterStatut = document.getElementById('filterStatutSim')?.value;
    const filterOperateur = document.getElementById('filterOperateur')?.value;
    const searchTerm = document.getElementById('searchSIM')?.value;
    
    if (filterStatut) {
        simsToShow = simsToShow.filter(sim => getSimStatus(sim) === filterStatut);
    }
    
    if (filterOperateur) {
        simsToShow = simsToShow.filter(sim => sim.operateur === filterOperateur);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        simsToShow = simsToShow.filter(sim => 
            sim.id.toLowerCase().includes(term)
        );
    }
    
    // Mettre à jour le compteur
    if (countElement) {
        countElement.textContent = `${simsToShow.length} SIM`;
    }
    
    if (simsToShow.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-lg">
                <i class="fas fa-sim-card text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 mb-4">Aucune SIM trouvée</p>
                <button onclick="openSIMModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <i class="fas fa-plus mr-2"></i>
                    Ajouter une SIM
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = simsToShow.map(sim => {
        const status = getSimStatus(sim);
        const statusClass = {
            'Active': 'bg-green-100 text-green-800',
            'Inactive': 'bg-gray-100 text-gray-800'
        };
        
        const statusIcon = {
            'Active': 'check-circle',
            'Inactive': 'pause-circle'
        };
        
        const operatorDetails = simOperators.find(o => o.name === sim.operateur);
        const operatorColor = operatorDetails ? operatorDetails.color : 'gray';
        
        const daysUntilExpiry = sim.dateExpiration ? window.getDaysUntilExpiry(sim.dateExpiration) : null;
        
        // Trouver si la SIM est utilisée dans une location
        const location = window.appData.locations.find(l => l.simId === sim.id && l.statut === 'en cours');
        
        return `
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <!-- Header avec numéro et statut -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            <i class="fas fa-sim-card text-indigo-600 text-lg"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 text-base">${sim.id}</h3>
                            <p class="text-sm text-${operatorColor}-600 font-medium">${sim.operateur}</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${statusClass[status]}">
                        <i class="fas fa-${statusIcon[status]} mr-1"></i>
                        ${status}
                    </span>
                </div>
                
                <!-- Informations -->
                <div class="space-y-2 mb-4">
                    ${sim.dateExpiration ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-calendar-alt text-gray-400 w-5 mr-2"></i>
                            <span class="text-gray-900">Expire le ${window.formatDate(sim.dateExpiration)}</span>
                        </div>
                        ${daysUntilExpiry !== null ? `
                            <div class="flex items-center text-sm">
                                <i class="fas fa-${daysUntilExpiry <= 0 ? 'times-circle' : daysUntilExpiry <= 7 ? 'exclamation-triangle' : 'clock'} 
                                    text-${daysUntilExpiry <= 0 ? 'red' : daysUntilExpiry <= 7 ? 'orange' : 'green'}-500 w-5 mr-2"></i>
                                <span class="text-${daysUntilExpiry <= 0 ? 'red' : daysUntilExpiry <= 7 ? 'orange' : 'green'}-700 font-medium">
                                    ${daysUntilExpiry > 0 ? `${daysUntilExpiry} jours restants` : 
                                      daysUntilExpiry === 0 ? 'Expire aujourd\'hui' : 'Forfait expiré'}
                                </span>
                            </div>
                        ` : ''}
                    ` : `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-exclamation-circle text-gray-400 w-5 mr-2"></i>
                            <span class="text-gray-600">Pas de forfait actif</span>
                        </div>
                    `}
                    
                    ${sim.forfait ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-wifi text-purple-500 w-5 mr-2"></i>
                            <span class="text-gray-900">${sim.forfait}</span>
                            ${sim.prixForfait ? `<span class="ml-2 text-gray-600">(${window.formatCurrency(sim.prixForfait)})</span>` : ''}
                        </div>
                    ` : ''}
                    
                    ${location ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-map-pin text-blue-500 w-5 mr-2"></i>
                            <span class="text-blue-700 font-medium">Utilisée: ${location.id}</span>
                        </div>
                    ` : ''}
                    
                    ${sim.dateAchat ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-shopping-cart text-gray-400 w-5 mr-2"></i>
                            <span class="text-gray-600">Achetée le ${window.formatDate(sim.dateAchat)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-2 pt-3 border-t">
                    <button 
                        onclick="editSIM('${sim.id}')" 
                        class="flex-1 bg-yellow-50 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                    >
                        <i class="fas fa-edit mr-2"></i>
                        Modifier
                    </button>
                    <button 
                        onclick="openForfaitModal('${sim.id}')" 
                        class="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                        <i class="fas fa-credit-card mr-2"></i>
                        Forfait
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateSIMStats() {
    const totalSIM = window.appData.sim.length;
    const simActives = window.appData.sim.filter(sim => getSimStatus(sim) === 'Active').length;
    const simInactives = window.appData.sim.filter(sim => getSimStatus(sim) === 'Inactive').length;
    
    // SIM à renouveler (expiration dans 7 jours ou moins)
    const simARenouveler = window.appData.sim.filter(sim => {
        if (!sim.dateExpiration) return false;
        const days = window.getDaysUntilExpiry(sim.dateExpiration);
        return days !== null && days <= 7 && days > 0;
    }).length;
    
    // Mise à jour des éléments
    const elements = {
        totalSIM: document.getElementById('totalSIM'),
        simActives: document.getElementById('simActives'),
       simInactives: document.getElementById('simInactives'),
       simARenouveler: document.getElementById('simARenouveler')
   };
   
   if (elements.totalSIM) elements.totalSIM.textContent = totalSIM;
   if (elements.simActives) elements.simActives.textContent = simActives;
   if (elements.simInactives) elements.simInactives.textContent = simInactives;
   if (elements.simARenouveler) elements.simARenouveler.textContent = simARenouveler;
}

function checkExpiringSIMs() {
   const expiringSIMs = window.appData.sim.filter(sim => {
       if (!sim.dateExpiration) return false;
       const days = window.getDaysUntilExpiry(sim.dateExpiration);
       return days !== null && days <= 7 && days >= 0;
   });
   
   const alertsContainer = document.getElementById('simAlerts');
   const listContainer = document.getElementById('expiringSIMList');
   
   if (expiringSIMs.length > 0) {
       alertsContainer.classList.remove('hidden');
       listContainer.innerHTML = expiringSIMs.map(sim => {
           const days = window.getDaysUntilExpiry(sim.dateExpiration);
           return `
               <div class="flex justify-between items-center text-sm text-yellow-800">
                   <span>SIM ${sim.id} (${sim.operateur})</span>
                   <span class="font-medium">
                       ${days === 0 ? 'Expire aujourd\'hui' : `${days} jour${days > 1 ? 's' : ''}`}
                   </span>
               </div>
           `;
       }).join('');
   } else {
       alertsContainer.classList.add('hidden');
   }
}

function getSimStatus(sim) {
   // Si pas de date d'expiration, la SIM est inactive
   if (!sim.dateExpiration) {
       return 'Inactive';
   }
   
   // Vérifier si la date est expirée
   const today = new Date();
   const expiryDate = new Date(sim.dateExpiration);
   
   if (expiryDate < today) {
       return 'Inactive'; // Expirée devient Inactive automatiquement
   }
   
   // Si elle a une date d'expiration future, elle est active
   return 'Active';
}

function openSIMModal(simId = null) {
   const modal = document.getElementById('simModal');
   const title = modal.querySelector('h3');
   const submitBtn = document.getElementById('simSubmitBtn');
   const costSection = document.getElementById('simCostSection');
   
   // Générer les options dynamiquement
   populateOperatorOptions();
   
   if (simId) {
       // Mode modification
       const sim = window.appData.sim.find(s => s.id === simId);
       if (sim) {
           title.textContent = 'Modifier SIM';
           submitBtn.textContent = 'Modifier SIM';
           
           // Masquer la section coût pour modification
           costSection.style.display = 'none';
           
           // Pré-remplir le formulaire
           document.getElementById('simOriginalId').value = sim.id;
           document.getElementById('simNumero').value = sim.id;
           document.getElementById('simOperateur').value = sim.operateur;
       }
   } else {
       // Mode création
       title.textContent = 'Nouvelle SIM';
       submitBtn.textContent = `Acheter SIM (${window.formatCurrency(simPurchaseCost)})`;
       submitBtn.type = 'submit'; // S'assurer que c'est un bouton submit
       submitBtn.disabled = false; // Activer par défaut
       submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
       
       // Afficher la section coût pour création
       costSection.style.display = 'block';
       
       // Réinitialiser le formulaire
       document.getElementById('simForm').reset();
       document.getElementById('simOriginalId').value = '';
       
       // Définir la date d'achat par défaut à aujourd'hui
       document.getElementById('simPurchaseDate').value = window.getCurrentDate();
       
       // Générer les méthodes de paiement et initialiser
       generateSimPaymentMethods();
       
       // Sélectionner le premier opérateur par défaut
       if (simOperators.length > 0) {
           document.getElementById('simOperateur').value = simOperators[0].name;
       }
       
       // Initialiser les infos de paiement après un délai
       setTimeout(() => updateSimPaymentInfo(), 100);
   }
   
   window.openModal('simModal');
}

async function handleSIMSubmit(data) {
   // Validation
   if (!data.numero || !data.operateur) {
       window.showAlert('Veuillez remplir tous les champs obligatoires', 'error');
       return;
   }
   
   // Vérifier l'unicité du numéro SIM
   const existingSIM = window.appData.sim.find(s => s.id === data.numero && s.id !== data.originalId);
   if (existingSIM) {
       window.showAlert('Ce numéro de SIM existe déjà', 'error');
       return;
   }
   
   try {
       // Désactiver le bouton pendant la sauvegarde
       const submitBtn = document.getElementById('simSubmitBtn');
       submitBtn.disabled = true;
       submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enregistrement...';
       
       if (data.originalId) {
           // Mode modification - pas de coût ni de transaction
           const simData = {
               id: data.numero,
               operateur: data.operateur,
               dateExpiration: window.appData.sim.find(s => s.id === data.originalId)?.dateExpiration || null,
               dateAchat: window.appData.sim.find(s => s.id === data.originalId)?.dateAchat || null,
               statut: getSimStatus(window.appData.sim.find(s => s.id === data.originalId))
           };
           
           await window.saveToFirebase('sim', simData);
           window.showAlert('SIM modifiée avec succès', 'success');
           
       } else {
           // Mode création - avec coût et date d'achat
           const methodePaiementId = data.methodePaiementSim.toLowerCase();
           const simCost = simPurchaseCost;
           const dateAchat = data.dateAchat || window.getCurrentDate();
           
           // Vérifier les fonds directement
           const currentBalance = window.getPaymentMethodBalance(methodePaiementId);
           if (currentBalance < simCost) {
               window.showAlert('Fonds insuffisants pour acheter cette SIM', 'error');
               return;
           }
           
           // Créer la SIM
           const newSIM = {
               id: data.numero,
               operateur: data.operateur,
               dateExpiration: null, // Pas de forfait par défaut
               dateAchat: dateAchat, // Nouvelle propriété
               statut: 'Inactive'
           };
           
           await window.saveToFirebase('sim', newSIM);
           
           // Enregistrer la transaction d'achat SIM
           const methodDetails = window.getPaymentMethodDetails(methodePaiementId);
           const transaction = {
               id: window.generateId('TXN', window.appData.transactions),
               type: 'depense_manuel',
               description: `Achat SIM ${data.numero}`,
               categorie: 'Achat cartes SIM',
               montant: simCost,
               methode: methodDetails ? methodDetails.name : data.methodePaiementSim,
               date: dateAchat,
               simId: data.numero, // Lien avec la SIM mais pas de dépendance
               notes: `SIM ${data.operateur}`,
               createdAt: new Date().toISOString()
           };
           
           await window.saveToFirebase('transactions', transaction);
           
           window.showAlert('SIM achetée avec succès', 'success');
       }
       
       window.closeModal('simModal');
       
   } catch (error) {
       console.error('Erreur lors de la sauvegarde de la SIM:', error);
       window.showAlert('Erreur lors de la sauvegarde de la SIM', 'error');
   } finally {
       // Réactiver le bouton
       const submitBtn = document.getElementById('simSubmitBtn');
       submitBtn.disabled = false;
       submitBtn.innerHTML = data.originalId ? 'Modifier SIM' : `Acheter SIM (${window.formatCurrency(simPurchaseCost)})`;
   }
}

function editSIM(simId) {
   openSIMModal(simId);
}

function openForfaitModal(simId) {
   const sim = window.appData.sim.find(s => s.id === simId);
   if (!sim) return;
   
   selectedSIMForForfait = sim;
   
   // Mettre à jour les informations
   document.getElementById('forfaitSimInfo').innerHTML = `
       <div>Numéro: <strong>${sim.id}</strong></div>
       <div>Opérateur: <strong>${sim.operateur}</strong></div>
       ${sim.dateExpiration ? `<div>Expiration actuelle: <strong>${window.formatDate(sim.dateExpiration)}</strong></div>` : '<div class="text-gray-500">Pas de forfait actif</div>'}
   `;
   
   // Générer les options de forfaits
   generateForfaitOptions();
   
   // Générer les méthodes de paiement
   generateForfaitPaymentMethods();
   
   // Définir la date par défaut = aujourd'hui
   document.getElementById('forfaitDateDebut').value = window.getCurrentDate();
   
   // Réinitialiser les sélections par défaut
   setTimeout(() => {
       updateForfaitCost();
   }, 100);
   
   window.openModal('forfaitModal');
}

async function confirmForfaitPurchase() {
   if (!selectedSIMForForfait) return;
   
   const selectedType = document.querySelector('input[name="typeForfait"]:checked').value;
   const selectedMethodInput = document.querySelector('input[name="methodePaiementForfait"]:checked');
   const startDate = document.getElementById('forfaitDateDebut').value;
   
   if (!selectedMethodInput) {
       window.showAlert('Veuillez sélectionner une méthode de paiement', 'error');
       return;
   }
   
   if (!startDate) {
       window.showAlert('Veuillez sélectionner une date de début', 'error');
       return;
   }
   
   const forfait = forfaitTypes.find(f => f.id === selectedType);
   if (!forfait) {
       window.showAlert('Type de forfait invalide', 'error');
       return;
   }
   
   const selectedMethodId = selectedMethodInput.value.toLowerCase();
   const cost = forfait.price;
   const duration = forfait.duration;
   const forfaitName = forfait.displayName;
   
   // Vérifier les fonds directement
   const currentBalance = window.getPaymentMethodBalance(selectedMethodId);
   if (currentBalance < cost) {
       const methodDetails = window.getPaymentMethodDetails(selectedMethodId);
       window.showAlert(`Fonds insuffisants en ${methodDetails ? methodDetails.name : selectedMethodInput.value}`, 'error');
       return;
   }
   
   const methodDetails = window.getPaymentMethodDetails(selectedMethodId);
   const methodName = methodDetails ? methodDetails.name : selectedMethodInput.value;
   
   // Calculer la date de fin
   const dateDebut = new Date(startDate);
   const dateFin = new Date(dateDebut);
   dateFin.setDate(dateDebut.getDate() + duration - 1);
   
   if (confirm(`Confirmer l'achat du ${forfaitName} pour la SIM ${selectedSIMForForfait.id}\n\nDu ${window.formatDate(startDate)} au ${window.formatDate(dateFin.toISOString().split('T')[0])}\nCoût: ${window.formatCurrency(cost)} (${methodName}) ?`)) {
       try {
           window.showAlert('Traitement de l\'achat...', 'info');
           
           // Mettre à jour la SIM avec la date de fin calculée
           selectedSIMForForfait.dateExpiration = dateFin.toISOString().split('T')[0];
           selectedSIMForForfait.statut = 'Active'; // Activer la SIM
           selectedSIMForForfait.forfait = forfaitName; // Mettre à jour le nom du forfait
           selectedSIMForForfait.prixForfait = cost; // Mettre à jour le prix du forfait
           
           await window.saveToFirebase('sim', selectedSIMForForfait);
           
           // Enregistrer la transaction
           const transaction = {
               id: window.generateId('TXN', window.appData.transactions),
               type: 'depense_manuel',
               description: `${forfaitName} - SIM ${selectedSIMForForfait.id}`,
               categorie: 'Forfait SIM',
               montant: cost,
               methode: methodName,
               date: window.getCurrentDate(),
               simId: selectedSIMForForfait.id, // Lien avec la SIM mais pas de dépendance
               notes: `${selectedSIMForForfait.operateur} - Début: ${window.formatDate(startDate)} - Fin: ${window.formatDate(dateFin.toISOString().split('T')[0])}`,
               createdAt: new Date().toISOString()
           };
           
           await window.saveToFirebase('transactions', transaction);
           
           window.closeModal('forfaitModal');
           selectedSIMForForfait = null;
           
           window.showAlert(`${forfaitName} acheté avec succès (actif jusqu'au ${window.formatDate(dateFin.toISOString().split('T')[0])})`, 'success');
           
       } catch (error) {
           console.error('Erreur lors de l\'achat du forfait:', error);
           window.showAlert('Erreur lors de l\'achat du forfait', 'error');
       }
   }
}

async function deleteSIM(simId) {
   const sim = window.appData.sim.find(s => s.id === simId);
   if (!sim) return;
   
   // Vérifier s'il y a des locations actives avec cette SIM
   const hasActiveLocations = window.appData.locations.some(l => l.simId === simId && l.statut === 'en cours');
   
   if (hasActiveLocations) {
       window.showAlert('Impossible de supprimer cette SIM : elle est utilisée dans une location active', 'error');
       return;
   }
   
   if (confirm(`Êtes-vous sûr de vouloir supprimer la SIM "${sim.id}" (${sim.operateur}) ?\n\nNote: Les transactions associées seront conservées dans l'historique.`)) {
       try {
           window.showAlert('Suppression en cours...', 'info');
           
           // Supprimer seulement la SIM, pas les transactions
           await window.deleteFromFirebase('sim', simId);
           
           window.showAlert('SIM supprimée avec succès', 'success');
       } catch (error) {
           console.error('Erreur lors de la suppression de la SIM:', error);
           window.showAlert('Erreur lors de la suppression de la SIM', 'error');
       }
   }
}

function filterSIM() {
   renderSIMTable();
   renderMobileSIM();
}

function resetSIMFilters() {
   document.getElementById('filterStatutSim').value = '';
   document.getElementById('filterOperateur').value = '';
   document.getElementById('searchSIM').value = '';
   renderSIMTable();
   renderMobileSIM();
}

// ========== GESTION DES TARIFS ==========

function openTarifsModal() {
   // Charger le coût actuel de la SIM
   const input = document.getElementById('simPurchaseCost');
   if (input) {
       input.value = simPurchaseCost;
   }
   
   // Afficher la liste des forfaits
   renderListeForfaits();
   
   window.openModal('tarifsModal');
}

async function updateSimCost() {
   const input = document.getElementById('simPurchaseCost');
   const newCost = parseInt(input.value);
   
   if (isNaN(newCost) || newCost < 0) {
       window.showAlert('Veuillez entrer un prix valide', 'error');
       return;
   }
   
   try {
       simPurchaseCost = newCost;
       await saveSIMCosts();
       window.showAlert('Coût d\'achat SIM mis à jour avec succès', 'success');
   } catch (error) {
       console.error('Erreur lors de la mise à jour du coût:', error);
       window.showAlert('Erreur lors de la mise à jour du coût', 'error');
   }
}

function renderListeForfaits() {
   const container = document.getElementById('listeForfaits');
   if (!container) return;
   
   if (forfaitTypes.length === 0) {
       container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Aucun forfait défini</p>';
       return;
   }
   
   container.innerHTML = forfaitTypes.map(forfait => {
       // Vérifier si le forfait est utilisé
       const isUsed = checkForfaitUsage(forfait.id);
       
       return `
           <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
               <div class="flex-1">
                   <div class="flex items-center">
                       <i class="fas fa-wifi text-purple-600 mr-3"></i>
                       <div>
                           <div class="font-medium text-gray-900">${forfait.displayName}</div>
                           <div class="text-sm text-gray-600">${forfait.description} - ${forfait.duration} jours</div>
                       </div>
                   </div>
               </div>
               <div class="flex items-center space-x-3">
                   <span class="font-bold text-green-600">${window.formatCurrency(forfait.price)}</span>
                   <button 
                       onclick="editForfait('${forfait.id}')" 
                       class="text-yellow-600 hover:text-yellow-900"
                       title="Modifier"
                   >
                       <i class="fas fa-edit"></i>
                   </button>
                   <button 
                       onclick="supprimerForfait('${forfait.id}')" 
                       class="text-red-600 hover:text-red-900 ${isUsed ? 'opacity-50 cursor-not-allowed' : ''}"
                       ${isUsed ? 'disabled' : ''}
                       title="${isUsed ? 'Impossible de supprimer : forfait utilisé' : 'Supprimer ce forfait'}"
                   >
                       <i class="fas fa-trash-alt"></i>
                   </button>
               </div>
           </div>
       `;
   }).join('');
}

async function ajouterForfait() {
   const data = {
       id: document.getElementById('newForfaitId').value.trim().toLowerCase(),
       name: document.getElementById('newForfaitId').value.trim().toLowerCase(),
       displayName: document.getElementById('newForfaitName').value.trim(),
       description: document.getElementById('newForfaitDescription').value.trim(),
       duration: parseInt(document.getElementById('newForfaitDuration').value),
       price: parseInt(document.getElementById('newForfaitPrice').value)
   };
   
   // Validation
   if (!data.id || !data.displayName || !data.description || !data.duration || !data.price) {
       window.showAlert('Veuillez remplir tous les champs', 'error');
       return;
   }
   
   if (isNaN(data.duration) || data.duration < 1 || data.duration > 365) {
       window.showAlert('La durée doit être entre 1 et 365 jours', 'error');
       return;
   }
   
   if (isNaN(data.price) || data.price < 0) {
       window.showAlert('Le prix doit être un nombre positif', 'error');
       return;
   }
   
   // Vérifier l'unicité
   if (forfaitTypes.some(f => f.id === data.id)) {
       window.showAlert('Un forfait avec ce nom existe déjà', 'error');
       return;
   }
   
   try {
       forfaitTypes.push(data);
       await saveForfaitTypes();
       
       // Réinitialiser le formulaire
       document.getElementById('newForfaitId').value = '';
       document.getElementById('newForfaitName').value = '';
       document.getElementById('newForfaitDescription').value = '';
       document.getElementById('newForfaitDuration').value = '';
       document.getElementById('newForfaitPrice').value = '';
       
       renderListeForfaits();
       window.showAlert(`Forfait "${data.displayName}" ajouté avec succès`, 'success');
   } catch (error) {
       console.error('Erreur lors de l\'ajout du forfait:', error);
       window.showAlert('Erreur lors de l\'ajout du forfait', 'error');
   }
}

async function editForfait(forfaitId) {
   const forfait = forfaitTypes.find(f => f.id === forfaitId);
   if (!forfait) return;
   
   const newPrice = prompt(`Nouveau prix pour ${forfait.displayName} (actuellement ${window.formatCurrency(forfait.price)}):`, forfait.price);
   
   if (newPrice !== null) {
       const price = parseInt(newPrice);
       
       if (isNaN(price) || price < 0) {
           window.showAlert('Prix invalide', 'error');
           return;
       }
       
       try {
           forfait.price = price;
           await saveForfaitTypes();
           renderListeForfaits();
           window.showAlert('Prix du forfait mis à jour avec succès', 'success');
       } catch (error) {
           console.error('Erreur lors de la mise à jour du forfait:', error);
           window.showAlert('Erreur lors de la mise à jour du forfait', 'error');
       }
   }
}

async function supprimerForfait(forfaitId) {
   const forfait = forfaitTypes.find(f => f.id === forfaitId);
   if (!forfait) return;
   
   // Vérifier si le forfait est utilisé
   if (checkForfaitUsage(forfaitId)) {
       window.showAlert('Impossible de supprimer ce forfait : il est utilisé dans l\'historique', 'error');
       return;
   }
   
   if (confirm(`Êtes-vous sûr de vouloir supprimer le forfait "${forfait.displayName}" ?`)) {
       try {
           forfaitTypes = forfaitTypes.filter(f => f.id !== forfaitId);
           await saveForfaitTypes();
           renderListeForfaits();
           window.showAlert(`Forfait "${forfait.displayName}" supprimé avec succès`, 'success');
       } catch (error) {
           console.error('Erreur lors de la suppression du forfait:', error);
           window.showAlert('Erreur lors de la suppression du forfait', 'error');
       }
   }
}

function checkForfaitUsage(forfaitId) {
   // Vérifier dans les transactions si ce forfait a été utilisé
   return window.appData.transactions.some(t => 
       t.description && t.description.toLowerCase().includes(forfaitId.toLowerCase())
   );
}

// ========== GESTION DES OPÉRATEURS ==========

function openOperateursModal() {
   renderListeOperateurs();
   window.openModal('operateursModal');
}

function renderListeOperateurs() {
   const container = document.getElementById('listeOperateurs');
   if (!container) return;
   
   if (simOperators.length === 0) {
       container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Aucun opérateur défini</p>';
       return;
   }
   
   container.innerHTML = simOperators.map(operator => {
       const isUsed = window.appData.sim.some(sim => sim.operateur === operator.name);
       
       return `
           <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
               <div class="flex items-center">
                   <i class="fas fa-network-wired text-${operator.color}-600 mr-3"></i>
                   <span class="font-medium text-gray-900">${operator.name}</span>
                   ${isUsed ? '<span class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Utilisé</span>' : ''}
               </div>
               <button 
                   onclick="supprimerOperateur('${operator.id}')" 
                   class="text-red-600 hover:text-red-900 ${isUsed ? 'opacity-50 cursor-not-allowed' : ''}"
                   ${isUsed ? 'disabled' : ''}
                   title="${isUsed ? 'Impossible de supprimer : opérateur utilisé par des SIM' : 'Supprimer cet opérateur'}"
               >
                   <i class="fas fa-trash-alt"></i>
               </button>
           </div>
       `;
   }).join('');
}

async function ajouterOperateur() {
   const input = document.getElementById('nouvelOperateur');
   const name = input.value.trim();
   
   if (!name) {
       window.showAlert('Veuillez saisir un nom d\'opérateur', 'error');
       return;
   }
   
   if (name.length > 20) {
       window.showAlert('Le nom de l\'opérateur ne peut pas dépasser 20 caractères', 'error');
       return;
   }
   
   // Vérifier l'unicité
   if (simOperators.some(op => op.name.toLowerCase() === name.toLowerCase())) {
       window.showAlert('Cet opérateur existe déjà', 'error');
       return;
   }
   
   try {
       const newOperator = {
           id: name.toLowerCase().replace(/\s+/g, '_'),
           name: name,
           color: getRandomColor()
       };
       
       simOperators.push(newOperator);
       await saveSIMOperators();
       
       input.value = '';
       renderListeOperateurs();
       populateOperatorFilters();
       populateOperatorOptions();
       window.showAlert(`Opérateur "${name}" ajouté avec succès`, 'success');
   } catch (error) {
       console.error('Erreur lors de l\'ajout de l\'opérateur:', error);
       window.showAlert('Erreur lors de l\'ajout de l\'opérateur', 'error');
   }
}

async function supprimerOperateur(operatorId) {
   const operator = simOperators.find(op => op.id === operatorId);
   if (!operator) return;
   
   // Vérifier si l'opérateur est utilisé
   const isUsed = window.appData.sim.some(sim => sim.operateur === operator.name);
   
   if (isUsed) {
       window.showAlert('Impossible de supprimer cet opérateur : il est utilisé par des SIM', 'error');
       return;
   }
   
   if (confirm(`Êtes-vous sûr de vouloir supprimer l'opérateur "${operator.name}" ?`)) {
       try {
           simOperators = simOperators.filter(op => op.id !== operatorId);
           await saveSIMOperators();
           
           renderListeOperateurs();
           populateOperatorFilters();
           populateOperatorOptions();
           window.showAlert(`Opérateur "${operator.name}" supprimé avec succès`, 'success');
       } catch (error) {
           console.error('Erreur lors de la suppression de l\'opérateur:', error);
           window.showAlert('Erreur lors de la suppression de l\'opérateur', 'error');
       }
   }
}

function getRandomColor() {
   const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'];
   return colors[Math.floor(Math.random() * colors.length)];
}

// Mettre à jour la fonction pour générer les options de forfaits
function generateForfaitOptions() {
   const container = document.getElementById('forfaitTypesContainer');
   if (!container) return;
   
   if (forfaitTypes.length === 0) {
       container.innerHTML = '<p class="text-gray-500 text-sm">Aucun forfait disponible. Veuillez en ajouter via "Gérer Tarifs".</p>';
       return;
   }
   
   container.innerHTML = forfaitTypes.map((forfait, index) => `
       <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
           <input type="radio" name="typeForfait" value="${forfait.id}" class="mr-3" ${index === 0 ? 'checked' : ''} onchange="updateForfaitCost()">
           <div class="flex-1">
               <div class="font-medium text-gray-900">${forfait.displayName}</div>
               <div class="text-sm text-gray-600">${forfait.description}</div>
           </div>
           <div class="text-green-600 font-bold">${window.formatCurrency(forfait.price)}</div>
       </label>
   `).join('');
}

// Ajouter les fonctions Firebase dans app.js si pas déjà présentes
if (typeof window.saveSIMToFirebase === 'undefined') {
   window.saveSIMToFirebase = async function(sim) {
       return await window.saveToFirebase('sim', sim);
   };
}

if (typeof window.deleteSIMFromFirebase === 'undefined') {
   window.deleteSIMFromFirebase = async function(simId) {
       return await window.deleteFromFirebase('sim', simId);
   };
}