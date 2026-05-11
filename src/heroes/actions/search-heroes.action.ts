import { heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interfaces";

interface Option {
    name?: string;
    team?: string;
    category?: string;
    universe?: string;
    status?: string;
    strength?: string;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const searchHeroesAction = async ({ name, team, category, universe, status, strength }: Option = {}) => {
    if (!name && !team && !category && !universe && !status && !strength) {
        return [];
    }

    const { data } = await heroApi.get(`/search`, {
        params: {
            name,
            team,
            category,
            universe,
            status,
            strength
        }
    })

    return data.map((hero: Hero) => ({
        ...hero,
        image: `${VITE_API_URL}/images/${hero.image}`
    }));
}