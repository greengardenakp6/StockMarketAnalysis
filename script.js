class StockAnalysisApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeStocks();
        });
    }

    async analyzeStocks() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Validate dates
        if (!startDate || !endDate) {
            this.showError('Please select both start and end dates');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            this.showError('Start date must be before end date');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBaseUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                })
            });

            const data = await response.json();

            if (data.success) {
                this.displayResults(data.data);
            } else {
                this.showError(data.message || 'Analysis failed');
            }
        } catch (error) {
            this.showError('Network error: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        // Update metrics
        document.getElementById('mainTrendStock').textContent = data.analysis.main_trend_stock;
        document.getElementById('varianceExplained').textContent = 
            data.analysis.variance_explained.toFixed(2) + '%';
        document.getElementById('totalVariance').textContent = 
            data.analysis.total_variance.toFixed(6);

        // Display charts
        document.getElementById('trendChart').src = `data:image/png;base64,${data.trend_chart}`;
        document.getElementById('returnsChart').src = `data:image/png;base64,${data.returns_chart}`;

        // Display stock prices table
        this.displayStockPrices(data.stock_prices);

        // Display eigenvalues and eigenvectors table
        this.displayEigenData(data.eigenvalues, data.eigenvectors);

        // Show results section
        document.getElementById('resultsSection').classList.remove('hidden');
    }

    displayStockPrices(pricesData) {
        const tableBody = document.querySelector('#pricesTable tbody');
        tableBody.innerHTML = '';

        const dates = Object.keys(pricesData);
        const stocks = Object.keys(pricesData[dates[0]] || {});

        dates.slice(-5).forEach(date => {
            const row = document.createElement('tr');
            
            // Date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(date).toLocaleDateString();
            row.appendChild(dateCell);

            // Stock price cells
            stocks.forEach(stock => {
                const priceCell = document.createElement('td');
                priceCell.textContent = pricesData[date][stock].toFixed(2);
                row.appendChild(priceCell);
            });

            tableBody.appendChild(row);
        });
    }

    displayEigenData(eigenvalues, eigenvectors) {
        const tableBody = document.querySelector('#eigenTable tbody');
        tableBody.innerHTML = '';

        const stocks = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ITC.NS'];

        eigenvalues.forEach((eigenvalue, index) => {
            const row = document.createElement('tr');
            
            // Component cell
            const compCell = document.createElement('td');
            compCell.textContent = `PC${index + 1}`;
            compCell.style.fontWeight = 'bold';
            row.appendChild(compCell);

            // Eigenvalue cell
            const evalCell = document.createElement('td');
            evalCell.textContent = eigenvalue.toFixed(6);
            row.appendChild(evalCell);

            // Eigenvector cells
            eigenvectors[index].forEach((value, stockIndex) => {
                const vecCell = document.createElement('td');
                vecCell.textContent = value.toFixed(4);
                
                // Highlight the main component
                if (index === 0) {
                    vecCell.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
                    vecCell.style.color = 'white';
                    vecCell.style.fontWeight = 'bold';
                }
                
                row.appendChild(vecCell);
            });

            tableBody.appendChild(row);
        });
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.remove('hidden');
            document.getElementById('resultsSection').classList.add('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }

    showError(message) {
        alert('Error: ' + message);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StockAnalysisApp();
});
