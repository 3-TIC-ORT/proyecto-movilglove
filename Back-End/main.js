import { startServer, subscribeGETEvent, subscribePOSTEvent } from "soquetic";
import { iniciodesesion, registrarse } from "./usuarios.js";
import { guardarMovimientos } from "./index.js"

subscribePOSTEvent("login", iniciodesesion);
subscribePOSTEvent("register", registrarse);

subscribePOSTEvent("guardarConfiguracion", guardarMovimientos)

startServer(3000);