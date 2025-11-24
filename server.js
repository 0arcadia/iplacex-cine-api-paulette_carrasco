import express from "express";
import cors from "cors";
import { connectToMongo } from "./src/common/db.js";
import { peliculaRoutes } from "./src/pelicula/routes.js";
import { actorRoutes } from "./src/actor/routes.js";

const app = express();
const PORT = 3000; 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/", (req, res) => {
  res.status(200).send("Bienvenido al cine Iplacex");
});


app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);


connectToMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Servidor Express escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "❌ No se pudo levantar el servidor porque falló la conexión a Atlas"
    );
  });
