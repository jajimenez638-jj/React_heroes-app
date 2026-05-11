import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "../types/hero.interfaces";

const mockHero = {
    id: '1',
    name: 'Batman',
} as Hero;

const TestComponent = () => {
    const { favortiteCount, favorties, isFavorite, toggleFavorite } = use(FavoriteHeroContext);

    return (
        <div>
            <div data-testid='favortite-count'>{favortiteCount}</div>
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
        localStorage.clear();
    });

    test('Should initialize with default value', () => {
        renderContextTest();

        expect(screen.getByTestId('favortite-count').textContent).toBe('0');
        expect(screen.getByTestId('favortite-count').children.length).toBe(0);
    });

    test('Should add hero to favorite when toggleFavorite is called with new Hero', () => {
        renderContextTest();
        const button = screen.getByTestId('toggle-favorite');
        fireEvent.click(button);

        expect(screen.getByTestId('favortite-count').textContent).toBe('1');
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('hero=1').textContent).toBe('Batman');
        expect(localStorage.getItem('favorites')).toBe('[{"id":"1","name":"Batman"}]')
    });

    test('Should remove from favorites when toggleFavorite is called', () => {
        localStorage.setItem('favorites', JSON.stringify([mockHero]));

        renderContextTest();
        expect(screen.getByTestId('favortite-count').textContent).toBe('1');
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('hero=1').textContent).toBe('Batman');

        const button = screen.getByTestId('toggle-favorite');
        fireEvent.click(button);

        expect(screen.getByTestId('favortite-count').textContent).toBe('0');
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        expect(screen.queryByTestId('hero=1')).toBeNull;
    });
});