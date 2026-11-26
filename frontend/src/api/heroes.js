import { getJson } from "./http.js";

export const fetchHeroes = (signal) => getJson("/heroes/all_heroes", signal);
export const fetchHero = (id, signal) => getJson(`/heroes/${id}`, signal);
export const fetchHeroBuilds = (id, signal) =>
    getJson(`/heroes/${id}/builds`, signal);
