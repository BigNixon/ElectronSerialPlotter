

const ctx = document.getElementById('myChart');

const volume_values = Array(10).fill(null).map((_, i) => i);
const exp_flux_values = [0, 9.5,10, 7.5, 4.0, 2.5,0]
const insp_flux_values = [0, -0.5,-2, -3, -6, -7,0]

const exp_dataset = {
    label: 'Flujo Expiracion vs Volumen',
    data: exp_flux_values,
    borderWidth: 2,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.5
}
const insp_dataset = {
    label: 'Flujo Inspiracion vs Volumen',
    data: insp_flux_values,
    borderWidth: 2,
    fill: false,
    borderColor: 'rgb(192, 75, 75)',
    tension: 0.5
}

const data_exp = {
    labels: volume_values,
    datasets: [exp_dataset,insp_dataset]
}


const myChart = new Chart(ctx, {
    type: 'line',
    data: data_exp,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


