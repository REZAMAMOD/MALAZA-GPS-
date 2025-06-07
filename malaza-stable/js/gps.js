// Module GPS - Version Firebase
console.log('Module GPS chargé - Version Firebase');

function getGPSHTML() {
    return `
        <div class="space-y-6 fade-in">
            <!-- En-tête -->
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Inventaire GPS</h1>
                    <p class="text-gray-600 text-sm sm:text-base">Gérez vos traceurs GPS</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="openModelesModal()" class="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                        <i class="fas fa-cogs mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Gérer</span> Modèles
                    </button>
                    <button onclick="openGPSModal()" class="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                        <i class="fas fa-plus mr-1 sm:mr-2"></i>
                        <span class="hidden sm:inline">Nouveau</span> GPS
                    </button>
                </div>
            </div>

            <!-- Statistiques GPS -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 rounded-full">
                            <i class="fas fa-satellite text-blue-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Total GPS</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="totalGPS">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-full">
                            <i class="fas fa-check-circle text-green-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Disponibles</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="gpsDisponibles">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-red-100 rounded-full">
                            <i class="fas fa-map-marker-alt text-red-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Loués</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="gpsLoues">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-yellow-100 rounded-full">
                            <i class="fas fa-tools text-yellow-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Maintenance</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="gpsMaintenance">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtres (Mobile-optimized) -->
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-center">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Statut:</label>
                        <select id="filterStatut" onchange="filterGPS()" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <option value="">Tous</option>
                            <option value="Disponible">Disponible</option>
                            <option value="Loué">Loué</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Modèle:</label>
                        <select id="filterModele" onchange="filterGPS()" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                            <option value="">Tous</option>
                            <!-- Options générées dynamiquement -->
                        </select>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <label class="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Recherche:</label>
                        <input 
                            type="text" 
                            id="searchGPS" 
                            placeholder="IMEI ou ID..." 
                            onkeyup="filterGPS()"
                            class="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                    </div>
                    <button onclick="resetFilters()" class="text-blue-600 hover:text-blue-800 text-sm self-start sm:self-auto">
                        <i class="fas fa-undo mr-1"></i>
                        Réinitialiser
                    </button>
                </div>
            </div>

            <!-- Desktop Table (Hidden on mobile) -->
            <div class="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Liste des GPS</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    GPS
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IMEI
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Modèle
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date d'achat
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody id="gpsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Contenu généré dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Cards (Hidden on desktop) -->
            <div class="lg:hidden">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">GPS</h3>
                    <span class="text-sm text-gray-500" id="mobileGPSCount">0 GPS</span>
                </div>
                <div id="mobileGPSContainer" class="space-y-3">
                    <!-- Mobile cards générées dynamiquement -->
                </div>
            </div>
        </div>

        <!-- Modal Nouveau GPS - Responsive -->
        <div id="gpsModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Nouveau GPS</h3>
                    <button onclick="closeModal('gpsModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="gpsForm">
                    <input type="hidden" id="gpsId" name="id">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">IMEI *</label>
                            <input 
                                type="text" 
                                name="imei" 
                                id="gpsImei"
                                required 
                                maxlength="15"
                                pattern="[0-9]{15}"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 865209075763426"
                            >
                            <p class="text-xs text-gray-500 mt-1">15 chiffres uniquement</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Modèle *</label>
                            <select 
                                name="modele" 
                                id="gpsModele"
                                required 
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner un modèle</option>
                                <!-- Options générées dynamiquement -->
                            </select>
                            <p class="text-xs text-gray-500 mt-1">
                                <button type="button" onclick="openModelesModal()" class="text-blue-600 hover:text-blue-800">
                                    <i class="fas fa-plus mr-1"></i>Ajouter un nouveau modèle
                                </button>
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date d'achat</label>
                            <input 
                                type="date" 
                                name="dateAchat" 
                                id="gpsDateAchat"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                            <select 
                                name="statut" 
                                id="gpsStatut"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Disponible">Disponible</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea 
                                name="notes" 
                                id="gpsNotes"
                                rows="2"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Notes optionnelles..."
                            ></textarea>
                        </div>
                        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                            <button 
                                type="submit" 
                                class="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
                                id="gpsSubmitBtn"
                            >
                                Ajouter GPS
                            </button>
                            <button 
                                type="button" 
                                onclick="closeModal('gpsModal')" 
                                class="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-base font-medium"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Gestion Modèles - Responsive -->
        <div id="modelesModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Gestion des Modèles GPS</h3>
                    <button onclick="closeModal('modelesModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Ajouter nouveau modèle -->
                <div class="mb-6">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            id="nouveauModele"
                            placeholder="Ex: A12, GT06N, TK103..."
                            class="flex-1 p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                            maxlength="20"
                        >
                        <button 
                            onclick="ajouterModele()" 
                            class="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Ajoutez les modèles de vos GPS (max 20 caractères)</p>
                </div>

                <!-- Liste des modèles existants -->
                <div class="space-y-2 max-h-64 overflow-y-auto" id="listeModeles">
                    <!-- Généré dynamiquement -->
                </div>

                <div class="flex justify-end pt-4 border-t mt-4">
                    <button 
                        onclick="closeModal('modelesModal')" 
                        class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Retour GPS - Responsive -->
        <div id="returnGPSModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg mx-auto max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Retour GPS</h3>
                    <button onclick="closeModal('returnGPSModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div id="returnGPSContent" class="space-y-4">
                    <!-- Contenu généré dynamiquement -->
                </div>
                
                <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                    <button 
                        onclick="confirmGPSReturn()" 
                        class="w-full sm:flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-base font-medium"
                        id="confirmReturnBtn"
                    >
                        <i class="fas fa-check mr-2"></i>
                        Confirmer Retour
                    </button>
                    <button 
                        onclick="closeModal('returnGPSModal')" 
                        class="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-base font-medium"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Configuration des modèles (sera stockée dans Firebase)
let gpsModeles = [];

async function initGPS() {
    console.log('Initialisation du module GPS avec Firebase');
    
    // Charger les modèles depuis Firebase
    await loadGPSModeles();
    
    // Charger les données
    renderGPSTable();
    renderMobileGPS();
    updateGPSStats();
    updateModeleSelects();
    updateFilterModele();
    
    // Initialiser le formulaire
    setupGPSForm();
    
    // Écouter les changements en temps réel
    listenToGPSChanges();
}

// Charger les modèles GPS depuis Firebase
async function loadGPSModeles() {
    try {
        const doc = await window.firebaseDB.collection('configurations').doc('gpsModeles').get();
        if (doc.exists) {
            gpsModeles = doc.data().modeles || ['A10'];
        } else {
            // Initialiser avec le modèle par défaut
            gpsModeles = ['A10'];
            await saveGPSModeles();
        }
    } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
        gpsModeles = ['A10'];
    }
}

// Sauvegarder les modèles GPS dans Firebase
async function saveGPSModeles() {
    try {
        await window.firebaseDB.collection('configurations').doc('gpsModeles').set({
            modeles: gpsModeles,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des modèles:', error);
        throw error;
    }
}

// Écouter les changements en temps réel depuis Firebase
function listenToGPSChanges() {
    if (!window.firebaseDB) {
        console.error('Firebase DB non initialisé');
        setTimeout(() => {
            listenToGPSChanges();
        }, 1000);
        return;
    }
    
    // Écouter les changements sur la collection GPS
    window.firebaseDB.collection('gps').onSnapshot((snapshot) => {
        console.log('Changements détectés dans les GPS');
        
        // Mettre à jour le cache local
        appData.gps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Rafraîchir l'affichage
        renderGPSTable();
        renderMobileGPS();
        updateGPSStats();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements GPS:', error);
    });
    
    // Écouter les changements sur les modèles
    window.firebaseDB.collection('configurations').doc('gpsModeles').onSnapshot((doc) => {
        if (doc.exists) {
            gpsModeles = doc.data().modeles || ['A10'];
            updateModeleSelects();
            updateFilterModele();
            renderListeModeles();
        }
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements de modèles:', error);
    });
}

function setupGPSForm() {
    const form = document.getElementById('gpsForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            await handleGPSSubmit(data);
        });
    }
}

function updateModeleSelects() {
    const gpsModeleSelect = document.getElementById('gpsModele');
    if (gpsModeleSelect) {
        const currentValue = gpsModeleSelect.value;
        gpsModeleSelect.innerHTML = '<option value="">Sélectionner un modèle</option>';
        
        gpsModeles.forEach(modele => {
            const option = document.createElement('option');
            option.value = modele;
            option.textContent = modele;
            if (modele === currentValue) option.selected = true;
            gpsModeleSelect.appendChild(option);
        });
    }
}

function updateFilterModele() {
    const filterModele = document.getElementById('filterModele');
    if (filterModele) {
        const currentValue = filterModele.value;
        filterModele.innerHTML = '<option value="">Tous</option>';
        
        gpsModeles.forEach(modele => {
            const option = document.createElement('option');
            option.value = modele;
            option.textContent = modele;
            if (modele === currentValue) option.selected = true;
            filterModele.appendChild(option);
        });
    }
}

function openModelesModal() {
    renderListeModeles();
    openModal('modelesModal');
}

function renderListeModeles() {
    const container = document.getElementById('listeModeles');
    if (!container) return;
    
    if (gpsModeles.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Aucun modèle défini</p>';
        return;
    }
    
    container.innerHTML = gpsModeles.map(modele => {
        const isUsed = appData.gps.some(gps => gps.modele === modele);
        
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                    <i class="fas fa-satellite text-blue-600 mr-3"></i>
                    <span class="font-medium text-gray-900">${modele}</span>
                    ${isUsed ? '<span class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Utilisé</span>' : ''}
                </div>
                <button 
                    onclick="supprimerModele('${modele}')" 
                    class="text-red-600 hover:text-red-900 ${isUsed ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${isUsed ? 'disabled' : ''}
                    title="${isUsed ? 'Impossible de supprimer : modèle utilisé par des GPS' : 'Supprimer ce modèle'}"
                >
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }).join('');
}

async function ajouterModele() {
    const input = document.getElementById('nouveauModele');
    const modele = input.value.trim().toUpperCase();
    
    if (!modele) {
        showAlert('Veuillez saisir un nom de modèle', 'error');
        return;
    }
    
    if (modele.length > 20) {
        showAlert('Le nom du modèle ne peut pas dépasser 20 caractères', 'error');
        return;
    }
    
    if (gpsModeles.includes(modele)) {
        showAlert('Ce modèle existe déjà', 'error');
        return;
    }
    
    try {
        gpsModeles.push(modele);
        gpsModeles.sort();
        await saveGPSModeles();
        
        input.value = '';
        renderListeModeles();
        updateModeleSelects();
        updateFilterModele();
        
        showAlert(`Modèle "${modele}" ajouté avec succès`, 'success');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du modèle:', error);
        showAlert('Erreur lors de l\'ajout du modèle', 'error');
    }
}

async function supprimerModele(modele) {
    const isUsed = appData.gps.some(gps => gps.modele === modele);
    
    if (isUsed) {
        showAlert('Impossible de supprimer ce modèle : il est utilisé par des GPS', 'error');
        return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le modèle "${modele}" ?`)) {
        try {
            gpsModeles = gpsModeles.filter(m => m !== modele);
            await saveGPSModeles();
            
            renderListeModeles();
            updateModeleSelects();
            updateFilterModele();
            
            showAlert(`Modèle "${modele}" supprimé avec succès`, 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression du modèle:', error);
            showAlert('Erreur lors de la suppression du modèle', 'error');
        }
    }
}

