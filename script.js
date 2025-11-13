class StockAnalysisApp {
    constructor() {
        this.apiBaseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:5000/api' 
            : '/api';
        this.initializeEventListeners();
        this.checkAPIStatus();
        this.setDefaultDates();
    }

    setDefaultDates() {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        
        document.getElementById('startDate').value = this.formatDate(oneMonthAgo);
        document.getElementById('endDate').value = this.formatDate(today);
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    initializeEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeStocks();
        });
    }

    async checkAPIStatus() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            if (response.ok) {
                document.getElementById('apiStatus').className = 'status-online';
                document.getElementById('apiStatus').innerHTML = '<i class="fas fa-circle"></i> API: Online';
            } else {
                throw new Error('API not responding');
            }
        } catch (error) {
            document.getElementById('apiStatus').className = 'status-offline';
            document.getElementById('apiStatus').innerHTML = '<i class="fas fa-circle"></i> API: Offline';
            console.warn('API is offline, using fallback mode');
        }
    }

    async analyzeStocks() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

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
            console.error('Analysis error:', error);
            this.showError('Network error: Unable to connect to analysis server. Please check if the backend is running.');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        // Update metrics
        document.getElementById('mainTrendStock').textContent = data.analysis.main_trend_stock.split('.')[0];
        document.getElementById('varianceExplained').textContent = 
            data.analysis.variance_explained.toFixed(2) + '%';
        document.getElementById('totalVariance').textContent = 
            data.analysis.total_variance.toFixed(6);
        document.getElementById('tradingDays').textContent = data.analysis.number_of_days;

        // Display charts
        document.getElementById('trendChart').src = `data:image/png;base64,${data.trend_chart}`;
        document.getElementById('returnsChart').src = `data:image/png;base64,${data.returns_chart}`;
        document.getElementById('correlationChart').src = `data:image/png;base64,${data.correlation_chart}`;

        // Display stock prices table
        this.displayStockPrices(data.stock_prices);

        // Display eigenvalues and eigenvectors table
        this.displayEigenData(data.eigenvalues, data.eigenvectors);

        // Show results section
        document.getElementById('resultsSection').classList.remove('hidden');
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    displayStockPrices(pricesData) {
        const tableBody = document.querySelector('#pricesTable tbody');
        tableBody.innerHTML = '';

        const dates = Object.keys(pricesData).sort().slice(-10); // Last 10 dates

        dates.forEach(date => {
            const row = document.createElement('tr');
            
            // Date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(date).toLocaleDateString();
            dateCell.style.fontWeight = '600';
            row.appendChild(dateCell);

            // Stock price cells
            const stocks = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ITC.NS'];
            stocks.forEach(stock => {
                const priceCell = document.createElement('td');
                const price = pricesData[date][stock];
                priceCell.textContent = price ? `₹${price.toFixed(2)}` : 'N/A';
                priceCell.style.fontFamily = 'monospace';
                row.appendChild(priceCell);
            });

            tableBody.appendChild(row);
        });
    }

    displayEigenData(eigenvalues, eigenvectors) {
        const tableBody = document.querySelector('#eigenTable tbody');
        tableBody.innerHTML = '';

        const stockNames = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ITC.NS'];
        const displayNames = ['RELIANCE', 'TCS', 'INFY', 'HDFC BANK', 'ITC'];

        eigenvalues.forEach((eigenvalue, index) => {
            const row = document.createElement('tr');
            
            // Component cell
            const compCell = document.createElement('td');
            compCell.textContent = `PC${index + 1}`;
            compCell.style.fontWeight = 'bold';
            compCell.style.background = index === 0 ? 'linear-gradient(135deg, #3498db, #2980b9)' : '#f8f9fa';
            compCell.style.color = index === 0 ? 'white' : '#2c3e50';
            row.appendChild(compCell);

            // Eigenvalue cell
            const evalCell = document.createElement('td');
            evalCell.textContent = eigenvalue.toFixed(6);
            evalCell.style.fontFamily = 'monospace';
            evalCell.style.fontWeight = '600';
            row.appendChild(evalCell);

            // Eigenvector cells
            eigenvectors[index].forEach((value, stockIndex) => {
                const vecCell = document.createElement('td');
                vecCell.textContent = value.toFixed(4);
                vecCell.style.fontFamily = 'monospace';
                
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
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorModal').classList.remove('hidden');
    }
}

function closeModal() {
    document.getElementById('errorModal').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('errorModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StockAnalysisApp();
});
