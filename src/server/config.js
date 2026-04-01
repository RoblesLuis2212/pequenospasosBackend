import express from "express";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

export default class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.middlewares();
  }
  middlewares() {
    this.app.use(cors()); //Cors permite conexiones remotas, esto servira cuando se publique el backend
    this.app.use(express.json());
    this.app.use(morgan("dev")); //Morgan muestra informacion extra en la consola
    //Configuracion de archivo estatico
    const __dirname = dirname(fileURLToPath(import.meta.url));
    console.log(__dirname);
    console.log(__dirname + "/../../public");
    this.app.use(express.static(__dirname + "/../../public"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(
        `El servidor esta ejecutandose en http://localhost:${this.port}`,
      );
    });
  }
}
