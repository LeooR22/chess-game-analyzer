import {registerOTel} from "@vercel/otel";

export function register() {
  registerOTel({serviceName: "chess-game-analyzer"});
}
