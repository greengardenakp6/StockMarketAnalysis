// Temporary standalone version that works without backend
class StockAnalysisApp {
    constructor() {
        this.stocks = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ITC.NS'];
        this.initializeEventListeners();
        this.setDefaultDates();
        this.simulateAPIOnline();
    }

    simulateAPIOnline() {
        // Simulate API being online for demo
        document.getElementById('apiStatus').className = 'status-online';
        document.getElementById('apiStatus').innerHTML = '<i class="fas fa-circle"></i> API: Online (Demo)';
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

    async analyzeStocks() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            this.showError('Please select both start and end dates');
            return;
        }

        this.showLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            try {
                const analysis = this.generateDemoAnalysis(startDate, endDate);
                this.displayResults(analysis);
            } catch (error) {
                this.showError('Demo analysis failed: ' + error.message);
            } finally {
                this.showLoading(false);
            }
        }, 2000);
    }

    generateDemoAnalysis(startDate, endDate) {
        // Generate demo data
        return {
            analysis: {
                main_trend_stock: 'RELIANCE.NS',
                variance_explained: 65.42,
                total_variance: 0.000156,
                number_of_days: 22
            },
            trend_chart: this.createDemoTrendChart(),
            returns_chart: this.createDemoReturnsChart(),
            correlation_chart: this.createDemoCorrelationChart(),
            stock_prices: this.generateDemoPrices(),
            eigenvalues: [0.000102, 0.000032, 0.000015, 0.000005, 0.000002],
            eigenvectors: [
                [0.5123, 0.4231, 0.3892, 0.3456, 0.2987],
                [-0.3123, 0.5231, -0.2892, 0.4456, -0.1987],
                [0.2123, -0.3231, 0.5892, -0.2456, 0.0987],
                [-0.1123, -0.2231, -0.1892, 0.6456, 0.3987],
                [0.0923, 0.1231, -0.0892, -0.1456, 0.7987]
            ]
        };
    }

    createDemoTrendChart() {
        // Create a simple demo chart
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Draw chart background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw demo bars
        const values = [0.5123, 0.4231, 0.3892, 0.3456, 0.2987];
        const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];
        const stockNames = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'ITC'];
        
        const barWidth = 80;
        const spacing = 20;
        const startX = 50;
        const baseY = 300;
        
        values.forEach((value, index) => {
            const x = startX + index * (barWidth + spacing);
            const height = value * 400;
            const y = baseY - height;
            
            ctx.fillStyle = colors[index];
            ctx.fillRect(x, y, barWidth, height);
            
            // Labels
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(stockNames[index], x + barWidth/2, baseY + 20);
            ctx.fillText(value.toFixed(3), x + barWidth/2, y - 10);
        });
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.fillText('Market Trend Analysis (Demo)', canvas.width/2, 30);
        
        return canvas.toDataURL();
    }

    createDemoReturnsChart() {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.fillText('Cumulative Returns (Demo Data)', canvas.width/2, 30);
        
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.fillText('Backend connection required for real data', canvas.width/2, 200);
        
        return canvas.toDataURL();
    }

    createDemoCorrelationChart() {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.fillText('Correlation Matrix (Demo)', canvas.width/2, 30);
        
        return canvas.toDataURL();
    }

    generateDemoPrices() {
        const prices = {};
        const stocks = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ITC.NS'];
        const basePrices = [2500, 3500, 1800, 1600, 400];
        
        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            prices[dateStr] = {};
            
            stocks.forEach((stock, index) => {
                prices[dateStr][stock] = basePrices[index] * (1 + Math.random() * 0.1);
            });
        }
        
        return prices;
    }

    displayResults(data) {
        // Update metrics
        document.getElementById('mainTrendStock').textContent = data.analysis.main_trend_stock.split('.')[0];
        document.getElementById('varianceExplained').textContent = data.analysis.variance_explained.toFixed(2) + '%';
        document.getElementById('totalVariance').textContent = data.analysis.total_variance.toFixed(6);
        document.getElementById('tradingDays').textContent = data.analysis.number_of_days;

        // Display charts
        document.getElementById('trendChart').src = data.trend_chart;
        document.getElementById('returnsChart').src = data.returns_chart;
        document.getElementById('correlationChart').src = data.correlation_chart;

        // Display tables
        this.displayStockPrices(data.stock_prices);
        this.displayEigenData(data.eigenvalues, data.eigenvectors);

        // Show results
        document.getElementById('resultsSection').classList.remove('hidden');
    }

    displayStockPrices(pricesData) {
        const tableBody = document.querySelector('#pricesTable tbody');
        tableBody.innerHTML = '';

        const dates = Object.keys(pricesData).sort().slice(-5);

        dates.forEach(date => {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(date).toLocaleDateString();
            row.appendChild(dateCell);

            const stocks = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ITC.NS'];
            stocks.forEach(stock => {
                const priceCell = document.createElement('td');
                priceCell.textContent = `₹${pricesData[date][stock].toFixed(2)}`;
                row.appendChild(priceCell);
            });

            tableBody.appendChild(row);
        });
    }

    displayEigenData(eigenvalues, eigenvectors) {
        const tableBody = document.querySelector('#eigenTable tbody');
        tableBody.innerHTML = '';

        eigenvalues.forEach((eigenvalue, index) => {
            const row = document.createElement('tr');
            
            const compCell = document.createElement('td');
            compCell.textContent = `PC${index + 1}`;
            compCell.style.fontWeight = 'bold';
            row.appendChild(compCell);

            const evalCell = document.createElement('td');
            evalCell.textContent = eigenvalue.toFixed(6);
            row.appendChild(evalCell);

            eigenvectors[index].forEach((value) => {
                const vecCell = document.createElement('td');
                vecCell.textContent = value.toFixed(4);
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

document.addEventListener('DOMContentLoaded', () => {
    new StockAnalysisApp();
});
