export function crearActorDesdeBody(body, idPeliculaString) {
  const { nombre, edad, estaRetirado, premios } = body;

  let premiosArray = [];
  if (Array.isArray(premios)) {
    premiosArray = premios;
  } else if (typeof premios === "string") {
    premiosArray = premios.split(",").map((p) => p.trim());
  }

  return {
    idPelicula: idPeliculaString, 
    nombre: String(nombre),
    edad: parseInt(edad, 10),
    estaRetirado: Boolean(estaRetirado),
    premios: premiosArray,
  };
}
