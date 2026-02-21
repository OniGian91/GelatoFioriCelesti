// Database degli ingredienti - caricato da ingredientsDB.js
// let ingredientsDB definito in ingredientsDB.js

// Array degli ingredienti aggiunti alla ricetta
let recipe = [];
let flavorName = 'Gelato Artigianale';
let isFlavorConfirmed = false;
let currentUser = null;

// Inizializza l'applicazione
function init() {
    populateIngredientSelect();
    setupEventListeners();
    updateDisplay();
    // Nascondi tutto tranne la sezione preparazione all'inizio
    hideWorkingSections();
    // Controlla se c'è un utente salvato
    checkSavedUser();
}

// Popola il select con gli ingredienti
function populateIngredientSelect() {
    const select = document.getElementById('ingredient-select');
    const ingredients = Object.keys(ingredientsDB).sort();
    
    ingredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient;
        option.textContent = ingredient;
        select.appendChild(option);
    });
}

// Setup degli event listeners
function setupEventListeners() {
    document.getElementById('add-btn').addEventListener('click', addIngredient);
    document.getElementById('clear-btn').addEventListener('click', clearRecipe);
    document.getElementById('generate-label-btn').addEventListener('click', generateLabel);
    document.getElementById('confirm-flavor-btn').addEventListener('click', confirmFlavorName);
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Permetti di premere Enter per fare login
    document.getElementById('username-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Event listener per il nome del gusto - solo aggiornamento valore
    document.getElementById('flavor-name-input').addEventListener('input', (e) => {
        flavorName = e.target.value.trim() || 'Gelato Artigianale';
    });
    
    // Permetti di premere Enter per confermare il gusto
    document.getElementById('flavor-name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmFlavorName();
        }
    });
    
    // Permetti di premere Enter per aggiungere ingrediente
    document.getElementById('weight-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });
    
    // Event listener per chiudere il modale
    const modal = document.getElementById('ingredient-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', closeIngredientModal);
    
    // Chiudi il modale cliccando fuori
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeIngredientModal();
        }
    });
    
    // Chiudi il modale con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeIngredientModal();
        }
    });
}

// Gestisce il login dell'utente
function handleLogin() {
    const input = document.getElementById('username-input');
    const username = input.value.trim();
    
    if (!username) {
        alert('Inserisci il tuo nome per continuare.');
        input.focus();
        return;
    }
    
    currentUser = username;
    
    // Salva il nome utente in localStorage
    localStorage.setItem('gelatoUserName', username);
    
    // Nascondi il form di login
    document.getElementById('login-form').classList.add('hidden');
    
    // Mostra le info utente
    document.getElementById('username-display').textContent = username;
    document.getElementById('user-info').classList.remove('hidden');
    
    // Mostra il contenuto principale
    showMainContent();
}

// Gestisce il logout dell'utente
function handleLogout() {
    if (confirm('Vuoi effettuare il logout? Tutti i dati della ricetta corrente verranno persi.')) {
        // Rimuovi il dato da localStorage
        localStorage.removeItem('gelatoUserName');
        
        // Ricarica la pagina per ripartire da zero
        location.reload();
    }
}

// Controlla se c'è un utente salvato e fa login automatico
function checkSavedUser() {
    const savedUsername = localStorage.getItem('gelatoUserName');
    
    if (savedUsername) {
        // Utente già loggato, ripristina la sessione
        currentUser = savedUsername;
        document.getElementById('username-display').textContent = savedUsername;
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        showMainContent();
    } else {
        // Nessun utente salvato, nascondi il contenuto principale
        hideMainContent();
    }
}

// Nascondi il contenuto principale
function hideMainContent() {
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('hidden');
    }
}

// Mostra il contenuto principale
function showMainContent() {
    const main = document.querySelector('main');
    if (main) {
        main.classList.remove('hidden');
    }
}

