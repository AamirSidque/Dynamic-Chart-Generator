// app.js

let lineChart = null;
let barChart = null;

// Function to generate dataset input fields
function generateDatasetInputs() {
    const numDatasets = document.getElementById('numDatasets').value;
    const datasetInputsContainer = document.getElementById('datasetInputs');
    datasetInputsContainer.innerHTML = '';

    for (let i = 0; i < numDatasets; i++) {
        const fieldSet = document.createElement('div');
        fieldSet.classList.add('dataset-input');

        const label = document.createElement('label');
        label.textContent = `Data Set ${i + 1} (comma separated values):`;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `data${i + 1}`;
        input.placeholder = 'e.g., 10,20,30';

        fieldSet.appendChild(label);
        fieldSet.appendChild(input);
        datasetInputsContainer.appendChild(fieldSet);
    }

    const generateChartButton = document.getElementById('generateChartButton');
    generateChartButton.style.display = 'block';

    // Clear previous event listeners
    const newGenerateChartButton = generateChartButton.cloneNode(true);
    generateChartButton.parentNode.replaceChild(newGenerateChartButton, generateChartButton);
    newGenerateChartButton.addEventListener('click', generateCharts);
}

// Function to generate charts
function generateCharts() {
    const numDatasets = document.getElementById('numDatasets').value;
    const lineChartData = {
        labels: [],
        datasets: []
    };
    const barChartData = {
        labels: [],
        datasets: []
    };

    for (let i = 0; i < numDatasets; i++) {
        const dataInput = document.getElementById(`data${i + 1}`).value.split(',').map(Number);

        if (dataInput.includes(NaN)) {
            alert(`Please enter valid numbers in Data Set ${i + 1}`);
            return;
        }

        if (i === 0) {
            lineChartData.labels = dataInput.map((_, index) => `Point ${index + 1}`);
            barChartData.labels = dataInput.map((_, index) => `Point ${index + 1}`);
        }

        lineChartData.datasets.push({
            label: `Data Set ${i + 1}`,
            data: dataInput,
            borderColor: getRandomColor(),
            backgroundColor: getRandomColor(0.2),
            fill: true
        });

        barChartData.datasets.push({
            label: `Data Set ${i + 1}`,
            data: dataInput,
            backgroundColor: getRandomColor(0.5),
            borderColor: getRandomColor(),
            borderWidth: 1
        });
    }

    // Destroy previous charts if they exist
    if (lineChart) {
        lineChart.destroy();
    }
    if (barChart) {
        barChart.destroy();
    }

    // Create Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: lineChartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Create Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    document.getElementById('downloadButtons').style.display = 'block';
}

// Helper function to generate random colors
function getRandomColor(alpha = 1) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Function to download the chart
function downloadChart(chartId, filename) {
    const chart = document.getElementById(chartId);
    const link = document.createElement('a');
    link.href = chart.toDataURL('image/png');
    link.download = filename;
    link.click();
}
