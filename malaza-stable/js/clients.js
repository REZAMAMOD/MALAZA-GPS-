// Module Clients - Version Firebase
console.log('Module Clients chargé - Version Firebase');

function getClientsHTML() {
    return `
        <div class="space-y-6 fade-in">
            <!-- En-tête -->
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Clients</h1>
                    <p class="text-gray-600 text-sm sm:text-base">Gérez votre base clients et leurs informations</p>
                </div>
                <button onclick="openClientModal()" class="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    <i class="fas fa-plus mr-1 sm:mr-2"></i>
                    <span class="hidden sm:inline">Nouveau</span> Client
                </button>
            </div>

            <!-- Statistiques clients -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 rounded-full">
                            <i class="fas fa-users text-blue-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Total Clients</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="totalClients">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 rounded-full">
                            <i class="fas fa-user-check text-green-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Actifs</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="clientsActifs">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-yellow-100 rounded-full">
                            <i class="fas fa-calendar-plus text-yellow-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">Nouveaux</p>
                            <p class="text-lg sm:text-xl font-bold text-gray-900" id="nouveauxClients">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <div class="flex items-center">
                        <div class="p-2 bg-purple-100 rounded-full">
                            <i class="fas fa-money-bill-wave text-purple-600 text-sm sm:text-base"></i>
                        </div>
                        <div class="ml-2 sm:ml-3">
                            <p class="text-xs sm:text-sm text-gray-600">CA Total</p>
                            <p class="text-sm sm:text-lg font-bold text-gray-900" id="caClients">0 Ar</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Desktop Table (Hidden on mobile) -->
            <div class="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Liste des Clients</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="clientsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Contenu généré dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Cards (Hidden on desktop) -->
            <div class="lg:hidden">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Clients</h3>
                    <span class="text-sm text-gray-500" id="mobileClientsCount">0 clients</span>
                </div>
                <div id="mobileClientsContainer" class="space-y-3">
                    <!-- Mobile cards générées dynamiquement -->
                </div>
            </div>
        </div>

        <!-- Modal Nouveau Client - Responsive -->
        <div id="clientModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Nouveau Client</h3>
                    <button onclick="closeModal('clientModal')" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="clientForm">
                    <input type="hidden" id="clientId" name="id">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                            <input 
                                type="text" 
                                name="nom" 
                                id="clientNom"
                                required 
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: RAKOTO Jean"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                            <input 
                                type="tel" 
                                name="telephone" 
                                id="clientTelephone"
                                required 
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 032 12 345 67"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                            <input 
                                type="text" 
                                name="cin" 
                                id="clientCin"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 101 011 000 123"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                            <textarea 
                                name="adresse" 
                                id="clientAdresse"
                                required 
                                rows="3"
                                class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: Lot II M 50 Ankadifotsy"
                            ></textarea>
                        </div>
                        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                            <button 
                                type="submit" 
                                class="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
                                id="clientSubmitBtn"
                            >
                                Créer Client
                            </button>
                            <button 
                                type="button" 
                                onclick="closeModal('clientModal')" 
                                class="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-base font-medium"
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

function initClients() {
    console.log('Initialisation du module Clients avec Firebase');
    
    // Charger les données
    renderClientsTable();
    renderMobileClients();
    updateClientsStats();
    
    // Initialiser le formulaire
    setupClientForm();
    
    // Écouter les changements en temps réel
    listenToClientsChanges();
}

// Écouter les changements en temps réel depuis Firebase
function listenToClientsChanges() {
    if (!window.firebaseDB) {
        console.error('Firebase DB non initialisé');
        // Réessayer après un délai
        setTimeout(() => {
            listenToClientsChanges();
        }, 1000);
        return;
    }
    
    // Écouter les changements sur la collection clients
    window.firebaseDB.collection('clients').onSnapshot((snapshot) => {
        console.log('Changements détectés dans les clients');
        
        // Mettre à jour le cache local
        appData.clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Rafraîchir l'affichage
        renderClientsTable();
        renderMobileClients();
        updateClientsStats();
    }, (error) => {
        console.error('Erreur lors de l\'écoute des changements:', error);
    });
}

function setupClientForm() {
    const form = document.getElementById('clientForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            await handleClientSubmit(data);
        });
    }
}

function renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    
    if (!tbody) {
        console.log('Element clientsTableBody non trouvé (normal sur mobile)');
        return;
    }
    
    if (appData.clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-users text-4xl mb-2"></i>
                    <p>Aucun client trouvé</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = appData.clients.map(client => {
        const hasActiveLocation = appData.locations.some(l => l.clientId === client.id && l.statut === 'en cours');
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span class="text-blue-600 font-medium text-sm">${client.nom.charAt(0)}</span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${client.nom}</div>
                            <div class="text-sm text-gray-500">${client.id}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${client.telephone}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${client.cin || '-'}</div>
                    ${!client.cin ? '<div class="text-xs text-red-500">Non renseigné</div>' : ''}
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate" title="${client.adresse}">
                        ${client.adresse}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${hasActiveLocation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${hasActiveLocation ? 'Actif' : 'Inactif'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex space-x-2">
                        <button 
                            onclick="editClient('${client.id}')" 
                            class="text-yellow-600 hover:text-yellow-900" 
                            title="Modifier"
                        >
                            <i class="fas fa-edit"></i>
                        </button>
                        <button 
                            onclick="deleteClient('${client.id}')" 
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

function renderMobileClients() {
    const container = document.getElementById('mobileClientsContainer');
    const countElement = document.getElementById('mobileClientsCount');
    
    if (!container) {
        console.log('Element mobileClientsContainer non trouvé (normal sur desktop)');
        return;
    }
    
    // Mettre à jour le compteur
    if (countElement) {
        countElement.textContent = `${appData.clients.length} client${appData.clients.length > 1 ? 's' : ''}`;
    }
    
    if (appData.clients.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-lg">
                <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 mb-4">Aucun client trouvé</p>
                <button onclick="openClientModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <i class="fas fa-plus mr-2"></i>
                    Ajouter un client
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appData.clients.map(client => {
        const hasActiveLocation = appData.locations.some(l => l.clientId === client.id && l.statut === 'en cours');
        const activeLocationsCount = appData.locations.filter(l => l.clientId === client.id && l.statut === 'en cours').length;
        
        return `
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <!-- Header avec nom et statut -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span class="text-blue-600 font-bold text-lg">${client.nom.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 text-base">${client.nom}</h3>
                            <p class="text-sm text-gray-500">${client.id}</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${hasActiveLocation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${hasActiveLocation ? 'Actif' : 'Inactif'}
                    </span>
                </div>
                
                <!-- Informations -->
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm">
                        <i class="fas fa-phone text-gray-400 w-5 mr-2"></i>
                        <span class="text-gray-900">${client.telephone}</span>
                        <button onclick="window.open('tel:${client.telephone}')" class="ml-auto text-blue-600 hover:text-blue-800">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    </div>
                    
                    ${client.cin ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-id-card text-gray-400 w-5 mr-2"></i>
                            <span class="text-gray-900">${client.cin}</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex items-start text-sm">
                        <i class="fas fa-map-marker-alt text-gray-400 w-5 mr-2 mt-0.5"></i>
                        <span class="text-gray-900 line-clamp-2">${client.adresse}</span>
                    </div>
                    
                    ${hasActiveLocation ? `
                        <div class="flex items-center text-sm">
                            <i class="fas fa-map-pin text-green-500 w-5 mr-2"></i>
                            <span class="text-green-700 font-medium">${activeLocationsCount} location${activeLocationsCount > 1 ? 's' : ''} active${activeLocationsCount > 1 ? 's' : ''}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-2 pt-3 border-t">
                    <button 
                        onclick="editClient('${client.id}')" 
                        class="flex-1 bg-yellow-50 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                    >
                        <i class="fas fa-edit mr-2"></i>
                        Modifier
                    </button>
                    <button 
                        onclick="deleteClient('${client.id}')" 
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

function updateClientsStats() {
    const totalClients = appData.clients.length;
    const clientsActifs = appData.clients.filter(client => 
        appData.locations.some(l => l.clientId === client.id && l.statut === 'en cours')
    ).length;
    
    // Nouveaux clients ce mois
    const thisMonth = new Date();
    const nouveauxClients = appData.clients.filter(client => {
        if (!client.dateCreation) return false;
        const clientDate = new Date(client.dateCreation);
        return clientDate.getMonth() === thisMonth.getMonth() && 
               clientDate.getFullYear() === thisMonth.getFullYear();
    }).length;
    
    // CA total des clients
    const caTotal = appData.paiements.reduce((sum, p) => sum + p.montant, 0);
    
    // Mise à jour des éléments
    const elements = {
        totalClients: document.getElementById('totalClients'),
        clientsActifs: document.getElementById('clientsActifs'),
        nouveauxClients: document.getElementById('nouveauxClients'),
        caClients: document.getElementById('caClients')
    };
    
    if (elements.totalClients) elements.totalClients.textContent = totalClients;
    if (elements.clientsActifs) elements.clientsActifs.textContent = clientsActifs;
    if (elements.nouveauxClients) elements.nouveauxClients.textContent = nouveauxClients;
    if (elements.caClients) elements.caClients.textContent = formatCurrency(caTotal);
}

function openClientModal(clientId = null) {
    const modal = document.getElementById('clientModal');
    const title = modal.querySelector('h3');
    const submitBtn = document.getElementById('clientSubmitBtn');
    
    if (clientId) {
        // Mode modification
        const client = appData.clients.find(c => c.id === clientId);
        if (client) {
            title.textContent = 'Modifier Client';
            submitBtn.textContent = 'Modifier Client';
            
            // Pré-remplir le formulaire
            document.getElementById('clientId').value = client.id;
            document.getElementById('clientNom').value = client.nom;
            document.getElementById('clientTelephone').value = client.telephone;
            document.getElementById('clientCin').value = client.cin || '';
            document.getElementById('clientAdresse').value = client.adresse;
        }
    } else {
        // Mode création
        title.textContent = 'Nouveau Client';
        submitBtn.textContent = 'Créer Client';
        
        // Réinitialiser le formulaire
        document.getElementById('clientForm').reset();
        document.getElementById('clientId').value = '';
    }
    
    openModal('clientModal');
}

async function handleClientSubmit(data) {
    // Validation
    if (!data.nom || !data.telephone || !data.adresse) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    try {
        // Désactiver le bouton pendant la sauvegarde
        const submitBtn = document.getElementById('clientSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enregistrement...';
        
        const clientData = {
            nom: data.nom,
            telephone: data.telephone,
            cin: data.cin || '',
            adresse: data.adresse,
            dateCreation: data.id ? undefined : getCurrentDate() // Ne pas écraser la date de création
        };
        
        // Retirer les undefined pour Firebase
        Object.keys(clientData).forEach(key => {
            if (clientData[key] === undefined) {
                delete clientData[key];
            }
        });
        
        if (data.id) {
            // Mode modification
            clientData.id = data.id;
            await saveClientToFirebase(clientData);
            showAlert('Client modifié avec succès', 'success');
        } else {
            // Mode création
            await saveClientToFirebase(clientData);
            showAlert('Client créé avec succès', 'success');
        }
        
        closeModal('clientModal');
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du client:', error);
        showAlert('Erreur lors de la sauvegarde du client', 'error');
    } finally {
        // Réactiver le bouton
        const submitBtn = document.getElementById('clientSubmitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = data.id ? 'Modifier Client' : 'Créer Client';
    }
}

function editClient(clientId) {
    openClientModal(clientId);
}

async function deleteClient(clientId) {
    const client = appData.clients.find(c => c.id === clientId);
    if (!client) return;
    
    // Vérifier s'il y a des locations actives
    const hasActiveLocations = appData.locations.some(l => l.clientId === clientId && l.statut === 'en cours');
    
    if (hasActiveLocations) {
        showAlert('Impossible de supprimer ce client : il a des locations en cours', 'error');
        return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.nom}" ?`)) {
        try {
            showAlert('Suppression en cours...', 'info');
            await deleteClientFromFirebase(clientId);
            showAlert('Client supprimé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression du client:', error);
            showAlert('Erreur lors de la suppression du client', 'error');
        }
    }
}