let stationData = [];
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

function loadData() {
  fetchData()
    .then(data => {
      stationData = data;
      renderTable();
      applyFilters();
    })
    .catch(error => console.error(error));
}

function renderTable() {
  const container = document.getElementById('data-container');
  container.innerHTML = '';

  renderTableHeaders();

  (filteredData || stationData).forEach((station, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>${station.customer}</td><td>${station.status}</td>`;
    container.appendChild(row);
  });

  updateFilterInfo();
  updateRowCount();
}

function renderTableHeaders() {
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>Indice</th><th>Cliente</th><th>Stato</th><th>Stato2</th><th>Stato3</th>';
  document.getElementById('data-container').appendChild(headerRow);
}

function applyFilters() {
  const searchCliente = getInputValue('searchCliente');
  const searchStato = getInputValue('searchStato');

  filteredData = stationData.filter(station =>
    station.customer.toLowerCase().includes(searchCliente.toLowerCase()) &&
    station.status.toLowerCase().includes(searchStato.toLowerCase())
  );

  renderTable();
}

function updateFilterInfo() {
  const searchClienteValue = getInputValue('searchCliente');
  const searchStatoValue = getInputValue('searchStato');

  const filterInfo = searchClienteValue ? `Cliente: ${searchClienteValue} ` : '';
  const statoInfo = searchStatoValue ? `Stato: ${searchStatoValue} ` : '';

  const filterButton = filterInfo || statoInfo ? `<button onclick="clearFilter()">x</button>` : '';

  document.getElementById('filter-info').innerHTML = `${filterInfo}${statoInfo}${filterButton}`;
}

function updateRowCount() {
  const rowCount = filteredData ? filteredData.length : stationData.length;
  document.getElementById('row-count').textContent = `Numero di righe: ${rowCount}`;
}

function clearFilter() {
  setInputValue('searchCliente', '');
  setInputValue('searchStato', '');
  filteredData = null;
  renderTable();
}

function resetFilters() {
  setInputValue('searchCliente', '');
  setInputValue('searchStato', '');
  filteredData = null;
  renderTable();
}

function setInputValue(inputId, value) {
  document.getElementById(inputId).value = value;
}

function countOccurrences() {
  const statusToCount = "Fuori Servizio";
  const count = filteredData ? filteredData.filter(station => station.status.trim().toLowerCase() === statusToCount.toLowerCase()).length : 0;
  alert(`Il numero di occorrenze di "${statusToCount}" è: ${count}`);
}

window.onload = loadData;
