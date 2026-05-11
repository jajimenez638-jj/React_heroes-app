import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { usePaginateHero } from "./usePaginateHero";
import { getHoroesByPageAction } from "../actions/get-heroes-by-page.action";

vi.mock('../actions/get-heroes-by-page.action', () => ({
    getHoroesByPageAction: vi.fn()
}));
const mockGetHeroesByPageAction = vi.mocked(getHoroesByPageAction);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
})

const tanStackCustomProvider = () => {
    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient} >{children}</QueryClientProvider>
    )
}

describe('usePaginateHero', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    })

    test('Should return the initial state (isLoading)', () => {
        const { result } = renderHook(() => usePaginateHero(1, 6), {
            wrapper: tanStackCustomProvider()
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBe(undefined);
        expect(result.current.data).toBeUndefined();
    });

    test('Should return success state with data when API call succeds', async () => {
        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: []
        };
        mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData);

        const { result } = renderHook(() => usePaginateHero(1, 6), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.status).toBe('success');
        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, 'all');
    });

    test('Should call getHeroesByPageActions with arguments', async () => {
        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: []
        };
        mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData);

        const { result } = renderHook(() => usePaginateHero(1, 6, 'heroes'), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.status).toBe('success');
        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, 'heroes');
    });
});