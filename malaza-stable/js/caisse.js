// Module Caisse - Version Centralisée
console.log('Module Caisse - Version Centralisée chargé');

// Types de transactions détaillés
const TRANSACTION_TYPES = {
    // Revenus
    REVENU_LOCATION: 'revenu_location',
    REVENU_MANUEL: 'revenu_manuel',
    
    // Dépenses
    DEPENSE_SIM: 'depense_sim',
    DEPENSE_FORFAIT: 'depense_forfait',
    DEPENSE_MANUEL: 'depense_manuel',
    DEPENSE_AUTO: 'depense_auto'
};

// Messages de suppression
const DELETE_MESSAGES = {
    [TRANSACTION_TYPES.DEPENSE_SIM]: 'Attention ! Cela supprimera aussi la SIM {linkedId}',
    [TRANSACTION_TYPES.DEPENSE_FORFAIT]: 'Attention ! Cela annulera le forfait de la SIM {linkedId}',
    [TRANSACTION_TYPES.REVENU_LOCATION]: 'Attention ! Cela supprimera le paiement {linkedId}'
};

function getCaisseHTML() {
    return `
        <div class="space-y-4 sm:space-y-6 fade-in">
            <!-- En-tête -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Gestion de la Caisse</h1>
                    <p class="text-gray-600 text-sm sm:text-base">Centre de toutes les transactions</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="openTransactionModal('depense')" class="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base">
                        <i class="fas fa-minus-circle mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Nouvelle</span> Dépense
                    </button>
                    <button onclick="openTransactionModal('revenu')" class="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                        <i class="fas fa-plus-circle mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Nouveau</span> Revenu
                    </button>
                </div>
            </div>

            <!-- Vue d'ensemble de la caisse -->
            <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Soldes actuels</h3>
                <div id="caisseBalances" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <!-- Soldes générés dynamiquement -->
                </div>
            </div>

            <!-- Statistiques -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-full">
                            <i class="fas fa-arrow-down text-green-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Entrées du jour</p>
                            <p class="text-lg sm:text-xl font-bold text-green-600" id="entreesJour">0 Ar</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-red-100 rounded-full">
                            <i class="fas fa-arrow-up text-red-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Sorties du jour</p>
                            <p class="text-lg sm:text-xl font-bold text-red-600" id="sortiesJour">0 Ar</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 rounded-full">
                            <i class="fas fa-balance-scale text-blue-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Balance du jour</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="balanceJour">0 Ar</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-purple-100 rounded-full">
                            <i class="fas fa-chart-line text-purple-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Balance du mois</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="balanceMois">0 Ar</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtres -->
            <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                    <div class="flex items-center space-x-2">
                        <label class="text-xs sm:text-sm font-medium text-gray-700">Type:</label>
                        <select id="filterTypeTransaction" onchange="filterTransactions()" class="border rounded-md px-2 py-1 text-xs sm:text-sm">
                            <option value="">Tous</option>
                            <option value="revenu">Tous les revenus</option>
                            <option value="revenu_location">Paiements locations</option>
                            <option value="revenu_manuel">Revenus manuels</option>
                            <option value="depense">Toutes les dépenses</option>
                            <option value="depense_sim">Achats SIM</option>
                            <option value="depense_forfait">Achats forfaits</option>
                            <option value="depense_manuel">Dépenses manuelles</option>
                        </select>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="text-xs sm:text-sm font-medium text-gray-700">Catégorie:</label>
                        <select id="filterCategorie" onchange="filterTransactions()" class="border rounded-md px-2 py-1 text-xs sm:text-sm">
                            <option value="">Toutes</option>
                            <!-- Options générées dynamiquement -->
                        </select>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="text-xs sm:text-sm font-medium text-gray-700">Méthode:</label>
                        <select id="filterMethodeTransaction" onchange="filterTransactions()" class="border rounded-md px-2 py-1 text-xs sm:text-sm">
                            <option value="">Toutes</option>
                            <!-- Options générées dynamiquement -->
                        </select>
                    </div>
                    <button onclick="resetTransactionFilters()" class="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
                        <i class="fas fa-undo mr-1"></i>
                        Réinitialiser
                    </button>
                </div>
            </div>

            <!-- Tableau des transactions (Desktop) -->
            <div class="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-gray-900">Historique des transactions</h3>
                    <button onclick="exportTransactions()" class="text-green-600 hover:text-green-800 text-sm">
                        <i class="fas fa-download mr-1"></i>
                        Exporter
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="transactionsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Contenu généré dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Cards des transactions (Mobile) -->
            <div class="lg:hidden">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-base font-medium text-gray-900">Transactions</h3>
                    <button onclick="exportTransactions()" class="text-green-600 hover:text-green-800 text-sm">
                        <i class="fas fa-download mr-1"></i>
                        Export
                    </button>
                </div>
                <div id="mobileTransactionsContainer" class="space-y-3">
                    <!-- Cards générées dynamiquement -->
                </div>
            </div>
        </div>

        <!-- Modal Transaction Manuelle -->
        <div id="transactionModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900" id="transactionModalTitle">Nouvelle Transaction</h3>
                    <button onclick="closeModal('transactionModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="transactionForm">
                    <input type="hidden" id="transactionType" name="type">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <input 
                                type="text" 
                                name="description" 
                                id="transactionDescription"
                                required 
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: Achat fournitures bureau"
                            >
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                            <select 
                                name="categorie" 
                                id="transactionCategorie"
                                required 
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <!-- Options générées dynamiquement selon le type -->
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Montant *</label>
                            <div class="relative">
                                <input 
                                    type="number" 
                                    name="montant" 
                                    id="transactionMontant"
                                    required
                                    min="1"
                                    class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                                    placeholder="0"
                                >
                                <span class="absolute right-3 top-3 text-gray-500">Ar</span>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement *</label>
                            <div class="space-y-2" id="transactionMethodeContainer">
                                <!-- Options générées dynamiquement -->
                            </div>
                        </div>
                        
                        <!-- Vérification du solde pour les dépenses -->
                        <div id="soldeVerificationTransaction" class="hidden">
                            <div class="bg-gray-50 p-3 rounded">
                                <div class="space-y-1 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Solde actuel:</span>
                                        <span class="font-medium" id="currentSoldeTransaction">0 Ar</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Montant:</span>
                                        <span class="font-medium" id="montantTransactionDisplay">0 Ar</span>
                                    </div>
                                    <div class="flex justify-between border-t pt-1">
                                        <span class="text-gray-600">Solde après:</span>
                                        <span class="font-medium" id="afterTransactionBalance">0 Ar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="transactionFundsWarning" class="hidden bg-red-50 border border-red-200 rounded p-3">
                            <div class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                                <p class="text-red-800 text-sm">Fonds insuffisants pour cette méthode de paiement</p>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input 
                                type="date" 
                                name="date" 
                                id="transactionDate"
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea 
                                name="notes" 
                                id="transactionNotes"
                                rows="2"
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Notes optionnelles..."
                            ></textarea>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                            <button 
                                type="submit" 
                                id="transactionSubmitBtn"
                                class="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <i class="fas fa-save mr-2"></i>
                                Enregistrer
                            </button>
                            <button 
                                type="button" 
                                onclick="closeModal('transactionModal')" 
                                class="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Catégories disponibles
const CATEGORIES = {
    revenu: [
        'Location GPS',
        'Vente matériel',
        'Autre revenu'
    ],
    depense: [
        'Achat cartes SIM',
        'Forfait SIM',
        'Fournitures bureau',
        'Maintenance',
        'Transport',
        'Salaire',
        'Loyer',
        'Électricité',
        'Internet',
        'Publicité',
        'Autre dépense'
    ]
};

async function initCaisse() {
    console.log('Initialisation du module Caisse - Version Centralisée');
    
    // Afficher les soldes
    updateCaisseBalances();
    
    // Charger les données
    updateCaisseStats();
    populateCategoriesFilter();
    populateMethodesFilter();
    renderTransactionsTable();
    renderMobileTransactions();
    
    // Initialiser le formulaire
    setupTransactionForm();
    
    // Écouter les changements en temps réel
    listenToCaisseChanges();
}

// Écouter les changements en temps réel depuis Firebase
function listenToCaisseChanges() {
    if (!window.firebaseDB) {
        console.error('Firebase DB non initialisé');
        setTimeout(() => {
            listenToCaisseChanges();
        }, 1000);
        return;
    }
    
    // Écouter les changements sur les transactions
    window.firebaseDB.collection('transactions').onSnapshot((snapshot) => {
        console.log('Changements détectés dans les transactions');
        
        // Mettre à jour le cache local
        window.appData.transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Rafraîchir l'affichage
        renderTransactionsTable();
        renderMobileTransactions();
        updateCaisseStats();
        populateCategoriesFilter();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements transactions:', error);
    });
    
    // Écouter les changements sur la caisse
    window.firebaseDB.collection('settings').doc('caisse').onSnapshot((doc) => {
        if (doc.exists) {
            window.appData.caisse = doc.data();
            updateCaisseBalances();
        }
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements caisse:', error);
    });
}

function setupTransactionForm() {
    const form = document.getElementById('transactionForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Ajouter la méthode de paiement depuis le radio button sélectionné
            const selectedPaymentMethod = document.querySelector('input[name="methodeTransaction"]:checked');
            if (selectedPaymentMethod) {
                data.methode = selectedPaymentMethod.value;
            }
            
            await handleTransactionSubmit(data);
        });
    }
    
    // Date par défaut = aujourd'hui
    document.getElementById('transactionDate').value = window.getCurrentDate();
}

function updateCaisseBalances() {
    const container = document.getElementById('caisseBalances');
    if (!container) return;
    
    const methods = window.getAvailablePaymentMethods();
    
    container.innerHTML = methods.map(method => {
        const balance = window.getPaymentMethodBalance(method.id);
        return `
            <div class="text-center p-4 bg-${method.color}-50 rounded-lg">
                <i class="fas fa-${method.icon} text-${method.color}-600 text-2xl mb-2"></i>
                <p class="text-sm text-gray-600">${method.name}</p>
                <p class="text-xl font-bold text-${method.color}-600">${window.formatCurrency(balance)}</p>
            </div>
        `;
    }).join('');
    
    // Ajouter le total
    container.innerHTML += `
        <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-wallet text-gray-600 text-2xl mb-2"></i>
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-xl font-bold text-gray-900">${window.formatCurrency(window.appData.caisse.total)}</p>
        </div>
    `;
}

function updateCaisseStats() {
    const today = window.getCurrentDate();
    const thisMonth = new Date();
    
    // Filtrer les transactions du jour
    const transactionsJour = window.appData.transactions.filter(t => t.date === today);
    const entreesJour = transactionsJour
        .filter(t => t.type.startsWith('revenu'))
        .reduce((sum, t) => sum + t.montant, 0);
    const sortiesJour = transactionsJour
        .filter(t => t.type.startsWith('depense'))
        .reduce((sum, t) => sum + t.montant, 0);
    
    // Filtrer les transactions du mois
    const transactionsMois = window.appData.transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === thisMonth.getMonth() && 
               tDate.getFullYear() === thisMonth.getFullYear();
    });
    const entreesMois = transactionsMois
        .filter(t => t.type.startsWith('revenu'))
        .reduce((sum, t) => sum + t.montant, 0);
    const sortiesMois = transactionsMois
        .filter(t => t.type.startsWith('depense'))
        .reduce((sum, t) => sum + t.montant, 0);
    
    // Mettre à jour les éléments
    document.getElementById('entreesJour').textContent = window.formatCurrency(entreesJour);
    document.getElementById('sortiesJour').textContent = window.formatCurrency(sortiesJour);
    document.getElementById('balanceJour').textContent = window.formatCurrency(entreesJour - sortiesJour);
    document.getElementById('balanceMois').textContent = window.formatCurrency(entreesMois - sortiesMois);
}

function populateCategoriesFilter() {
    const filter = document.getElementById('filterCategorie');
    if (!filter) return;
    
    // Obtenir toutes les catégories utilisées
    const categories = [...new Set(window.appData.transactions.map(t => t.categorie))];
    
    filter.innerHTML = '<option value="">Toutes</option>';
    categories.sort().forEach(cat => {
        filter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

function populateMethodesFilter() {
    const filter = document.getElementById('filterMethodeTransaction');
    if (!filter) return;
    
    const methods = window.getAvailablePaymentMethods();
    
    filter.innerHTML = '<option value="">Toutes</option>';
    methods.forEach(method => {
        filter.innerHTML += `<option value="${method.name}">${method.name}</option>`;
    });
}

function openTransactionModal(type) {
    const modal = document.getElementById('transactionModal');
    const title = document.getElementById('transactionModalTitle');
    const typeInput = document.getElementById('transactionType');
    const categorieSelect = document.getElementById('transactionCategorie');
    
    // Réinitialiser le formulaire
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionDate').value = window.getCurrentDate();
    
    // Configurer selon le type
    typeInput.value = type === 'depense' ? TRANSACTION_TYPES.DEPENSE_MANUEL : TRANSACTION_TYPES.REVENU_MANUEL;
    
    if (type === 'depense') {
        title.textContent = 'Nouvelle Dépense';
        title.className = 'text-lg font-semibold text-red-600';
    } else {
        title.textContent = 'Nouveau Revenu';
        title.className = 'text-lg font-semibold text-green-600';
    }
    
    // Peupler les catégories
    const categories = CATEGORIES[type] || [];
    categorieSelect.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');
    
    // Générer les méthodes de paiement
    generateTransactionPaymentMethods();
    
    // Masquer la vérification du solde au début
    document.getElementById('soldeVerificationTransaction').classList.add('hidden');
    document.getElementById('transactionFundsWarning').classList.add('hidden');
    
    // Écouter les changements de montant
    const montantInput = document.getElementById('transactionMontant');
    montantInput.removeEventListener('input', updateTransactionBalance);
    montantInput.addEventListener('input', updateTransactionBalance);
    
    window.openModal('transactionModal');
}

function generateTransactionPaymentMethods() {
    const container = document.getElementById('transactionMethodeContainer');
    if (container) {
        container.innerHTML = window.generatePaymentMethodRadios('methodeTransaction', null, 'updateTransactionBalance');
    }
}

function updateTransactionBalance() {
    const type = document.getElementById('transactionType').value;
    const selectedMethodInput = document.querySelector('input[name="methodeTransaction"]:checked');
    const montant = parseInt(document.getElementById('transactionMontant').value) || 0;
    
    if (!selectedMethodInput || montant <= 0) {
        document.getElementById('soldeVerificationTransaction').classList.add('hidden');
        return;
    }
    
    const selectedMethodId = selectedMethodInput.value.toLowerCase();
    const currentSolde = window.getPaymentMethodBalance(selectedMethodId);
    
    // Afficher la vérification du solde
    document.getElementById('currentSoldeTransaction').textContent = window.formatCurrency(currentSolde);
    document.getElementById('montantTransactionDisplay').textContent = window.formatCurrency(montant);
    
    if (type.startsWith('depense')) {
        // Pour les dépenses
        document.getElementById('afterTransactionBalance').textContent = window.formatCurrency(currentSolde - montant);
        document.getElementById('soldeVerificationTransaction').classList.remove('hidden');
        
        const warningDiv = document.getElementById('transactionFundsWarning');
        const submitBtn = document.getElementById('transactionSubmitBtn');
        
        if (currentSolde < montant) {
            warningDiv.classList.remove('hidden');
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            warningDiv.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    } else {
        // Pour les revenus
        document.getElementById('afterTransactionBalance').textContent = window.formatCurrency(currentSolde + montant);
        document.getElementById('soldeVerificationTransaction').classList.remove('hidden');
        document.getElementById('transactionFundsWarning').classList.add('hidden');
    }
}

async function handleTransactionSubmit(data) {
    // Validation
    if (!data.description || !data.categorie || !data.montant || !data.methode) {
        window.showAlert('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    const montant = parseInt(data.montant);
    if (montant <= 0) {
        window.showAlert('Le montant doit être supérieur à 0', 'error');
        return;
    }
    
    try {
        // Désactiver le bouton pendant la sauvegarde
        const submitBtn = document.getElementById('transactionSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enregistrement...';
        
        // Créer la transaction
        const transaction = {
            id: window.generateId('TXN', window.appData.transactions),
            type: data.type,
            description: data.description,
            categorie: data.categorie,
            montant: montant,
            methode: data.methode,
            date: data.date || window.getCurrentDate(),
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            canDelete: true
        };
        
        // Mettre à jour la caisse
        const methodId = data.methode.toLowerCase();
        const amount = data.type.startsWith('revenu') ? montant : -montant;
        
        if (!await window.updatePaymentMethodBalance(methodId, amount)) {
            window.showAlert('Erreur lors de la mise à jour de la caisse', 'error');
            return;
        }
        
        // Sauvegarder la transaction
        await window.saveToFirebase('transactions', transaction);
        
        window.closeModal('transactionModal');
        window.showAlert('Transaction enregistrée avec succès', 'success');
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la transaction:', error);
        window.showAlert('Erreur lors de la sauvegarde de la transaction', 'error');
    } finally {
        // Réactiver le bouton
        const submitBtn = document.getElementById('transactionSubmitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Enregistrer';
    }
}

// ========== FONCTIONS CENTRALISÉES POUR LES AUTRES MODULES ==========

// Créer une transaction d'achat de SIM
async function createSIMPurchaseTransaction(data) {
    const transaction = {
        id: window.generateId('TXN', window.appData.transactions),
        type: TRANSACTION_TYPES.DEPENSE_SIM,
        description: `Achat SIM ${data.simId}`,
        categorie: 'Achat cartes SIM',
        montant: data.montant,
        methode: data.methode,
        date: data.date || window.getCurrentDate(),
        notes: `SIM ${data.operateur}`,
        linkedType: 'sim',
        linkedId: data.simId,
        canDelete: true,
        deleteConsequences: `Supprimera la SIM ${data.simId}`,
        createdAt: new Date().toISOString()
    };
    
    await window.saveToFirebase('transactions', transaction);
    return transaction;
}

// Créer une transaction d'achat de forfait
async function createForfaitPurchaseTransaction(data) {
    const transaction = {
        id: window.generateId('TXN', window.appData.transactions),
        type: TRANSACTION_TYPES.DEPENSE_FORFAIT,
        description: `${data.forfaitName} - SIM ${data.simId}`,
        categorie: 'Forfait SIM',
        montant: data.montant,
        methode: data.methode,
        date: data.date || window.getCurrentDate(),
        notes: `${data.operateur} - Début: ${data.dateDebut} - Fin: ${data.dateFin}`,
        linkedType: 'forfait',
        linkedId: data.simId,
        forfaitInfo: {
            dateDebut: data.dateDebut,
            dateFin: data.dateFin,
            forfaitType: data.forfaitType
        },
        canDelete: true,
        deleteConsequences: `Annulera le forfait de la SIM ${data.simId}`,
        createdAt: new Date().toISOString()
    };
    
    await window.saveToFirebase('transactions', transaction);
    return transaction;
}

// Créer une transaction de paiement location
async function createLocationPaymentTransaction(data) {
    const transaction = {
        id: window.generateId('TXN', window.appData.transactions),
        type: TRANSACTION_TYPES.REVENU_LOCATION,
        description: `Paiement location ${data.locationId}`,
        categorie: 'Location GPS',
        montant: data.montant,
        methode: data.methode,
        date: data.date || window.getCurrentDate(),
        notes: `${data.mois} mois - ${data.clientNom}`,
        linkedType: 'paiement',
        linkedId: data.paiementId,
        locationId: data.locationId,
        clientId: data.clientId,
        canDelete: true,
        deleteConsequences: `Supprimera le paiement ${data.paiementId}`,
        createdAt: new Date().toISOString()
    };
    
    await window.saveToFirebase('transactions', transaction);
    return transaction;
}

// Fonction de suppression intelligente
async function deleteTransaction(transactionId) {
    const transaction = window.appData.transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    // Déterminer le message de confirmation
    let confirmMessage = `Êtes-vous sûr de vouloir supprimer cette transaction de ${window.formatCurrency(transaction.montant)} ?`;
    
    // Ajouter les conséquences si nécessaire
    if (transaction.deleteConsequences) {
        confirmMessage += `\n\n⚠️ ${transaction.deleteConsequences}`;
    }
    
    // Vérifier les cas spéciaux
    if (transaction.linkedType === 'sim') {
        // Vérifier si la SIM est utilisée
        const simInUse = window.appData.locations.some(l => 
            l.simId === transaction.linkedId && l.statut === 'en cours'
        );
        
        if (simInUse) {
            window.showAlert('Impossible de supprimer : cette SIM est utilisée dans une location active', 'error');
            return;
        }
    }
    
    if (confirm(confirmMessage)) {
        try {
            window.showAlert('Suppression en cours...', 'info');
            
            // Annuler la transaction dans la caisse
            const methodId = transaction.methode.toLowerCase();
            const amount = transaction.type.startsWith('revenu') ? -transaction.montant : transaction.montant;
            
            if (!await window.updatePaymentMethodBalance(methodId, amount)) {
                window.showAlert('Erreur lors de la mise à jour de la caisse', 'error');
                return;
            }
            
            // Gérer les suppressions liées selon le type
            if (transaction.linkedType && transaction.linkedId) {
                await handleLinkedDeletion(transaction);
            }
            
            // Supprimer la transaction
            await window.deleteFromFirebase('transactions', transactionId);
            
            window.showAlert('Transaction supprimée avec succès', 'success');
            
        } catch (error) {
            console.error('Erreur lors de la suppression de la transaction:', error);
            window.showAlert('Erreur lors de la suppression de la transaction', 'error');
        }
    }
}

// Gérer les suppressions liées
async function handleLinkedDeletion(transaction) {
    switch (transaction.linkedType) {
        case 'sim':
            // Supprimer la SIM
            if (transaction.type === TRANSACTION_TYPES.DEPENSE_SIM) {
                await window.deleteFromFirebase('sim', transaction.linkedId);
            }
            break;
            
        case 'forfait':
            // Annuler le forfait de la SIM
            if (transaction.type === TRANSACTION_TYPES.DEPENSE_FORFAIT) {
                const sim = window.appData.sim.find(s => s.id === transaction.linkedId);
                if (sim) {
                    sim.dateExpiration = null;
                    sim.statut = 'Inactive';
                    sim.forfait = null;
                    sim.prixForfait = null;
                    await window.saveToFirebase('sim', sim);
                }
            }
            break;
            
        case 'paiement':
            // Supprimer le paiement
            if (transaction.type === TRANSACTION_TYPES.REVENU_LOCATION) {
                await window.deleteFromFirebase('paiements', transaction.linkedId);
            }
            break;
    }
}

function renderTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    let transactionsToShow = [...window.appData.transactions];
    
    // Appliquer les filtres
    const filterType = document.getElementById('filterTypeTransaction')?.value;
    const filterCategorie = document.getElementById('filterCategorie')?.value;
    const filterMethode = document.getElementById('filterMethodeTransaction')?.value;
    
    if (filterType) {
        if (filterType === 'revenu') {
            transactionsToShow = transactionsToShow.filter(t => t.type.startsWith('revenu'));
        } else if (filterType === 'depense') {
            transactionsToShow = transactionsToShow.filter(t => t.type.startsWith('depense'));
        } else {
            transactionsToShow = transactionsToShow.filter(t => t.type === filterType);
        }
    }
    
    if (filterCategorie) {
        transactionsToShow = transactionsToShow.filter(t => t.categorie === filterCategorie);
    }
    
    if (filterMethode) {
        transactionsToShow = transactionsToShow.filter(t => t.methode === filterMethode);
    }
    
    // Trier par date décroissante
    transactionsToShow.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (transactionsToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-exchange-alt text-4xl mb-2"></i>
                    <p>Aucune transaction trouvée</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = transactionsToShow.map(transaction => {
        const isRevenu = transaction.type.startsWith('revenu');
        const amountClass = isRevenu ? 'text-green-600' : 'text-red-600';
        const typeIcon = isRevenu ? 'arrow-down' : 'arrow-up';
        const typeClass = isRevenu ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        
        // Déterminer le label du type
        let typeLabel = isRevenu ? 'Revenu' : 'Dépense';
        if (transaction.type === TRANSACTION_TYPES.REVENU_LOCATION) typeLabel = 'Paiement Location';
        if (transaction.type === TRANSACTION_TYPES.DEPENSE_SIM) typeLabel = 'Achat SIM';
        if (transaction.type === TRANSACTION_TYPES.DEPENSE_FORFAIT) typeLabel = 'Achat Forfait';
        
        // Icône de verrouillage pour les transactions liées
        const lockIcon = transaction.linkedType ? 
            `<i class="fas fa-link text-gray-400 ml-1" title="Transaction liée"></i>` : '';
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${window.formatDate(transaction.date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${typeClass}">
                        <i class="fas fa-${typeIcon} mr-1"></i>
                        ${typeLabel}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${transaction.description} ${lockIcon}</div>
                    ${transaction.notes ? `<div class="text-xs text-gray-500">${transaction.notes}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${transaction.categorie}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${transaction.methode}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold ${amountClass}">
                        ${isRevenu ? '+' : '-'}${window.formatCurrency(transaction.montant)}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${transaction.canDelete !== false ? `
                        <button 
                            onclick="deleteTransaction('${transaction.id}')" 
                            class="text-red-600 hover:text-red-900" 
                            title="${transaction.deleteConsequences || 'Supprimer'}"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    ` : `
                        <span class="text-gray-400" title="Transaction protégée">
                            <i class="fas fa-lock"></i>
                        </span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

function renderMobileTransactions() {
    const container = document.getElementById('mobileTransactionsContainer');
    if (!container) return;
    
    let transactionsToShow = [...window.appData.transactions];
    
    // Appliquer les filtres
    const filterType = document.getElementById('filterTypeTransaction')?.value;
    const filterCategorie = document.getElementById('filterCategorie')?.value;
    const filterMethode = document.getElementById('filterMethodeTransaction')?.value;
    
    if (filterType) {
        if (filterType === 'revenu') {
            transactionsToShow = transactionsToShow.filter(t => t.type.startsWith('revenu'));
        } else if (filterType === 'depense') {
            transactionsToShow = transactionsToShow.filter(t => t.type.startsWith('depense'));
        } else {
            transactionsToShow = transactionsToShow.filter(t => t.type === filterType);
        }
    }
    
    if (filterCategorie) {
        transactionsToShow = transactionsToShow.filter(t => t.categorie === filterCategorie);
    }
    
    if (filterMethode) {
        transactionsToShow = transactionsToShow.filter(t => t.methode === filterMethode);
    }
    
    // Trier par date décroissante
    transactionsToShow.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (transactionsToShow.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-lg">
                <i class="fas fa-exchange-alt text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Aucune transaction trouvée</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactionsToShow.map(transaction => {
        const isRevenu = transaction.type.startsWith('revenu');
        const bgColor = isRevenu ? 'bg-green-50' : 'bg-red-50';
        const iconColor = isRevenu ? 'text-green-600' : 'text-red-600';
        const icon = isRevenu ? 'arrow-down' : 'arrow-up';
        const amountColor = isRevenu ? 'text-green-600' : 'text-red-600';
        
        // Badge pour les transactions liées
        let typeBadge = '';
        if (transaction.type === TRANSACTION_TYPES.REVENU_LOCATION) {
            typeBadge = '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Location</span>';
        } else if (transaction.type === TRANSACTION_TYPES.DEPENSE_SIM) {
            typeBadge = '<span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Achat SIM</span>';
        } else if (transaction.type === TRANSACTION_TYPES.DEPENSE_FORFAIT) {
            typeBadge = '<span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Forfait</span>';
        }
        
        return `
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                        <div class="p-2 rounded-full ${bgColor} mr-3">
                            <i class="fas fa-${icon} ${iconColor}"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">${transaction.description}</h4>
                            <p class="text-sm text-gray-500">${transaction.categorie}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold ${amountColor}">
                            ${isRevenu ? '+' : '-'}${window.formatCurrency(transaction.montant)}
                        </p>
                        <p class="text-xs text-gray-500">${transaction.methode}</p>
                    </div>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center space-x-2">
                        <span>${window.formatDate(transaction.date)}</span>
                        ${typeBadge}
                    </div>
                    ${transaction.canDelete !== false ? `
                        <button 
                            onclick="deleteTransaction('${transaction.id}')" 
                            class="text-red-600 hover:text-red-900"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    ` : `
                        <span class="text-gray-400">
                            <i class="fas fa-lock"></i>
                        </span>
                    `}
                </div>
                ${transaction.notes ? `
                    <div class="mt-2 text-xs text-gray-600 italic">
                        ${transaction.notes}
                    </div>
                ` : ''}
                ${transaction.deleteConsequences ? `
                    <div class="mt-2 text-xs text-orange-600">
                        <i class="fas fa-exclamation-triangle mr-1"></i>
                        ${transaction.deleteConsequences}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function filterTransactions() {
    renderTransactionsTable();
    renderMobileTransactions();
}

function resetTransactionFilters() {
    document.getElementById('filterTypeTransaction').value = '';
    document.getElementById('filterCategorie').value = '';
    document.getElementById('filterMethodeTransaction').value = '';
    renderTransactionsTable();
    renderMobileTransactions();
}

function exportTransactions() {
    try {
        // Préparer les données pour l'export
        const exportData = window.appData.transactions.map(t => ({
            'Date': t.date,
            'Type': t.type.startsWith('revenu') ? 'Revenu' : 'Dépense',
            'Description': t.description,
            'Catégorie': t.categorie,
            'Méthode': t.methode,
            'Montant': t.montant,
            'Notes': t.notes || ''
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
        link.download = `transactions-${window.getCurrentDate()}.csv`;
        link.click();
        
        window.showAlert('Export des transactions réussi', 'success');
        
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        window.showAlert('Erreur lors de l\'export', 'error');
    }
}

// Exposer les fonctions globales pour les autres modules
window.caisseManager = {
    createSIMPurchaseTransaction,
    createForfaitPurchaseTransaction,
    createLocationPaymentTransaction,
    deleteTransaction,
    TRANSACTION_TYPES
};