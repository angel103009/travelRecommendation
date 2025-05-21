// Archivo travel_recommendation.js

let allData = null;

async function fetchData() {
  try {
    const response = await fetch('travel_recommendation_api.json');
    if (!response.ok) throw new Error('Error al cargar JSON');
    allData = await response.json();
    console.log('Datos cargados:', allData);
  } catch (error) {
    console.error('Error fetch:', error);
  }
}

function clearResults() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
}

function normalizeKeyword(keyword) {
  return keyword.trim().toLowerCase();
}

function search() {
  if (!allData) {
    alert('Los datos aún no están cargados, inténtalo en un momento.');
    return;
  }

  const input = document.getElementById('searchInput').value;
  const keyword = normalizeKeyword(input);

  clearResults();

  if (!keyword) return;

  const resultsDiv = document.getElementById('results');
  let matches = [];

  // Buscamos coincidencias por categoría
  if (['playa', 'playas', 'beach', 'beaches'].includes(keyword)) {
    matches = allData.beaches;
  } else if (['templo', 'templos', 'temple', 'temples'].includes(keyword)) {
    matches = allData.temples;
  } else {
    // Buscar país (case insensitive)
    matches = allData.countries
      .filter(c => c.name.toLowerCase() === keyword)
      .flatMap(c => c.cities);
  }

  if (matches.length === 0) {
    resultsDiv.innerHTML = `<p>No se encontraron recomendaciones para "<strong>${input}</strong>".</p>`;
    return;
  }

  // Mostrar mínimo 2 recomendaciones (si hay)
  matches.slice(0, 2).forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.name;

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const title = document.createElement('h3');
    title.textContent = item.name;

    const desc = document.createElement('p');
    desc.textContent = item.description;

    cardContent.appendChild(title);
    cardContent.appendChild(desc);
    card.appendChild(img);
    card.appendChild(cardContent);

    resultsDiv.appendChild(card);
  });
}

// Cargar datos al inicio
fetchData();
