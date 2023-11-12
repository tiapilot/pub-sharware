let stationData;
let filteredData = null;

function fetchData() {
  return fetch('https://raw.githubusercontent.com/tiapilot/pub-sharware/main/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Errore nel caricamento dei dati: ${response.statusText}`);
      }
      return response.json();
    });
}

function renderTable(data) {
  stationData = data;
  const container = document.getElementById('data-container');
  container.innerHTML = '';

  stationData.forEach((station, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${station.customer}</td>
      <td>${station.status}</td>
      <td>${station.bays_table.map(bay => `${bay.bay}
      <td>${bay['bay-status']}`).join('<br>')}</td>
      <td>${station.vehicle_table.map(vehicle => `${vehicle.vehicle}
      <td>${vehicle['bay-status']}`).join('<br>')}</td>
    `;
    container.appendChild(row);

    if (index % 2 === 1) {
      row.classList.add('even-row');
    }
  });

  updateFilterInfo();
}



function loadData() {
  fetchData()
    .then(data => {
      renderTable(data);
      applyFilters();
    })
    .catch(error => console.error(error));
}

function applyFilters() {
  const searchCliente = getInputValue('searchCliente');
  const searchStato = getInputValue('searchStato');

  filteredData = stationData.filter(station =>
    station.customer.toLowerCase().includes(searchCliente.toLowerCase()) &&
    station.status.toLowerCase().includes(searchStato.toLowerCase())
  );

  renderTable(searchCliente || searchStato ? filteredData : stationData);
  updateFilterInfo();
}

function getInputValue(inputId) {
  return document.getElementById(inputId).value.trim();
}

function updateFilterInfo() {
  const searchClienteValue = getInputValue('searchCliente');
  const searchStatoValue = getInputValue('searchStato');

  const filterInfo = searchClienteValue ? `Cliente: ${searchClienteValue} ` : '';
  const statoInfo = searchStatoValue ? `Stato: ${searchStatoValue} ` : '';

  const filterButton = filterInfo || statoInfo ? `<button onclick="clearFilter()">x</button>` : '';

  document.getElementById('filter-info').innerHTML = `${filterInfo}${statoInfo}${filterButton}`;
}

function clearFilter() {
  setInputValue('searchCliente', '');
  setInputValue('searchStato', '');

  filteredData = null;
  loadData();
  renderTable(stationData);
  updateFilterInfo();
}

function resetFilters() {
  setInputValue('searchCliente', '');
  setInputValue('searchStato', '');
  filteredData = null;
  loadData();
}

function setInputValue(inputId, value) {
  document.getElementById(inputId).value = value;
}

window.onload = loadData;
