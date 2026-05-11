import { AdminLayout } from "@/admin/layouts/AdminLayout";
import { AdminPage } from "@/admin/pages/AdminPage";
import { HeroesLayout } from "@/heroes/layouts/HeroesLayout";
import { HeroPage } from "@/heroes/page/hero/HeroPage";
import { HomePage } from "@/heroes/page/home/HomePage";
import { createHashRouter, Navigate } from "react-router";

// import { SearchPage } from "@/heroes/page/search/SearchPage";
import { lazy } from "react";

const SearchPage = lazy(() => import('@/heroes/page/search/SearchPage'));

// export const AppRouter = createBrowserRouter([
export const AppRouter = createHashRouter([
    {
        path: '/',
        element: <HeroesLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/heroes/:idSlug',
                element: <HeroPage />
            },
            {
                path: '/search',
                element: <SearchPage />
            },
            {
                path: '*',
                element: <Navigate to="/" />
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <AdminPage />
            }
        ]
    }
])