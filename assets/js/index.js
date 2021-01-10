document.addEventListener('DOMContentLoaded', async () => {
  const API_KEY = 'bd1e61a092666cbf6e759ed55012f539',
    URL_PATH = 'https://api.themoviedb.org';
  const peticionAPI = (tipo, categoria) => {
    const url = `${URL_PATH}/3/${tipo}/${categoria}?api_key=${API_KEY}&language=es-MX&page=1 `;
    return fetch(url)
      .then((response) => response.json())
      .then((result) => result.results)
      .catch((error) => console.log(error));
  };
  const renderPrincipal = async () => {
    const peticion = (await peticionAPI('movie', 'now_playing'))[0];
    const { backdrop_path, title, overview } = peticion;
    const contenidoDestacado = document.querySelector('#destacado');
    contenidoDestacado.style = `
      background-image: url(https://image.tmdb.org/t/p/original${backdrop_path})
    `;
    let html = `
      <div id="contenido-destacado">
        <div class="contenedor">
          <p class="titulo-destacado">${title}</p>
          <p class="top">Ultimo lanzamiento</p>
          <p class="descripcion">
            ${overview}
          </p>
          <div id="botones-destacado">
            <button class="btn reproducir">
              <img src="./assets/img/reproducir.svg" alt="" />
              <span>Reproducir</span>
            </button>
            <button class="btn informacion">
              <img src="./assets/img/informacion.svg" alt="" />
              <span>Más información</span>
            </button>
          </div>
        </div>
      </div>
    `;
    contenidoDestacado.innerHTML = html;
  };
  const renderCarousel = async (tituloCategoria, categoria, ...tipos) => {
    let resultPeticiones = [];
    let htmlCarousel = '';
    let htmlLista = '';
    for (const tipo of tipos) {
      let peticion = await peticionAPI(tipo, categoria);
      resultPeticiones = resultPeticiones.concat(peticion);
    }
    resultPeticiones = _.shuffle(resultPeticiones);

    htmlLista = `
      <div class="contenedor-lista">
        <div class="contenedor-titulo">
          <p>${tituloCategoria}</p>
          <div class="indicadores"></div>
        </div>
        <div class="contenedor-carousel">
          <div class="carousel">
          </div>
          <button class="btn-flecha-izquierda">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="btn-flecha-derecha">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;

    document.querySelector('.contenedor-principal').innerHTML += htmlLista;

    resultPeticiones.forEach((result) => {
      const { backdrop_path } = result;
      const urlImage = `https://image.tmdb.org/t/p/w500${backdrop_path}`;
      htmlCarousel += `
        <div class="corousel-elemento">
          <button>
            <img src="${urlImage}" alt="" />
          </button>
        </div>
      `;
    });

    const carousel = document.querySelectorAll('.carousel');
    carousel[carousel.length - 1].innerHTML = htmlCarousel;
  };
  //Agregar mas carouseles
  await renderPrincipal();
  await renderCarousel('Más populares', 'popular', 'movie', 'tv');
  await renderCarousel('Ultimos lanzamientos', 'now_playing', 'movie');
  await renderCarousel('Mejor valorados', 'top_rated', 'movie', 'tv');
  await renderCarousel('Actualmente en el aire', 'on_the_air', 'tv');

  //Selectores DOM
  const navegacion = document.querySelector('#navegacion'),
    contenedorLista = document.querySelectorAll('.contenedor-lista');

  const mostrarOcultarFlechas = (lista) => {
    const flechaIzquierda = lista.querySelector('.btn-flecha-izquierda');
    const flechaDerecha = lista.querySelector('.btn-flecha-derecha');
    lista.addEventListener('mouseover', () => {
      flechaDerecha.style = 'display: block';
      if (flechaIzquierda.style.display == 'none') {
        flechaIzquierda.style = 'display:block;';
      }
    });
    lista.addEventListener('mouseout', () => {
      flechaDerecha.style = 'display:none;';
      if (flechaIzquierda.style.display == 'block') {
        flechaIzquierda.style = 'display:none;';
      }
    });
  };
  const moverCarousel = (lista) => {
    const flechaIzquierda = lista.querySelector('.btn-flecha-izquierda'),
      flechaDerecha = lista.querySelector('.btn-flecha-derecha'),
      contenedorCarousel = lista.querySelector('.contenedor-carousel'),
      carousel = lista.querySelector('.carousel');

    flechaDerecha.addEventListener('click', () => {
      contenedorCarousel.style = 'max-width:100%';
      carousel.scrollLeft += carousel.offsetWidth;
      flechaIzquierda.style = 'display:block;';
    });
    flechaIzquierda.addEventListener('click', () => {
      carousel.scrollLeft -= carousel.offsetWidth;
    });
  };

  //Eventos que dan funcionalidad al carousel
  document.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navegacion.style = 'background: #141414';
    } else {
      navegacion.style = 'background: none';
    }
  });
  contenedorLista.forEach((lista) => {
    mostrarOcultarFlechas(lista);
    moverCarousel(lista);
  });
});
