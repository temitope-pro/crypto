// User balance (simulated for now)
let userBalance = 1000;

// Function to fetch cryptocurrency data from CoinGecko API
async function fetchCryptoData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        displayCryptoData(data);
    } catch (error) {
        console.error("Error fetching cryptocurrency data:", error);
    }
}

// Function to display the cryptocurrency data
function displayCryptoData(data) {
    const cryptoList = document.getElementById('crypto-list');
    cryptoList.innerHTML = ''; // Clear any previous data

    data.forEach(crypto => {
        const cryptoItem = document.createElement('div');
        cryptoItem.classList.add('crypto-item');
        
        // Create price change styles
        const priceChangeClass = crypto.price_change_percentage_24h > 0 ? 'up' : 'down';
        const priceChangeText = `${crypto.price_change_percentage_24h.toFixed(2)}%`;

        cryptoItem.innerHTML = `
            <h3>${crypto.name}</h3>
            <p>Symbol: ${crypto.symbol.toUpperCase()}</p>
            <p class="price">$${crypto.current_price.toFixed(2)}</p>
            <p class="percent-change ${priceChangeClass}">${priceChangeText}</p>
            <button class="btn btn-success buy-btn" data-name="${crypto.name}" data-price="${crypto.current_price}">Buy</button>
            <button class="btn btn-danger sell-btn" data-name="${crypto.name}" data-price="${crypto.current_price}">Sell</button>
        `;

        // Append the item to the list
        cryptoList.appendChild(cryptoItem);
    });

    // Add event listeners to the buy/sell buttons
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', openModal);
    });

    document.querySelectorAll('.sell-btn').forEach(button => {
        button.addEventListener('click', openModal);
    });
}

// Function to open modal with crypto details
function openModal(event) {
    const cryptoName = event.target.getAttribute('data-name');
    const cryptoPrice = parseFloat(event.target.getAttribute('data-price'));

    // Set crypto data in modal
    document.getElementById('crypto-name').innerText = `Cryptocurrency: ${cryptoName}`;
    document.getElementById('crypto-price').innerText = `Price: $${cryptoPrice.toFixed(2)}`;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('buySellModal'));
    modal.show();

    // Handle Buy/Sell logic
    const amountInput = document.getElementById('amount');
    const buyButton = document.getElementById('buy-button');
    const sellButton = document.getElementById('sell-button');

    // Buy button event
    buyButton.onclick = () => {
        const amount = parseFloat(amountInput.value);
        const totalCost = amount * cryptoPrice;

        if (totalCost <= userBalance) {
            userBalance -= totalCost;
            document.getElementById('balance').innerText = userBalance.toFixed(2);
            alert(`You bought ${amount} of ${cryptoName} for $${totalCost.toFixed(2)}`);
        } else {
            alert('Insufficient balance');
        }
    };

    // Sell button event
    sellButton.onclick = () => {
        const amount = parseFloat(amountInput.value);
        const totalSellValue = amount * cryptoPrice;

        userBalance += totalSellValue;
        document.getElementById('balance').innerText = userBalance.toFixed(2);
        alert(`You sold ${amount} of ${cryptoName} for $${totalSellValue.toFixed(2)}`);
    };
}

// Fetch data on page load
fetchCryptoData();
var ctx = document.getElementById('cryptoGraph').getContext('2d');
var cryptoGraph = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Bitcoin Price',
            data: [40000, 42000, 44000, 46000, 48000, 50000, 52000], // Sample data
            borderColor: '#27ae60',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});
let counter = 0;

function startCounter() {
    let cryptoCounter = document.getElementById("cryptoCounter");
    let interval = setInterval(function () {
        if (counter >= 20) {
            clearInterval(interval);  // Stop after 20%
        } else {
            counter++;
            cryptoCounter.textContent = counter;  // Update counter value
        }
    }, 100); // Adjust this interval to control the speed of the count
}
