import { useQuery } from "@tanstack/react-query";
import { getHoroesByPageAction } from "../actions/get-heroes-by-page.action";

export const usePaginateHero = (page: number, limit: number, category = 'all') => {
    return useQuery({
        queryKey: ['heroes', { page, limit, category }],
        queryFn: () => getHoroesByPageAction(page, limit, category),
        staleTime: 1000 * 60 * 5
    });
}