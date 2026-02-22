// Database degli ingredienti - caricato da ingredientsDB.js
// let ingredientsDB definito in ingredientsDB.js

// Array degli ingredienti aggiunti alla ricetta
let recipe = [];
let flavorName = 'Gelato Artigianale';
let isFlavorConfirmed = false;
let currentUser = null;
let allowNavigation = false; // Flag per permettere navigazione senza conferma

// Inizializza l'applicazione
function init() {
    populateIngredientSelect();
    setupEventListeners();
    updateDisplay();
    // Nascondi tutto tranne la sezione preparazione all'inizio
    hideWorkingSections();
    // Controlla se c'è un utente salvato
    checkSavedUser();
    // Controlla se c'è una ricetta da caricare
    checkRecipeToLoad();
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
    document.getElementById('save-recipe-btn').addEventListener('click', saveRecipe);
    document.getElementById('print-recipe-btn').addEventListener('click', showPrintRecipe);
    document.getElementById('print-label-btn').addEventListener('click', showPrintLabel);
    document.getElementById('clear-btn').addEventListener('click', clearRecipe);
    document.getElementById('confirm-flavor-btn').addEventListener('click', confirmFlavorName);
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('edit-flavor-btn').addEventListener('click', editFlavorName);
    
    // Event listener per il pulsante "Torna alla Home"
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', (e) => {
            // Controlla se c'è lavoro in corso
            if (isFlavorConfirmed || recipe.length > 0) {
                if (confirm('Hai una preparazione in corso. Se torni alla home, perderai tutti i dati non salvati. Continuare?')) {
                    // L'utente ha confermato, permetti la navigazione senza ulteriori conferme
                    allowNavigation = true;
                } else {
                    e.preventDefault(); // Blocca la navigazione
                }
            }
        });
    }
    
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
    
    // Previeni la chiusura/ricarica della pagina se ci sono dati non salvati
    window.addEventListener('beforeunload', (e) => {
        // Non mostrare la conferma se l'utente ha già confermato la navigazione
        if (allowNavigation) {
            return;
        }
        
        // Controlla se c'è lavoro in corso
        if (isFlavorConfirmed || recipe.length > 0) {
            e.preventDefault();
            e.returnValue = ''; // Necessario per Chrome
            return ''; // Necessario per alcuni browser
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
    
    // Capitalizza la prima lettera del nome
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
    currentUser = capitalizedUsername;
    
    // Salva il nome utente in localStorage
    localStorage.setItem('gelatoUserName', capitalizedUsername);
    
    // Nascondi il form di login
    document.getElementById('login-form').classList.add('hidden');
    
    // Mostra le info utente
    document.getElementById('username-display').textContent = capitalizedUsername;
    const userIcon = document.querySelector('.user-icon');
    userIcon.src = `imgs/${capitalizedUsername}.png`;
    userIcon.onerror = function() { this.src = 'imgs/logged_user.png'; };
    document.getElementById('user-info').classList.remove('hidden');
    
    // Mostra il contenuto principale
    showMainContent();
    
    // Mostra la sezione history e carica i dati
    showHistorySection();
    updateHistoryDisplay();
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
        const userIcon = document.querySelector('.user-icon');
        userIcon.src = `imgs/${savedUsername}.png`;
        userIcon.onerror = function() { this.src = 'imgs/logged_user.png'; };
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        showMainContent();
        showHistorySection();
        updateHistoryDisplay();
    } else {
        // Nessun utente salvato, nascondi il contenuto principale
        hideMainContent();
    }
}

// Controlla se c'è una ricetta da caricare dal ricettario
function checkRecipeToLoad() {
    const recipeToLoad = localStorage.getItem('gelatoRecipeToLoad');
    
    if (recipeToLoad) {
        try {
            const data = JSON.parse(recipeToLoad);
            
            // Se c'è un utente associato alla ricetta e non c'è utente loggato, fai login
            if (data.userName && !currentUser) {
                currentUser = data.userName;
                localStorage.setItem('gelatoUserName', data.userName);
                document.getElementById('username-display').textContent = data.userName;
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('user-info').classList.remove('hidden');
                showMainContent();
                showHistorySection();
            }
            
            // Carica il nome del gusto
            flavorName = data.flavorName;
            document.getElementById('flavor-name-input').value = flavorName;
            
            // Conferma automaticamente il gusto
            isFlavorConfirmed = true;
            document.getElementById('flavor-name-form').classList.add('hidden');
            document.getElementById('preparation-header').classList.remove('hidden');
            document.getElementById('flavor-label-display').textContent = flavorName;
            
            // Mostra le sezioni di lavoro
            showWorkingSections();
            
            // Carica gli ingredienti
            recipe = data.recipe.map(item => ({
                ...item,
                id: Date.now() + Math.random() // Nuovo ID univoco
            }));
            
            // Aggiorna la visualizzazione
            updateDisplay();
            
            // Rimuovi la ricetta da caricare
            localStorage.removeItem('gelatoRecipeToLoad');
            
            // Scorri verso la lista ingredienti
            setTimeout(() => {
                document.getElementById('ingredients-list-section').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 300);
            
        } catch (error) {
            console.error('Errore nel caricamento della ricetta:', error);
            localStorage.removeItem('gelatoRecipeToLoad');
        }
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

// Mostra la sezione history
function showHistorySection() {
    const historySection = document.getElementById('history-section');
    if (historySection) {
        historySection.classList.remove('hidden');
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
}

// Modifica il nome del gusto
function editFlavorName() {
    const newName = prompt('Inserisci il nuovo nome del gusto:', flavorName);
    
    if (newName && newName.trim()) {
        flavorName = newName.trim();
        
        // Aggiorna il display del nome
        document.getElementById('flavor-label-display').textContent = flavorName;
        
        // Se l'etichetta è già stata generata, aggiorna anche quella
        const labelFlavorName = document.getElementById('label-flavor-name');
        if (labelFlavorName) {
            labelFlavorName.textContent = `Gelato al gusto ${flavorName.toLowerCase()}`;
        }
    }
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
}

// Aggiorna i badge del gusto in tutte le sezioni
// NOTA: Funzione deprecata - i flavor-badge sono stati rimossi dall'interfaccia
/*
function updateFlavorBadges() {
    const badges = ['flavor-badge-add', 'flavor-badge-list', 'flavor-badge-results', 'flavor-badge-print'];
    badges.forEach(id => {
        document.getElementById(id).textContent = flavorName;
    });
}
*/

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
                        step="1"
                        onchange="updateWeight(${item.id}, this.value)"
                    />
                    <span>grammi</span>
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
    const weightKg = (totals.totalWeight / 1000).toFixed(3);
    document.getElementById('total-weight-display').textContent = `${totals.totalWeight.toFixed(1)} g (${weightKg} kg)`;
    
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

// Salva la ricetta (con controllo sovrascrittura)
function saveRecipe() {
    if (recipe.length === 0) {
        alert('Aggiungi almeno un ingrediente prima di salvare la ricetta!');
        return;
    }

    // Recupera l'history esistente
    let history = JSON.parse(localStorage.getItem('gelatoHistory') || '[]');
    
    // Controlla se esiste già una ricetta con lo stesso nome
    const existingIndex = history.findIndex(entry => 
        entry.flavorName.toLowerCase() === flavorName.toLowerCase()
    );
    
    if (existingIndex !== -1) {
        // Ricetta esistente, chiedi conferma per sovrascrivere
        if (!confirm(`Esiste già una ricetta con il nome "${flavorName}". Vuoi sovrascriverla?`)) {
            return;
        }
        // Rimuovi la ricetta esistente
        history.splice(existingIndex, 1);
    }
    
    // Crea la nuova entry
    const historyEntry = {
        flavorName: flavorName,
        userName: currentUser,
        date: Date.now(),
        recipe: JSON.parse(JSON.stringify(recipe)) // Deep copy
    };
    
    // Aggiungi la nuova ricetta all'inizio
    history.unshift(historyEntry);
    
    // Mantieni solo le ultime 10
    history = history.slice(0, 10);
    
    // Salva nell'localStorage
    localStorage.setItem('gelatoHistory', JSON.stringify(history));
    
    // Aggiorna la visualizzazione della history
    updateHistoryDisplay();
    
    // Mostra messaggio di successo
    alert(`Ricetta "${flavorName}" salvata con successo!`);
}

// Mostra l'etichetta per la stampa
function showPrintLabel() {
    if (recipe.length === 0) {
        alert('Aggiungi almeno un ingrediente prima di stampare l\'etichetta!');
        return;
    }
    
    const totals = calculateTotals();
    const labelContainer = document.getElementById('label-container');
    const printSection = document.getElementById('print-section');
    const recipePrintSection = document.getElementById('recipe-print-section');
    
    // Nascondi la sezione ricetta
    recipePrintSection.classList.add('hidden');
    
    // Mostra la sezione etichetta e il container
    printSection.classList.remove('hidden');
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

// Mostra la ricetta per la stampa
function showPrintRecipe() {
    if (recipe.length === 0) {
        alert('Aggiungi almeno un ingrediente prima di stampare la ricetta!');
        return;
    }
    
    const totals = calculateTotals();
    const recipeContainer = document.getElementById('recipe-container');
    const recipePrintSection = document.getElementById('recipe-print-section');
    const printSection = document.getElementById('print-section');
    
    // Nascondi la sezione etichetta
    printSection.classList.add('hidden');
    
    // Mostra la sezione ricetta e il container
    recipePrintSection.classList.remove('hidden');
    recipeContainer.classList.remove('hidden');
    
    // Aggiorna il nome del gusto nella ricetta
    document.getElementById('recipe-flavor-name').textContent = flavorName;
    
    // Ordina gli ingredienti per peso (dal più presente al meno)
    const sortedIngredients = [...recipe].sort((a, b) => b.weight - a.weight);
    
    // Genera la tabella degli ingredienti
    const ingredientsBody = document.getElementById('recipe-ingredients-body');
    ingredientsBody.innerHTML = sortedIngredients.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.weight} g</td>
        </tr>
    `).join('');
    
    // Aggiorna il peso totale
    const weightKg = (totals.totalWeight / 1000).toFixed(3);
    document.getElementById('recipe-total-weight').textContent = `${totals.totalWeight.toFixed(1)} g (${weightKg} kg)`;
    
    // Scroll verso la ricetta
    recipeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Genera etichetta (legacy - manteniamo per compatibilità)
function generateLabel() {
    if (recipe.length === 0) {
        alert('Aggiungi almeno un ingrediente prima di generare l\'etichetta!');
        return;
    }
    
    const totals = calculateTotals();
    const labelContainer = document.getElementById('label-container');
    const printSection = document.getElementById('print-section');
    
    // Mostra la sezione etichetta e il container
    printSection.classList.remove('hidden');
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
    
    // Salva nell'history
    saveToHistory();
    
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

// Salva la ricetta corrente nell'history
function saveToHistory() {
    const historyEntry = {
        flavorName: flavorName,
        userName: currentUser,
        date: Date.now(),
        recipe: JSON.parse(JSON.stringify(recipe)) // Deep copy
    };
    
    // Recupera l'history esistente
    let history = JSON.parse(localStorage.getItem('gelatoHistory') || '[]');
    
    // Aggiungi la nuova ricetta all'inizio
    history.unshift(historyEntry);
    
    // Mantieni solo le ultime 10
    history = history.slice(0, 10);
    
    // Salva nell'localStorage
    localStorage.setItem('gelatoHistory', JSON.stringify(history));
    
    // Aggiorna la visualizzazione
    updateHistoryDisplay();
}

// Colori per gli ingredienti (stesso array del ricettario)
const ingredientColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#FF8FA3', '#C9ADA7', '#A8DADC', '#F4A261', '#E9C46A',
    '#2A9D8F', '#E76F51', '#8E7DBE', '#F4978E', '#84A59D'
];

// Genera un colore consistente basato sul nome dell'ingrediente
function getIngredientColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % ingredientColors.length;
    return ingredientColors[index];
}

// Aggiorna la visualizzazione dell'history
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    
    // Se l'elemento non esiste (es. in preparazione.html), esci
    if (!historyList) {
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('gelatoHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-message">Nessuna ricetta salvata ancora.</p>';
        return;
    }
    
    // Mostra solo le prime 3 ricette
    const recentHistory = history.slice(0, 3);
    
    historyList.innerHTML = recentHistory.map((entry, index) => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('it-IT', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Calcola peso totale
        const totalWeight = entry.recipe.reduce((sum, item) => sum + item.weight, 0);
        
        // Ordina ingredienti per peso (dal più pesante al più leggero)
        const sortedIngredients = [...entry.recipe].sort((a, b) => b.weight - a.weight);
        
        // Genera la lista degli ingredienti con colori
        const ingredientsHTML = sortedIngredients.map(item => {
            const color = getIngredientColor(item.name);
            return `
                <li class="history-ingredient-item" style="border-left-color: ${color};">
                    <span class="history-ingredient-name">${item.name}</span>
                    <span class="history-ingredient-weight">${item.weight} g</span>
                </li>
            `;
        }).join('');
        
        return `
            <div class="history-item">
                <div class="history-card-header">
                    <div class="history-title">
                        <div class="history-title-text" title="${entry.flavorName}">
                            <i class="fas fa-ice-cream" style="flex-shrink: 0;"></i>
                            <span class="history-flavor-text">${entry.flavorName}</span>
                        </div>
                        <div class="history-actions">
                            <button class="history-load-btn" onclick="loadFromHistory(${index})" title="Carica questa ricetta">
                                <i class="fas fa-blender"></i>
                            </button>
                            <button class="history-edit-btn" onclick="renameRecipeFromHistory(${index})" title="Rinomina ricetta">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="history-delete-btn" onclick="deleteFromHistory(${index}, event)" title="Elimina ricetta">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="history-meta">
                        <div class="history-meta-item">
                            <img src="imgs/${entry.userName}.png" onerror="this.src='imgs/logged_user.png'" class="history-user-avatar" alt="${entry.userName}">
                            ${entry.userName}
                        </div>
                        <div class="history-meta-item">
                            <i class="fas fa-calendar"></i>
                            ${dateStr}
                        </div>
                        <div class="history-meta-item">
                            <span class="history-weight-badge">
                                <i class="fas fa-weight"></i>
                                ${totalWeight.toFixed(1)} g
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="history-section">
                    <div class="history-section-title">
                        <i class="fas fa-list"></i>
                        Ingredienti (${entry.recipe.length})
                    </div>
                    <ul class="history-ingredients-list">
                        ${ingredientsHTML}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
}

// Carica una ricetta dall'history
function loadFromHistory(index) {
    const history = JSON.parse(localStorage.getItem('gelatoHistory') || '[]');
    const entry = history[index];
    
    if (!entry) {
        alert('Ricetta non trovata nell\'archivio.');
        return;
    }
    
    if (confirm(`Vuoi caricare la ricetta "${entry.flavorName}"? La ricetta corrente verrà sostituita.`)) {
        // Carica la ricetta
        recipe = JSON.parse(JSON.stringify(entry.recipe)); // Deep copy
        flavorName = entry.flavorName;
        
        // Aggiorna l'interfaccia
        document.getElementById('flavor-name-input').value = flavorName;
        
        // Se il gusto non è ancora confermato, confermalo
        if (!isFlavorConfirmed) {
            isFlavorConfirmed = true;
            document.getElementById('flavor-name-form').classList.add('hidden');
            document.getElementById('preparation-header').classList.remove('hidden');
            document.getElementById('flavor-label-display').textContent = flavorName;
            showWorkingSections();
        } else {
            // Altrimenti aggiorna solo il nome
            document.getElementById('flavor-label-display').textContent = flavorName;
        }
        
        // Aggiorna la visualizzazione
        updateDisplay();
        
        // Scroll alla sezione preparazione
        document.querySelector('.preparation-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// Elimina una ricetta dall'history
// Rinomina una ricetta dall'history
function renameRecipeFromHistory(index) {
    const history = JSON.parse(localStorage.getItem('gelatoHistory') || '[]');
    
    if (index < 0 || index >= history.length) {
        alert('Ricetta non trovata nell\'archivio.');
        return;
    }

    const entry = history[index];
    const newName = prompt('Inserisci il nuovo nome per il gelato:', entry.flavorName);
    
    if (newName && newName.trim() !== '') {
        entry.flavorName = newName.trim();
        localStorage.setItem('gelatoHistory', JSON.stringify(history));
        updateHistoryDisplay();
    }
}

// Elimina una ricetta dall'history
function deleteFromHistory(index, event) {
    event.stopPropagation(); // Previene il click sulla card
    
    const history = JSON.parse(localStorage.getItem('gelatoHistory') || '[]');
    const entry = history[index];
    
    if (!entry) {
        alert('Ricetta non trovata nell\'archivio.');
        return;
    }
    
    if (confirm(`Vuoi eliminare la ricetta "${entry.flavorName}" dall'archivio?`)) {
        history.splice(index, 1);
        localStorage.setItem('gelatoHistory', JSON.stringify(history));
        updateHistoryDisplay();
    }
}

// Espandi/Collassa la sezione history
function toggleHistorySection() {
    const historySection = document.getElementById('history-section');
    const toggleIcon = document.getElementById('history-toggle-icon');
    
    historySection.classList.toggle('collapsed');
}

// Inizializza l'app quando il DOM è pronto
document.addEventListener('DOMContentLoaded', init);
