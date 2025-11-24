import { ObjectId } from "mongodb";
import { getDb } from "../common/db.js";
import { crearActorDesdeBody } from "./actor.js";


const actorCollection = () => getDb().collection("actores");
const peliculaCollection = () => getDb().collection("peliculas");


export async function handleInsertActorRequest(req, res) {
  const { nombrePelicula } = req.body;

  if (!nombrePelicula) {
    return res
      .status(400)
      .json({ error: "Debe enviar nombrePelicula en el body" });
  }

  
  peliculaCollection()
    .findOne({ nombre: nombrePelicula })
    .then((pelicula) => {
      if (!pelicula) {
        return res.status(404).json({
          error: "Película no encontrada para asignar al actor",
        });
      }

      const idPeliculaString = pelicula._id.toString();

      
      const actor = crearActorDesdeBody(req.body, idPeliculaString);

      
      actorCollection()
        .insertOne(actor)
        .then((resultado) => {
          res.status(201).json({
            mensaje: "Actor creado correctamente",
            id: resultado.insertedId,
          });
        })
        .catch((error) => {
          console.error("Error al insertar actor:", error);
          res.status(500).json({ error: "Error al insertar actor" });
        });
    })
    .catch((error) => {
      console.error("Error al buscar película:", error);
      res.status(500).json({ error: "Error al buscar película" });
    });
}


export async function handleGetActoresRequest(req, res) {
  actorCollection()
    .find({})
    .toArray()
    .then((actores) => {
      res.status(200).json(actores);
    })
    .catch((error) => {
      console.error("Error al obtener actores:", error);
      res.status(500).json({ error: "Error al obtener actores" });
    });
}


export async function handleGetActorByIdRequest(req, res) {
  const { id } = req.params;

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  actorCollection()
    .findOne({ _id: objectId })
    .then((actor) => {
      if (!actor) {
        return res.status(404).json({ error: "Actor no encontrado" });
      }
      res.status(200).json(actor);
    })
    .catch((error) => {
      console.error("Error al obtener actor:", error);
      res.status(500).json({ error: "Error al obtener actor" });
    });
}


export async function handleGetActoresByPeliculaIdRequest(req, res) {
  const { idPelicula } = req.params;

  
  actorCollection()
    .find({ idPelicula: idPelicula })
    .toArray()
    .then((actores) => {
      res.status(200).json(actores);
    })
    .catch((error) => {
      console.error("Error al obtener actores por película:", error);
      res
        .status(500)
        .json({ error: "Error al obtener actores por película" });
    });
}
