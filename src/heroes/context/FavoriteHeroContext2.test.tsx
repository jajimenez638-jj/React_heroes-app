import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "../types/hero.interfaces";

const mockHero = {
    id: '1',
    name: 'Batman',
} as Hero;

const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

const TestComponent = () => {
    const { favortiteCount, favorties, isFavorite, toggleFavorite } = use(FavoriteHeroContext);

    return (
        <div>
            <div data-testid='favorite-count'>{favortiteCount}</div>
            <div data-testid='favorite-list'>
                {
                    favorties.map(hero => (
                        <div key={hero.id} data-testid={`hero=${hero.id}`}>
                            {hero.name}
                        </div>
                    ))
                }
            </div>
            <button data-testid="toggle-favorite"
                onClick={() => toggleFavorite(mockHero)}>
                Toggle Favorite
            </button>
            <div data-testid='is-favorite'>{isFavorite(mockHero).toString()}</div>
        </div>
    )
}

const renderContextTest = () => {
    return render(
        <FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>
    )
}

describe('FavoriteHeroContext', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    });

    test('Should initialize with default value', () => {
        renderContextTest();

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('favorite-list').children.length).toBe(0);
    });

    test('Should add hero to favorite when toggleFavorite is called with new Hero', () => {
        renderContextTest();
        const button = screen.getByTestId('toggle-favorite');

        fireEvent.click(button);

        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('hero=1').textContent).toBe('Batman');
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('favorites', '[{\"id\":\"1\",\"name\":\"Batman\"}]');
    });

    test('Should remove from favorites when toggleFavorite is called', () => {
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockHero]));

        renderContextTest();
        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('hero=1').textContent).toBe('Batman');

        const button = screen.getByTestId('toggle-favorite');
        fireEvent.click(button);

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        expect(screen.queryByTestId('hero=1')).toBeNull;

        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('favorites', '[]');
    });
});