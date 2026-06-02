import Server from "./src/server/config.js";
import router from "./src/routes/index.routes.js";
import { ejecutarSeeds } from "./src/seeds/seeds.js";
import cancelarTurnosVencidos from "./src/helpers/cron.js";

await ejecutarSeeds();
const server = new Server();
server.app.use("/api", router);

server.listen();