function renderGPSTable() {
    const tbody = document.getElementById('gpsTableBody');
    
    if (!tbody) {
        console.log('Element gpsTableBody non trouvé (normal sur mobile)');
        return;
    }
    
    let gpsToShow = [...appData.gps];
    
    // Appliquer les filtres
    const filterStatut = document.getElementById('filterStatut')?.value;
    const filterModele = document.getElementById('filterModele')?.value;
    const searchTerm = document.getElementById('searchGPS')?.value;
    
    if (filterStatut) {
        gpsToShow = gpsToShow.filter(gps => gps.statut === filterStatut);
    }
    
    if (filterModele) {
        gpsToShow = gpsToShow.filter(gps => gps.modele === filterModele);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        gpsToShow = gpsToShow.filter(gps => 
            gps.id.toLowerCase().includes(term) || 
            gps.imei.toLowerCase().includes(term)
        );
    }
    
    if (gpsToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-satellite text-4xl mb-2"></i>
                    <p>Aucun GPS trouvé</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = gpsToShow.map(gps => {
        const statusClass = {
            'Disponible': 'bg-green-100 text-green-800',
            'Loué': 'bg-red-100 text-red-800',
            'Maintenance': 'bg-yellow-100 text-yellow-800'
        };
        
        const statusIcon = {
            'Disponible': 'check-circle',
            'Loué': 'map-marker-alt',
            'Maintenance': 'tools'
        };
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i class="fas fa-satellite text-blue-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${gps.id}</div>
                            <div class="text-sm text-gray-500">GPS Tracker</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 font-mono">${gps.imei}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${gps.modele}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass[gps.statut]}">
                        <i class="fas fa-${statusIcon[gps.statut]} mr-1"></i>
                        ${gps.statut}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${gps.dateAchat ? formatDate(gps.dateAchat) : '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex space-x-2">
                        <button 
                            onclick="editGPS('${gps.id}')" 
                            class="text-yellow-600 hover:text-yellow-900" 
                            title="Modifier"
                        >
                            <i class="fas fa-edit"></i>
                        </button>
                        ${gps.statut === 'Loué' ? `
                            <button 
                                onclick="returnGPS('${gps.id}')" 
                                class="text-green-600 hover:text-green-900" 
                                title="Retour GPS"
                            >
                                <i class="fas fa-undo"></i>
                            </button>
                        ` : ''}
                        ${gps.statut === 'Disponible' ? `
                            <button 
                                onclick="setGPSMaintenance('${gps.id}')" 
                                class="text-orange-600 hover:text-orange-900" 
                                title="Mettre en maintenance"
                            >
                                <i class="fas fa-tools"></i>
                            </button>
                        ` : ''}
                        ${gps.statut === 'Maintenance' ? `
                            <button 
                                onclick="setGPSAvailable('${gps.id}')" 
                                class="text-green-600 hover:text-green-900" 
                                title="Remettre en service"
                            >
                                <i class="fas fa-check-circle"></i>
                            </button>
                        ` : ''}
                        <button 
                            onclick="deleteGPS('${gps.id}')" 
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

function renderMobileGPS() {
    const container = document.getElementById('mobileGPSContainer');
    const countElement = document.getElementById('mobileGPSCount');
    
    if (!container) {
        console.log('Element mobileGPSContainer non trouvé (normal sur desktop)');
        return;
    }
    
    let gpsToShow = [...appData.gps];
    
    // Appliquer les filtres
    const filterStatut = document.getElementById('filterStatut')?.value;
    const filterModele = document.getElementById('filterModele')?.value;
    const searchTerm = document.getElementById('searchGPS')?.value;
    
    if (filterStatut) {
        gpsToShow = gpsToShow.filter(gps => gps.statut === filterStatut);
    }
    
    if (filterModele) {
        gpsToShow = gpsToShow.filter(gps => gps.modele === filterModele);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        gpsToShow = gpsToShow.filter(gps => 
            gps.id.toLowerCase().includes(term) || 
            gps.imei.toLowerCase().includes(term)
        );
    }
    
    // Mettre à jour le compteur
    if (countElement) {
        countElement.textContent = `${gpsToShow.length} GPS`;
    }
    
    if (gpsToShow.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-lg">
                <i class="fas fa-satellite text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 mb-4">Aucun GPS trouvé</p>
                <button onclick="openGPSModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <i class="fas fa-plus mr-2"></i>
                    Ajouter un GPS
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = gpsToShow.map(gps => {
        const statusClass = {
            'Disponible': 'bg-green-100 text-green-800',
            'Loué': 'bg-red-100 text-red-800',
            'Maintenance': 'bg-yellow-100 text-yellow-800'
        };
        
        const statusIcon = {
            'Disponible': 'check-circle',
            'Loué': 'map-marker-alt',
            'Maintenance': 'tools'
        };
        
        // Trouver la location associée si le GPS est loué
        const location = gps.statut === 'Loué' ? 
            appData.locations.find(l => l.gpsId === gps.id && l.statut === 'en cours') : null;
        
        return `
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <!-- Header avec ID et statut -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <i class="fas fa-satellite text-blue-600 text-lg"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 text-base">${gps.id}</h3>
                            <p class="text-sm text-gray-500">Modèle ${gps.modele}</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${statusClass[gps.statut]}">
                        <i class="fas fa-${statusIcon[gps.statut]} mr-1"></i>
                        ${gps.statut}
                    </span>
                </div>
                
                <!-- Informations -->
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm">
                        <i class="fas fa-barcode text-gray-400 w-5 mr-2"></i>
                        <span class="text-gray-900 font-mono text-xs">${gps.imei}</span>
                    </div>
                    
                    ${gps.dateAchat ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-calendar text-gray-400 w-5 mr-2"></i>
                            <span class="text-gray-900">Acheté le ${formatDate(gps.dateAchat)}</span>
                        </div>
                    ` : ''}
                    
                    ${location ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-user text-green-500 w-5 mr-2"></i>
                            <span class="text-green-700 font-medium">Loué à ${location.nomClient}</span>
                        </div>
                        <div class="flex items-center text-sm">
                            <i class="fas fa-car text-gray-400 w-5 mr-2"></i>
                            <span class="text-gray-900">${location.id}</span>
                        </div>
                    ` : ''}
                    
                    ${gps.notes ? `
                        <div class="flex items-start text-sm">
                            <i class="fas fa-sticky-note text-gray-400 w-5 mr-2 mt-0.5"></i>
                            <span class="text-gray-600 line-clamp-2">${gps.notes}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-2 pt-3 border-t">
                    <button 
                        onclick="editGPS('${gps.id}')" 
                        class="flex-1 bg-yellow-50 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                    >
                        <i class="fas fa-edit mr-2"></i>
                        Modifier
                    </button>
                    
                    ${gps.statut === 'Loué' ? `
                        <button 
                            onclick="returnGPS('${gps.id}')" 
                            class="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                            <i class="fas fa-undo mr-2"></i>
                            Retour
                        </button>
                    ` : gps.statut === 'Disponible' ? `
                        <button 
                            onclick="setGPSMaintenance('${gps.id}')" 
                            class="flex-1 bg-orange-50 text-orange-700 py-2 px-3 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
                        >
                            <i class="fas fa-tools mr-2"></i>
                            Maintenance
                        </button>
                    ` : `
                        <button 
                            onclick="setGPSAvailable('${gps.id}')" 
                            class="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                            <i class="fas fa-check-circle mr-2"></i>
                            Disponible
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function updateGPSStats() {
    const totalGPS = appData.gps.length;
    const gpsDisponibles = appData.gps.filter(g => g.statut === 'Disponible').length;
    const gpsLoues = appData.gps.filter(g => g.statut === 'Loué').length;
    const gpsMaintenance = appData.gps.filter(g => g.statut === 'Maintenance').length;
    
    // Mise à jour des éléments
    const elements = {
        totalGPS: document.getElementById('totalGPS'),
        gpsDisponibles: document.getElementById('gpsDisponibles'),
        gpsLoues: document.getElementById('gpsLoues'),
        gpsMaintenance: document.getElementById('gpsMaintenance')
    };
    
    if (elements.totalGPS) elements.totalGPS.textContent = totalGPS;
    if (elements.gpsDisponibles) elements.gpsDisponibles.textContent = gpsDisponibles;
    if (elements.gpsLoues) elements.gpsLoues.textContent = gpsLoues;
    if (elements.gpsMaintenance) elements.gpsMaintenance.textContent = gpsMaintenance;
}

function openGPSModal(gpsId = null) {
    const modal = document.getElementById('gpsModal');
    const title = modal.querySelector('h3');
    const submitBtn = document.getElementById('gpsSubmitBtn');
    
    // Mettre à jour les options de modèles
    updateModeleSelects();
    
    if (gpsId) {
        // Mode modification
        const gps = appData.gps.find(g => g.id === gpsId);
        if (gps) {
            title.textContent = 'Modifier GPS';
            submitBtn.textContent = 'Modifier GPS';
            
            // Pré-remplir le formulaire
            document.getElementById('gpsId').value = gps.id;
            document.getElementById('gpsImei').value = gps.imei;
            document.getElementById('gpsModele').value = gps.modele;
            document.getElementById('gpsDateAchat').value = gps.dateAchat || '';
            document.getElementById('gpsStatut').value = gps.statut;
            document.getElementById('gpsNotes').value = gps.notes || '';
        }
    } else {
        // Mode création
        title.textContent = 'Nouveau GPS';
        submitBtn.textContent = 'Ajouter GPS';
        
        // Réinitialiser le formulaire
        document.getElementById('gpsForm').reset();
        document.getElementById('gpsId').value = '';
        document.getElementById('gpsStatut').value = 'Disponible';
    }
    
    openModal('gpsModal');
}

async function handleGPSSubmit(data) {
    // Validation
    if (!data.imei || !data.modele) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Valider l'IMEI
    if (!validateIMEI(data.imei)) {
        showAlert('L\'IMEI doit contenir exactement 15 chiffres', 'error');
        return;
    }
    
    // Vérifier l'unicité de l'IMEI
    const existingGPS = appData.gps.find(g => g.imei === data.imei && g.id !== data.id);
    if (existingGPS) {
        showAlert('Cet IMEI existe déjà', 'error');
        return;
    }
    
    try {
        // Désactiver le bouton pendant la sauvegarde
        const submitBtn = document.getElementById('gpsSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enregistrement...';
        
        const gpsData = {
            imei: data.imei,
            modele: data.modele,
            dateAchat: data.dateAchat || null,
            statut: data.statut || 'Disponible',
            notes: data.notes || ''
        };
        
        if (data.id) {
            // Mode modification
            gpsData.id = data.id;
            await saveToFirebase('gps', gpsData);
            showAlert('GPS modifié avec succès', 'success');
        } else {
            // Mode création - générer un ID
            const newId = generateId('GPS', appData.gps);
            gpsData.id = newId;
            await saveToFirebase('gps', gpsData);
            showAlert('GPS ajouté avec succès', 'success');
        }
        
        closeModal('gpsModal');
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du GPS:', error);
        showAlert('Erreur lors de la sauvegarde du GPS', 'error');
    } finally {
        // Réactiver le bouton
        const submitBtn = document.getElementById('gpsSubmitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = data.id ? 'Modifier GPS' : 'Ajouter GPS';
    }
}

function editGPS(gpsId) {
    openGPSModal(gpsId);
}

async function setGPSMaintenance(gpsId) {
    const gps = appData.gps.find(g => g.id === gpsId);
    if (!gps) return;
    
    if (confirm(`Mettre le GPS "${gps.id}" en maintenance ?`)) {
        try {
            gps.statut = 'Maintenance';
            await saveToFirebase('gps', gps);
            showAlert('GPS mis en maintenance', 'success');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du GPS:', error);
            showAlert('Erreur lors de la mise à jour', 'error');
        }
    }
}

async function setGPSAvailable(gpsId) {
    const gps = appData.gps.find(g => g.id === gpsId);
    if (!gps) return;
    
    if (confirm(`Remettre le GPS "${gps.id}" en service ?`)) {
        try {
            gps.statut = 'Disponible';
            await saveToFirebase('gps', gps);
            showAlert('GPS remis en service', 'success');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du GPS:', error);
            showAlert('Erreur lors de la mise à jour', 'error');
        }
    }
}

async function deleteGPS(gpsId) {
    const gps = appData.gps.find(g => g.id === gpsId);
    if (!gps) return;
    
    // Vérifier s'il y a des locations actives
    const hasActiveLocations = appData.locations.some(l => l.gpsId === gpsId && l.statut === 'en cours');
    
    if (hasActiveLocations) {
        showAlert('Impossible de supprimer ce GPS : il est utilisé dans une location active', 'error');
        return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le GPS "${gps.id}" (${gps.imei}) ?`)) {
        try {
            showAlert('Suppression en cours...', 'info');
            await deleteFromFirebase('gps', gpsId);
            showAlert('GPS supprimé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression du GPS:', error);
            showAlert('Erreur lors de la suppression du GPS', 'error');
        }
    }
}

function filterGPS() {
    renderGPSTable();
    renderMobileGPS();
}

function resetFilters() {
    document.getElementById('filterStatut').value = '';
    document.getElementById('filterModele').value = '';
    document.getElementById('searchGPS').value = '';
    renderGPSTable();
    renderMobileGPS();
}

// Variables globales pour le retour GPS
let selectedGPSForReturn = null;
let selectedLocationForReturn = null;
let selectedSIMForReturn = null;

function returnGPS(gpsId) {
    const gps = appData.gps.find(g => g.id === gpsId);
    if (!gps || gps.statut !== 'Loué') {
        showAlert('Ce GPS n\'est pas en cours de location', 'error');
        return;
    }
    
    // Trouver la location associée
    const location = appData.locations.find(l => l.gpsId === gpsId && l.statut === 'en cours');
    if (!location) {
        showAlert('Aucune location active trouvée pour ce GPS', 'error');
        return;
    }
    
    // Trouver la SIM associée
    const sim = location.simId ? appData.sim.find(s => s.id === location.simId) : null;
    
    // Stocker les références
    selectedGPSForReturn = gps;
    selectedLocationForReturn = location;
    selectedSIMForReturn = sim;
    
    // Calculer les informations
    const client = appData.clients.find(c => c.id === location.clientId);
    const dateDebut = new Date(location.dateDebut);
    const today = new Date();
    const joursUtilises = Math.ceil((today - dateDebut) / (1000 * 60 * 60 * 24));
    
    // Calcul du crédit SIM résiduel
    let simCreditInfo = '';
    if (sim && sim.dateExpiration) {
        const daysLeft = getDaysUntilExpiry(sim.dateExpiration);
        if (daysLeft > 0) {
            simCreditInfo = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div class="flex items-center">
                        <i class="fas fa-clock text-green-600 mr-2"></i>
                        <div class="text-sm text-green-800">
                            <p class="font-medium">Crédit SIM résiduel</p>
                            <p>La SIM ${sim.id} a encore <strong>${daysLeft} jours</strong> de forfait restants</p>
                            <p class="text-xs mt-1">Elle pourra être réutilisée dans une autre location</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            simCreditInfo = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                        <div class="text-sm text-yellow-800">
                            <p class="font-medium">SIM expirée</p>
                            <p>La SIM ${sim.id} a expiré et devra être rechargée pour être réutilisée</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } else if (sim) {
        simCreditInfo = `
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div class="flex items-center">
                    <i class="fas fa-sim-card text-gray-600 mr-2"></i>
                    <div class="text-sm text-gray-800">
                        <p class="font-medium">SIM inactive</p>
                        <p>La SIM ${sim.id} n'a pas de forfait actif</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    const content = `
        <div class="space-y-4">
            <!-- Informations GPS -->
            <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-3">GPS à retourner</h4>
                <div class="text-sm space-y-1">
                    <div><span class="text-gray-600">ID GPS:</span> <strong>${gps.id}</strong></div>
                    <div><span class="text-gray-600">Modèle:</span> <strong>${gps.modele}</strong></div>
                    <div><span class="text-gray-600">IMEI:</span> <strong class="font-mono text-xs">${gps.imei}</strong></div>
                </div>
            </div>
            
            <!-- Informations Location -->
            <div class="bg-purple-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-3">Location en cours</h4>
                <div class="text-sm space-y-1">
                    <div><span class="text-gray-600">ID Location:</span> <strong>${location.id}</strong></div>
                    <div><span class="text-gray-600">Client:</span> <strong>${location.nomClient}</strong></div>
                    <div><span class="text-gray-600">Début:</span> <strong>${formatDate(location.dateDebut)}</strong></div>
                    <div><span class="text-gray-600">Durée utilisée:</span> <strong>${joursUtilises} jours</strong></div>
                    <div><span class="text-gray-600">Tarif:</span> <strong>${formatCurrency(location.tarif)}/mois</strong></div>
                </div>
            </div>
            
            ${simCreditInfo}
            
            <!-- Actions -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                <div class="flex items-start">
                    <i class="fas fa-info-circle text-red-600 mr-2 mt-0.5"></i>
                    <div class="text-sm text-red-800">
                        <p class="font-medium">Conséquences du retour :</p>
                        <ul class="mt-2 space-y-1 text-xs">
                            <li>• GPS : "Loué" → "Disponible"</li>
                            <li>• Location : "en cours" → "terminée"</li>
                            <li>• SIM : Libérée (garde son crédit résiduel)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('returnGPSContent').innerHTML = content;
    openModal('returnGPSModal');
}

async function confirmGPSReturn() {
    if (!selectedGPSForReturn || !selectedLocationForReturn) {
        showAlert('Erreur: Informations manquantes', 'error');
        return;
    }
    
    const confirmMsg = `Confirmer le retour du GPS ${selectedGPSForReturn.id} ?`;
    if (confirm(confirmMsg)) {
        try {
            showAlert('Traitement du retour...', 'info');
            
            // 1. Changer le statut du GPS
            selectedGPSForReturn.statut = 'Disponible';
            await saveToFirebase('gps', selectedGPSForReturn);
            
            // 2. Terminer la location
            selectedLocationForReturn.statut = 'terminée';
            selectedLocationForReturn.dateRetour = getCurrentDate();
            await saveToFirebase('locations', selectedLocationForReturn);
            
            // 3. La SIM garde son statut et son crédit résiduel (pas de changement)
            
            // 4. Nettoyer les variables
            selectedGPSForReturn = null;
            selectedLocationForReturn = null;
            selectedSIMForReturn = null;
            
            // 5. Fermer modal
            closeModal('returnGPSModal');
            
            showAlert('GPS retourné avec succès', 'success');
            
        } catch (error) {
            console.error('Erreur lors du retour GPS:', error);
            showAlert('Erreur lors du retour GPS', 'error');
        }
    }
}

// Fonction utilitaire pour calculer les jours restants
function getDaysUntilExpiry(dateExpiration) {
    if (!dateExpiration) return null;
    const today = new Date();
    const expiryDate = new Date(dateExpiration);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Ajouter les fonctions Firebase dans app.js si pas déjà présentes
if (typeof window.saveGPSToFirebase === 'undefined') {
    window.saveGPSToFirebase = async function(gps) {
        return await saveToFirebase('gps', gps);
    };
}

if (typeof window.deleteGPSFromFirebase === 'undefined') {
    window.deleteGPSFromFirebase = async function(gpsId) {
        return await deleteFromFirebase('gps', gpsId);
    };
}