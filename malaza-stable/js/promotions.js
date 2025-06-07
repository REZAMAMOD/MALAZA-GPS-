// Module Promotions
console.log('Module Promotions chargé');

function getPromotionsHTML() {
    return `
        <div class="space-y-6 fade-in">
            <!-- En-tête -->
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Gestion des Promotions</h1>
                    <p class="text-gray-600">Créez et gérez vos codes promotionnels</p>
                </div>
                <button onclick="openPromotionModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-plus mr-2"></i>
                    Nouvelle Promotion
                </button>
            </div>

            <!-- Statistiques -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 rounded-full">
                            <i class="fas fa-tags text-blue-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-gray-600">Total Promotions</p>
                            <p class="text-xl font-bold text-gray-900" id="totalPromotions">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-full">
                            <i class="fas fa-check-circle text-green-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-gray-600">Actives</p>
                            <p class="text-xl font-bold text-gray-900" id="promotionsActives">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-orange-100 rounded-full">
                            <i class="fas fa-users text-orange-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-gray-600">Utilisations</p>
                            <p class="text-xl font-bold text-gray-900" id="totalUsages">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-purple-100 rounded-full">
                            <i class="fas fa-money-bill-wave text-purple-600"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-gray-600">Économies clients</p>
                            <p class="text-xl font-bold text-gray-900" id="totalSavings">0 Ar</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Liste des promotions -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Liste des promotions</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valeur</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="promotionsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Contenu généré dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Promotion -->
        <div id="promotionModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-6 w-full max-w-md">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Nouvelle Promotion</h3>
                    <button onclick="closeModal('promotionModal')" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="promotionForm">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                            <input type="text" name="code" required class="w-full p-2 border rounded-lg" placeholder="NOEL2024">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <input type="text" name="description" required class="w-full p-2 border rounded-lg" placeholder="Promotion Noël -50%">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                            <select name="type" required class="w-full p-2 border rounded-lg">
                                <option value="pourcentage">Pourcentage</option>
                                <option value="montant">Montant fixe</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Valeur *</label>
                            <input type="number" name="valeur" required min="0" class="w-full p-2 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
                            <input type="date" name="dateDebut" required class="w-full p-2 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date fin *</label>
                            <input type="date" name="dateFin" required class="w-full p-2 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Usage maximum</label>
                            <input type="number" name="usageMax" min="0" class="w-full p-2 border rounded-lg" placeholder="Laisser vide pour illimité">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
                            <textarea name="conditions" rows="2" class="w-full p-2 border rounded-lg" placeholder="Ex: Nouveaux clients uniquement"></textarea>
                        </div>
                        <div class="flex space-x-3 pt-4">
                            <button type="submit" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                Créer
                            </button>
                            <button type="button" onclick="closeModal('promotionModal')" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                                Annuler
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}

async function initPromotions() {
    console.log('Initialisation du module Promotions');
    
    // Charger les promotions
    await loadPromotions();
    
    // Afficher les stats et la table
    updatePromotionsStats();
    renderPromotionsTable();
    
    // Setup du formulaire
    setupPromotionForm();
    
    // Écouter les changements en temps réel
    listenToPromotionsChanges();
}

// Écouter les changements en temps réel depuis Firebase
function listenToPromotionsChanges() {
    if (!window.firebaseDB) {
        console.error('Firebase DB non initialisé');
        setTimeout(() => {
            listenToPromotionsChanges();
        }, 1000);
        return;
    }
    
    // Écouter les changements sur la collection promotions
    window.firebaseDB.collection('promotions').onSnapshot((snapshot) => {
        console.log('Changements détectés dans les promotions');
        
        // Mettre à jour le cache local
        window.appData.promotions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Rafraîchir l'affichage
        updatePromotionsStats();
        renderPromotionsTable();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements promotions:', error);
    });
}

async function loadPromotions() {
    try {
        const snapshot = await window.firebaseDB.collection('promotions').get();
        window.appData.promotions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Erreur lors du chargement des promotions:', error);
        window.appData.promotions = [];
    }
}

function setupPromotionForm() {
    const form = document.getElementById('promotionForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            await handlePromotionSubmit(data);
        });
    }
}

async function handlePromotionSubmit(data) {
    try {
        const promotion = {
            id: window.generateId('PROMO', window.appData.promotions || []),
            code: data.code.toUpperCase(),
            description: data.description,
            type: data.type,
            valeur: parseFloat(data.valeur),
            dateDebut: data.dateDebut,
            dateFin: data.dateFin,
            usageMax: data.usageMax ? parseInt(data.usageMax) : null,
            usageActuel: 0,
            conditions: data.conditions || '',
            createdAt: new Date().toISOString()
        };
        
        await window.saveToFirebase('promotions', promotion);
        
        window.appData.promotions.push(promotion);
        updatePromotionsStats();
        renderPromotionsTable();
        
        window.closeModal('promotionModal');
        window.showAlert('Promotion créée avec succès', 'success');
        
    } catch (error) {
        console.error('Erreur lors de la création de la promotion:', error);
        window.showAlert('Erreur lors de la création de la promotion', 'error');
    }
}

function updatePromotionsStats() {
    const total = window.appData.promotions?.length || 0;
    const today = new Date();
    
    const actives = window.appData.promotions?.filter(p => {
        const debut = new Date(p.dateDebut);
        const fin = new Date(p.dateFin);
        return today >= debut && today <= fin;
    }).length || 0;
    
    const totalUsages = window.appData.promotions?.reduce((sum, p) => sum + (p.usageActuel || 0), 0) || 0;
    
    // Calculer les économies depuis les locations
    const totalSavings = window.appData.locations?.reduce((sum, l) => sum + (l.montantRemise || 0), 0) || 0;
    
    document.getElementById('totalPromotions').textContent = total;
    document.getElementById('promotionsActives').textContent = actives;
    document.getElementById('totalUsages').textContent = totalUsages;
    document.getElementById('totalSavings').textContent = window.formatCurrency(totalSavings);
}

function renderPromotionsTable() {
    const tbody = document.getElementById('promotionsTableBody');
    if (!tbody || !window.appData.promotions) return;
    
    if (window.appData.promotions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500">Aucune promotion créée</td></tr>';
        return;
    }
    
    tbody.innerHTML = window.appData.promotions.map(promo => {
        const today = new Date();
        const debut = new Date(promo.dateDebut);
        const fin = new Date(promo.dateFin);
        
        let statut = '';
        let statutClass = '';
        
        if (today < debut) {
            statut = 'À venir';
            statutClass = 'bg-blue-100 text-blue-800';
        } else if (today > fin) {
            statut = 'Expirée';
            statutClass = 'bg-gray-100 text-gray-800';
        } else {
            statut = 'Active';
            statutClass = 'bg-green-100 text-green-800';
        }
        
        const valeurDisplay = promo.type === 'pourcentage' 
            ? `-${promo.valeur}%` 
            : window.formatCurrency(promo.valeur);
        
        const usageDisplay = promo.usageMax 
            ? `${promo.usageActuel || 0} / ${promo.usageMax}`
            : `${promo.usageActuel || 0} / ∞`;
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${promo.code}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${promo.description}</div>
                    ${promo.conditions ? `<div class="text-xs text-gray-500">${promo.conditions}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-green-600">${valeurDisplay}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>${window.formatDate(promo.dateDebut)}</div>
                    <div>${window.formatDate(promo.dateFin)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${usageDisplay}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statutClass}">
                        ${statut}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onclick="deletePromotion('${promo.id}')" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function deletePromotion(promotionId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
        try {
            await window.deleteFromFirebase('promotions', promotionId);
            window.appData.promotions = window.appData.promotions.filter(p => p.id !== promotionId);
            updatePromotionsStats();
            renderPromotionsTable();
            window.showAlert('Promotion supprimée avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            window.showAlert('Erreur lors de la suppression', 'error');
        }
    }
}

function openPromotionModal() {
    document.getElementById('promotionForm').reset();
    window.openModal('promotionModal');
}