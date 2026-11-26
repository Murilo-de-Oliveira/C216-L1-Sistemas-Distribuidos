import { getJson } from "./http.js";

export const fetchItems = (signal) => getJson("/builds/items", signal);