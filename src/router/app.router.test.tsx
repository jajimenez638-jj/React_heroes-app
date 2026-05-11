import { describe, expect, test, vi } from "vitest";
import { AppRouter } from "./app.router";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider, useParams } from "react-router";

vi.mock('@/heroes/page/home/HomePage', () => ({
    HomePage: () => <div data-testid='home-page'></div>
}));

vi.mock('@/heroes/layouts/HeroesLayout', () => ({
    HeroesLayout: () => <div data-testid='heroes-layout'>
        <Outlet />
    </div>
}));

vi.mock('@/heroes/page/hero/HeroPage', () => ({
    HeroPage: () => {
        const { idSlug = '' } = useParams();
        return (
            <div data-testid="hero-page">HeroPage - {idSlug}</div>
        )
    }
}));

vi.mock('@/heroes/page/search/SearchPage', () => ({
    default: () => <div data-testid='search-page'></div>
}));

describe('appRouter', () => {
    test('Should be configured as expected', () => {
        expect(AppRouter.routes).toMatchSnapshot();
    });

    test('Should render home page at root path', () => {
        const router = createMemoryRouter(AppRouter.routes, {
            initialEntries: ['/']
        })

        render(<RouterProvider router={router} />);
        expect(screen.getByTestId('home-page')).toBeDefined();
    });

    test('Should render hero page at /heroes/:idSlug path', () => {
        const router = createMemoryRouter(AppRouter.routes, {
            initialEntries: ['/heroes/superman']
        });
        render(<RouterProvider router={router} />);

        expect(screen.getByTestId('hero-page').innerHTML).toContain('superman');
    });

    test('Should render search page at /search path', async () => {
        const router = createMemoryRouter(AppRouter.routes, {
            initialEntries: ['/search']
        });
        render(<RouterProvider router={router} />);

        expect(await screen.findByTestId('search-page')).toBeDefined();
    });

    test('Should redirect to home page for unknow router', () => {
        const router = createMemoryRouter(AppRouter.routes, {
            initialEntries: ['/otra-pagina-rara']
        });
        render(<RouterProvider router={router} />);

        expect(screen.getByTestId('home-page')).toBeDefined();
    });
});