// Conferma il nome del gusto e mostra le sezioni di lavoro
function confirmFlavorName() {
    const input = document.getElementById('flavor-name-input');
    const name = input.value.trim();
    
    if (!name) {
        alert('Inserisci il nome del gusto per continuare.');
        input.focus();
        return;
    }
    
    flavorName = name;
    isFlavorConfirmed = true;
    
    // Nascondi il form e mostra l'header con il gusto
    document.getElementById('flavor-name-form').classList.add('hidden');
    document.getElementById('preparation-header').classList.remove('hidden');
    document.getElementById('flavor-label-display').textContent = flavorName;
    
    // Mostra le sezioni di lavoro
    showWorkingSections();
    
    // Aggiorna i badge del gusto
    updateFlavorBadges();
}

// Nascondi le sezioni di lavoro
function hideWorkingSections() {
    document.getElementById('add-ingredient-section').classList.add('hidden');
    document.getElementById('ingredients-list-section').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
    document.getElementById('print-section').classList.add('hidden');
}

// Mostra le sezioni di lavoro
function showWorkingSections() {
    document.getElementById('add-ingredient-section').classList.remove('hidden');
    document.getElementById('ingredients-list-section').classList.remove('hidden');
    document.getElementById('results-section').classList.remove('hidden');
    document.getElementById('print-section').classList.remove('hidden');
}

// Aggiorna i badge del gusto in tutte le sezioni
function updateFlavorBadges() {
    const badges = ['flavor-badge-add', 'flavor-badge-list', 'flavor-badge-results', 'flavor-badge-print'];
    badges.forEach(id => {
        document.getElementById(id).textContent = flavorName;
    });
}

// Aggiungi un ingrediente alla ricetta
function addIngredient() {
    const select = document.getElementById('ingredient-select');
    const weightInput = document.getElementById('weight-input');
    
    const ingredientName = select.value;
    const weight = parseFloat(weightInput.value);
    
    if (!ingredientName) {
        alert('Seleziona un ingrediente!');
        return;
    }
    
    if (!weight || weight <= 0) {
        alert('Inserisci un peso valido!');
        return;
    }
    
    // Aggiungi alla ricetta
    recipe.push({
        id: Date.now(),
        name: ingredientName,
        weight: weight
    });
    
    // Reset degli input
    select.value = '';
    weightInput.value = '';
    
    // Aggiorna visualizzazione
    updateDisplay();
}

// Rimuovi un ingrediente dalla ricetta
function removeIngredient(id) {
    recipe = recipe.filter(item => item.id !== id);
    updateDisplay();
}

// Modifica il peso di un ingrediente
function updateWeight(id, newWeight) {
    const item = recipe.find(item => item.id === id);
    if (item) {
        item.weight = parseFloat(newWeight);
        updateDisplay();
    }
}

// Pulisci la ricetta e ricarica la pagina
function clearRecipe() {
    if (confirm('Vuoi iniziare una nuova preparazione? Tutti i dati verranno persi.')) {
        // Ricarica la pagina per ricominciare da zero
        location.reload();
    }
}

// Aggiorna tutta la visualizzazione
function updateDisplay() {
    updateIngredientsList();
    updateResults();
    updateIngredientsBlocks();
}

