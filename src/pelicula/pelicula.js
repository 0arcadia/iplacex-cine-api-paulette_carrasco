export function crearPeliculaDesdeBody(body) {
  const { nombre, generos, anioEstreno } = body;

  let generosArray = [];
  if (Array.isArray(generos)) {
    generosArray = generos;
  } else if (typeof generos === "string") {
    generosArray = generos.split(",").map((g) => g.trim());
  }

  return {
    nombre: String(nombre),
    géneros: generosArray,
    anioEstreno: parseInt(anioEstreno, 10),
  };
}
