// Database degli ingredienti con proprietà nutrizionali e caratteristiche per il gelato
// Tutti i valori sono per 100g di prodotto
const ingredientsDB = {
    "Latte Intero": {
        water: 87.5,
        sugars: 4.8,
        fats: 3.5,
        proteins: 3.3,
        otherSolids: 0.9,
        pod: 4.8,    // Potere Dolcificante
        pac: 30      // Potere Anticongelante
    },
    "Latte Scremato": {
        water: 90.5,
        sugars: 5.0,
        fats: 0.2,
        proteins: 3.5,
        otherSolids: 0.8,
        pod: 5.0,
        pac: 32
    },
    "Panna 35%": {
        water: 62.0,
        sugars: 3.5,
        fats: 35.0,
        proteins: 2.5,
        otherSolids: 0.5,
        pod: 3.5,
        pac: 22
    },
    "Panna 35% UHT": {
        water: 59.0,
        sugars: 3.3,
        fats: 35.0,
        proteins: 2.2,
        otherSolids: 0.5,
        pod: 3.3,
        pac: 20
    },
    "Latte Condensato": {
        water: 27.0,
        sugars: 55.0,
        fats: 8.0,
        proteins: 8.0,
        otherSolids: 2.0,
        pod: 55.0,
        pac: 260
    },
    "Latte in Polvere": {
        water: 3.0,
        sugars: 38.0,
        fats: 26.0,
        proteins: 26.0,
        otherSolids: 7.0,
        pod: 38.0,
        pac: 180
    },
    "Uova Intere": {
        water: 76.0,
        sugars: 0.7,
        fats: 10.5,
        proteins: 12.5,
        otherSolids: 0.3,
        pod: 0.7,
        pac: 8
    },
    "Tuorli d'Uovo": {
        water: 50.0,
        sugars: 0.5,
        fats: 31.0,
        proteins: 16.0,
        otherSolids: 2.5,
        pod: 0.5,
        pac: 5
    },
    "Zucchero Semolato": {
        water: 0.5,
        sugars: 99.5,
        fats: 0.0,
        proteins: 0.0,
        otherSolids: 0.0,
        pod: 100.0,
        pac: 190
    },
    "Destrosio": {
        water: 0.5,
        sugars: 99.5,
        fats: 0.0,
        proteins: 0.0,
        otherSolids: 0.0,
        pod: 70.0,
        pac: 190
    },
    "Sciroppo di Glucosio": {
        water: 20.0,
        sugars: 78.0,
        fats: 0.0,
        proteins: 0.0,
        otherSolids: 2.0,
        pod: 35.0,
        pac: 150
    },
    "Miele": {
        water: 17.0,
        sugars: 82.0,
        fats: 0.0,
        proteins: 0.3,
        otherSolids: 0.7,
        pod: 130.0,
        pac: 190
    },
    "Cacao Amaro in Polvere": {
        water: 3.0,
        sugars: 2.0,
        fats: 20.0,
        proteins: 20.0,
        otherSolids: 55.0,
        pod: 2.0,
        pac: 5
    },
    "Cioccolato Fondente": {
        water: 1.0,
        sugars: 47.0,
        fats: 35.0,
        proteins: 6.0,
        otherSolids: 11.0,
        pod: 47.0,
        pac: 90
    },
    "Nocciole": {
        water: 5.0,
        sugars: 4.0,
        fats: 62.0,
        proteins: 15.0,
        otherSolids: 14.0,
        pod: 4.0,
        pac: 8
    },
    "Mandorle": {
        water: 5.0,
        sugars: 4.0,
        fats: 50.0,
        proteins: 21.0,
        otherSolids: 20.0,
        pod: 4.0,
        pac: 8
    },
    "Pistacchi": {
        water: 4.0,
        sugars: 8.0,
        fats: 45.0,
        proteins: 20.0,
        otherSolids: 23.0,
        pod: 8.0,
        pac: 15
    },
    "Pasta di Nocciole": {
        water: 2.0,
        sugars: 5.0,
        fats: 65.0,
        proteins: 15.0,
        otherSolids: 13.0,
        pod: 5.0,
        pac: 10
    },
    "Pasta di Pistacchio": {
        water: 2.0,
        sugars: 8.0,
        fats: 55.0,
        proteins: 20.0,
        otherSolids: 15.0,
        pod: 8.0,
        pac: 15
    },
    "Burro": {
        water: 16.0,
        sugars: 0.5,
        fats: 82.0,
        proteins: 0.8,
        otherSolids: 0.7,
        pod: 0.5,
        pac: 3
    },
    "Mascarpone": {
        water: 49.0,
        sugars: 3.0,
        fats: 42.0,
        proteins: 5.0,
        otherSolids: 1.0,
        pod: 3.0,
        pac: 18
    },
    "Ricotta": {
        water: 74.0,
        sugars: 3.5,
        fats: 13.0,
        proteins: 8.5,
        otherSolids: 1.0,
        pod: 3.5,
        pac: 20
    },
    "Yogurt Intero": {
        water: 88.0,
        sugars: 4.0,
        fats: 3.5,
        proteins: 3.5,
        otherSolids: 1.0,
        pod: 4.0,
        pac: 24
    },
    "Fragole": {
        water: 90.0,
        sugars: 5.5,
        fats: 0.4,
        proteins: 0.7,
        otherSolids: 3.4,
        pod: 5.5,
        pac: 35
    },
    "Banane": {
        water: 75.0,
        sugars: 20.0,
        fats: 0.3,
        proteins: 1.1,
        otherSolids: 3.6,
        pod: 20.0,
        pac: 120
    },
    "Limone (succo)": {
        water: 91.0,
        sugars: 2.5,
        fats: 0.3,
        proteins: 0.4,
        otherSolids: 5.8,
        pod: 2.5,
        pac: 15
    },
    "Vaniglia (estratto)": {
        water: 35.0,
        sugars: 12.0,
        fats: 0.1,
        proteins: 0.1,
        otherSolids: 52.8,
        pod: 12.0,
        pac: 70
    },
    "Stabilizzante/Addensante": {
        water: 8.0,
        sugars: 0.0,
        fats: 0.0,
        proteins: 0.0,
        otherSolids: 92.0,
        pod: 0.0,
        pac: 0
    },
    "Neutro per Gelato": {
        water: 5.0,
        sugars: 70.0,
        fats: 0.0,
        proteins: 0.0,
        otherSolids: 25.0,
        pod: 70.0,
        pac: 130
    }
};

// Array degli ingredienti aggiunti alla ricetta
let recipe = [];

// Inizializza l'applicazione
function init() {
    populateIngredientSelect();
    setupEventListeners();
    updateDisplay();
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
    
    // Permetti di premere Enter per aggiungere
    document.getElementById('weight-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addIngredient();
        }
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

// Pulisci la ricetta
function clearRecipe() {
    if (recipe.length > 0) {
        if (confirm('Vuoi iniziare una nuova preparazione? Tutti gli ingredienti verranno rimossi.')) {
            recipe = [];
            updateDisplay();
        }
    }
}

// Aggiorna tutta la visualizzazione
function updateDisplay() {
    updateIngredientsList();
    updateResults();
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
            <button class="btn-danger" onclick="removeIngredient(${item.id})">Rimuovi</button>
        </div>
    `).join('');
}

// Calcola e aggiorna i risultati
function updateResults() {
    const totals = calculateTotals();
    
    // Peso totale
    document.getElementById('total-weight').textContent = `${totals.totalWeight.toFixed(1)} g`;
    
    // Macronutrienti
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

// Inizializza l'app quando il DOM è pronto
document.addEventListener('DOMContentLoaded', init);