// Aggiorna la lista degli ingredienti
function updateIngredientsList() {
    const listContainer = document.getElementById('ingredients-list');
    
    if (recipe.length === 0) {
        listContainer.innerHTML = '<p class="empty-message">Nessun ingrediente aggiunto. Inizia aggiungendo degli ingredienti!</p>';
        return;
    }
    
    listContainer.innerHTML = recipe.map(item => `
        <div class="ingredient-item">
            <span class="ingredient-name">${item.name}</span>
            <div class="ingredient-actions">
                <div class="ingredient-weight">
                    <input 
                        type="number" 
                        value="${item.weight}" 
                        min="0" 
                        step="0.1"
                        onchange="updateWeight(${item.id}, this.value)"
                    />
                    <span>g</span>
                </div>
                <button class="btn-info" onclick="showIngredientModal('${item.name.replace(/'/g, "\\'")}')" title="Visualizza dati ingrediente"><i class="fas fa-info-circle"></i></button>
                <button class="btn-danger" onclick="removeIngredient(${item.id})" title="Rimuovi ingrediente"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');
}

// Genera un colore per un ingrediente basato sul suo nome
function getIngredientColor(name, index) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
        '#FF8FA3', '#C9ADA7', '#A8DADC', '#F4A261', '#E9C46A',
        '#2A9D8F', '#E76F51', '#8E7DBE', '#F4978E', '#84A59D'
    ];
    return colors[index % colors.length];
}

// Aggiorna la visualizzazione dei blocchi ingredienti
function updateIngredientsBlocks() {
    const blocksContainer = document.getElementById('ingredients-blocks');
    
    if (recipe.length === 0) {
        blocksContainer.innerHTML = '<p class="no-ingredients-message">Aggiungi ingredienti per vedere la composizione</p>';
        return;
    }
    
    // Calcola peso totale per le proporzioni
    const totalWeight = recipe.reduce((sum, item) => sum + item.weight, 0);
    
    // Crea i blocchi
    blocksContainer.innerHTML = recipe.map((item, index) => {
        const percentage = (item.weight / totalWeight * 100).toFixed(1);
        const color = getIngredientColor(item.name, index);
        
        return `
            <div class="ingredient-block" style="flex-grow: ${item.weight}; background-color: ${color}; cursor: pointer;" onclick="showIngredientModal('${item.name.replace(/'/g, "\\'")}')" title="Clicca per vedere i dettagli di ${item.name}">
                <div class="ingredient-block-content">
                    <div class="ingredient-block-name">${item.name}</div>
                    <div class="ingredient-block-weight">${item.weight}g</div>
                    <div class="ingredient-block-percent">${percentage}%</div>
                </div>
            </div>
        `;
    }).join('');
}

// Calcola e aggiorna i risultati
function updateResults() {
    const totals = calculateTotals();
    
    // Peso totale
    document.getElementById('total-weight-display').textContent = `${totals.totalWeight.toFixed(1)} g`;
    
    // Aggiorna i blocchi degli ingredienti  
    updateIngredientsBlocks();
    
    // Macronutrienti - Totale
    document.getElementById('water').textContent = 
        `${totals.water.toFixed(1)} g (${totals.waterPercent.toFixed(1)}%)`;
    document.getElementById('sugars').textContent = 
        `${totals.sugars.toFixed(1)} g (${totals.sugarsPercent.toFixed(1)}%)`;
    document.getElementById('fats').textContent = 
        `${totals.fats.toFixed(1)} g (${totals.fatsPercent.toFixed(1)}%)`;
    document.getElementById('proteins').textContent = 
        `${totals.proteins.toFixed(1)} g (${totals.proteinsPercent.toFixed(1)}%)`;
    document.getElementById('other-solids').textContent = 
        `${totals.otherSolids.toFixed(1)} g (${totals.otherSolidsPercent.toFixed(1)}%)`;
    
    // Macronutrienti - per 100g
    const water100g = totals.totalWeight > 0 ? (totals.water / totals.totalWeight) * 100 : 0;
    const sugars100g = totals.totalWeight > 0 ? (totals.sugars / totals.totalWeight) * 100 : 0;
    const fats100g = totals.totalWeight > 0 ? (totals.fats / totals.totalWeight) * 100 : 0;
    const proteins100g = totals.totalWeight > 0 ? (totals.proteins / totals.totalWeight) * 100 : 0;
    const otherSolids100g = totals.totalWeight > 0 ? (totals.otherSolids / totals.totalWeight) * 100 : 0;
    
    document.getElementById('water-100g').textContent = 
        `${water100g.toFixed(1)} g (${totals.waterPercent.toFixed(1)}%)`;
    document.getElementById('sugars-100g').textContent = 
        `${sugars100g.toFixed(1)} g (${totals.sugarsPercent.toFixed(1)}%)`;
    document.getElementById('fats-100g').textContent = 
        `${fats100g.toFixed(1)} g (${totals.fatsPercent.toFixed(1)}%)`;
    document.getElementById('proteins-100g').textContent = 
        `${proteins100g.toFixed(1)} g (${totals.proteinsPercent.toFixed(1)}%)`;
    document.getElementById('other-solids-100g').textContent = 
        `${otherSolids100g.toFixed(1)} g (${totals.otherSolidsPercent.toFixed(1)}%)`;
    
    // Proprietà del gelato
    document.getElementById('pod').textContent = totals.pod.toFixed(1);
    document.getElementById('pac').textContent = totals.pac.toFixed(1);
    document.getElementById('total-solids').textContent = 
        `${totals.totalSolidsPercent.toFixed(1)}% ${getSolidsStatus(totals.totalSolidsPercent)}`;
    document.getElementById('total-fats-percent').textContent = 
        `${totals.fatsPercent.toFixed(1)}% ${getFatsStatus(totals.fatsPercent)}`;
}

// Calcola tutti i totali
function calculateTotals() {
    let totalWeight = 0;
    let water = 0, sugars = 0, fats = 0, proteins = 0, otherSolids = 0;
    let pod = 0, pac = 0;
    
    recipe.forEach(item => {
        const ingredient = ingredientsDB[item.name];
        const factor = item.weight / 100; // Fattore di conversione da 100g
        
        totalWeight += item.weight;
        water += ingredient.water * factor;
        sugars += ingredient.sugars * factor;
        fats += ingredient.fats * factor;
        proteins += ingredient.proteins * factor;
        otherSolids += ingredient.otherSolids * factor;
        pod += ingredient.pod * factor;
        pac += ingredient.pac * factor;
    });
    
    // Calcola percentuali
    const waterPercent = totalWeight > 0 ? (water / totalWeight) * 100 : 0;
    const sugarsPercent = totalWeight > 0 ? (sugars / totalWeight) * 100 : 0;
    const fatsPercent = totalWeight > 0 ? (fats / totalWeight) * 100 : 0;
    const proteinsPercent = totalWeight > 0 ? (proteins / totalWeight) * 100 : 0;
    const otherSolidsPercent = totalWeight > 0 ? (otherSolids / totalWeight) * 100 : 0;
    
    const totalSolidsPercent = 100 - waterPercent;
    
    return {
        totalWeight,
        water, sugars, fats, proteins, otherSolids,
        waterPercent, sugarsPercent, fatsPercent, proteinsPercent, otherSolidsPercent,
        totalSolidsPercent,
        pod, pac
    };
}

// Valuta lo stato dei solidi totali
function getSolidsStatus(percent) {
    if (percent >= 36 && percent <= 42) {
        return '✓ Ottimale';
    } else if (percent >= 33 && percent < 36) {
        return '⚠ Basso';
    } else if (percent > 42 && percent <= 45) {
        return '⚠ Alto';
    } else if (percent < 33) {
        return '✗ Troppo basso';
    } else {
        return '✗ Troppo alto';
    }
}

// Valuta lo stato dei grassi
function getFatsStatus(percent) {
    if (percent >= 6 && percent <= 10) {
        return '✓ Ottimale';
    } else if (percent >= 4 && percent < 6) {
        return '⚠ Basso';
    } else if (percent > 10 && percent <= 12) {
        return '⚠ Alto';
    } else if (percent < 4) {
        return '✗ Troppo basso';
    } else {
        return '✗ Troppo alto';
    }
}

// Genera etichetta per stampa
function generateLabel() {
    if (recipe.length === 0) {
        alert('Aggiungi almeno un ingrediente prima di generare l\'etichetta!');
        return;
    }
    
    const totals = calculateTotals();
    const labelContainer = document.getElementById('label-container');
    
    // Mostra il container dell'etichetta
    labelContainer.classList.remove('hidden');
    
    // Aggiorna il nome del gusto nell'etichetta
    document.getElementById('label-flavor-name').textContent = flavorName;
    
    // Ordina gli ingredienti per peso (dal più presente al meno)
    const sortedIngredients = [...recipe].sort((a, b) => b.weight - a.weight);
    
    // Genera la lista degli ingredienti
    const ingredientsList = sortedIngredients.map(item => item.name).join(', ').toLowerCase();
    document.getElementById('label-ingredients').textContent = ingredientsList + '.';
    
    // Calcola valori nutrizionali per 100g
    const water100g = totals.totalWeight > 0 ? (totals.water / totals.totalWeight) * 100 : 0;
    const sugars100g = totals.totalWeight > 0 ? (totals.sugars / totals.totalWeight) * 100 : 0;
    const fats100g = totals.totalWeight > 0 ? (totals.fats / totals.totalWeight) * 100 : 0;
    const proteins100g = totals.totalWeight > 0 ? (totals.proteins / totals.totalWeight) * 100 : 0;
    const otherSolids100g = totals.totalWeight > 0 ? (totals.otherSolids / totals.totalWeight) * 100 : 0;
    
    // Calcola carboidrati totali (zuccheri + altri carboidrati approssimativi)
    const carbs100g = sugars100g; // Per gelato, la maggior parte dei carboidrati sono zuccheri
    
    // Calcola energia (kcal per 100g)
    // Grassi: 9 kcal/g, Carboidrati: 4 kcal/g, Proteine: 4 kcal/g
    const kcal = (fats100g * 9) + (carbs100g * 4) + (proteins100g * 4);
    const kj = kcal * 4.184; // Conversione kcal a kJ
    
    // Popola la tabella nutrizionale
    document.getElementById('label-energy').textContent = `${Math.round(kj)} kJ / ${Math.round(kcal)} kcal`;
    document.getElementById('label-fats').textContent = `${fats100g.toFixed(1)} g`;
    document.getElementById('label-saturated').textContent = `${(fats100g * 0.6).toFixed(1)} g`; // Stima ~60% saturi
    document.getElementById('label-carbs').textContent = `${carbs100g.toFixed(1)} g`;
    document.getElementById('label-sugars').textContent = `${sugars100g.toFixed(1)} g`;
    document.getElementById('label-proteins').textContent = `${proteins100g.toFixed(1)} g`;
    
    // Scroll verso l'etichetta
    labelContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Mostra il modale con i dati dell'ingrediente
function showIngredientModal(ingredientName) {
    const ingredient = ingredientsDB[ingredientName];
    
    if (!ingredient) {
        console.error('Ingrediente non trovato:', ingredientName);
        return;
    }
    
    // Popola il modale
    document.getElementById('modal-ingredient-name').textContent = ingredientName;
    document.getElementById('modal-water').textContent = `${ingredient.water.toFixed(1)}%`;
    document.getElementById('modal-sugars').textContent = `${ingredient.sugars.toFixed(1)}%`;
    document.getElementById('modal-fats').textContent = `${ingredient.fats.toFixed(1)}%`;
    document.getElementById('modal-proteins').textContent = `${ingredient.proteins.toFixed(1)}%`;
    document.getElementById('modal-other-solids').textContent = `${ingredient.otherSolids.toFixed(1)}%`;
    document.getElementById('modal-pod').textContent = ingredient.pod.toFixed(1);
    document.getElementById('modal-pac').textContent = ingredient.pac.toFixed(1);
    
    // Mostra il modale
    const modal = document.getElementById('ingredient-modal');
    modal.style.display = 'block';
}

// Chiudi il modale
function closeIngredientModal() {
    const modal = document.getElementById('ingredient-modal');
    modal.style.display = 'none';
}

// Inizializza l'app quando il DOM è pronto
document.addEventListener('DOMContentLoaded', init);
