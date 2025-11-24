import { ObjectId } from "mongodb";
import { getDb } from "../common/db.js";
import { crearPeliculaDesdeBody } from "./pelicula.js";


const peliculaCollection = () => getDb().collection("peliculas");


export async function handleInsertPeliculaRequest(req, res) {
  try {
    const pelicula = crearPeliculaDesdeBody(req.body);

    peliculaCollection()
      .insertOne(pelicula)
      .then((resultado) => {
        res.status(201).json({
          mensaje: "Película creada correctamente",
          id: resultado.insertedId,
        });
      })
      .catch((error) => {
        console.error("Error al insertar película:", error);
        res.status(500).json({ error: "Error al insertar película" });
      });
  } catch (error) {
    res.status(400).json({ error: "Datos de película inválidos" });
  }
}


export async function handleGetPeliculasRequest(req, res) {
  peliculaCollection()
    .find({})
    .toArray()
    .then((peliculas) => {
      res.status(200).json(peliculas);
    })
    .catch((error) => {
      console.error("Error al obtener películas:", error);
      res.status(500).json({ error: "Error al obtener películas" });
    });
}


export async function handleGetPeliculaByIdRequest(req, res) {
  const { id } = req.params;

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  peliculaCollection()
    .findOne({ _id: objectId })
    .then((pelicula) => {
      if (!pelicula) {
        return res.status(404).json({ error: "Película no encontrada" });
      }
      res.status(200).json(pelicula);
    })
    .catch((error) => {
      console.error("Error al obtener película:", error);
      res.status(500).json({ error: "Error al obtener película" });
    });
}


export async function handleUpdatePeliculaByIdRequest(req, res) {
  const { id } = req.params;

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  const camposActualizados = {};
  if (req.body.nombre) camposActualizados.nombre = String(req.body.nombre);
  if (req.body.generos) {
    camposActualizados.géneros = Array.isArray(req.body.generos)
      ? req.body.generos
      : req.body.generos.split(",").map((g) => g.trim());
  }
  if (req.body.anioEstreno) {
    camposActualizados.anioEstreno = parseInt(req.body.anioEstreno, 10);
  }

  peliculaCollection()
    .updateOne({ _id: objectId }, { $set: camposActualizados })
    .then((resultado) => {
      if (resultado.matchedCount === 0) {
        return res.status(404).json({ error: "Película no encontrada" });
      }
      res
        .status(200)
        .json({ mensaje: "Película actualizada correctamente" });
    })
    .catch((error) => {
      console.error("Error al actualizar película:", error);
      res.status(500).json({ error: "Error al actualizar película" });
    });
}


export async function handleDeletePeliculaByIdRequest(req, res) {
  const { id } = req.params;

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  peliculaCollection()
    .deleteOne({ _id: objectId })
    .then((resultado) => {
      if (resultado.deletedCount === 0) {
        return res.status(404).json({ error: "Película no encontrada" });
      }
      res
        .status(200)
        .json({ mensaje: "Película eliminada correctamente" });
    })
    .catch((error) => {
      console.error("Error al eliminar película:", error);
      res.status(500).json({ error: "Error al eliminar película" });
    });
}
