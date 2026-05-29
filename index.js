import Server from "./src/server/config.js";
import router from "./src/routes/index.routes.js";
import { verificarAdmin } from "./src/helpers/verificarAdmin.js";

await verificarAdmin();
const server = new Server();
server.app.use("/api", router);

server.listen();
