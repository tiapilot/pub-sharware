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
  console.log('Rendering table with data:', data);

  const container = document.getElementById('data-container');
  container.innerHTML = '';

  stationData.forEach((station, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${station.customer}</td>
      <td>${station.status}</td>
      <td>${station.bays_table.map(bay => `${bay.bay} - ${bay['bay-status']}`).join('<br>')}</td>
      <td>${station.vehicle_table.map(vehicle => `${vehicle.vehicle} - ${vehicle['bay-status']}`).join('<br>')}</td>
    `;
    container.appendChild(row);

    if (index % 2 === 1) {
      row.classList.add('even-row');
    }
  });

  updateFilterInfo();
  updateRowCount(); // Aggiungi questa chiamata per aggiornare il conteggio delle righe
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
  updateRowCount(); // Aggiungi questa chiamata per aggiornare il conteggio delle righe filtrate
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

function updateRowCount() {
  const rowCount = stationData ? stationData.length : 0;
  console.log('Updating row count:', rowCount);
  document.getElementById('row-count').textContent = `Numero di righe: ${rowCount}`;
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

function countOccurences() {
  const statusToCount = "Fuori Servizio";
  let count = 0;

  if (stationData) {
    for (const station of stationData) {
      console.log(`Current status: ${station.status}`);
      if (station.status.trim().toLowerCase() === statusToCount.toLowerCase()) {
        count++;
      }
    }
  }

  alert(`Il numero di occorrenze di "${statusToCount}" è: ${count}`);
}




window.onload = loadData;
