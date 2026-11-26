import { postJson } from "./http.js";

export const createBuild = (payload) => postJson("/builds", payload);