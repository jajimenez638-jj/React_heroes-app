import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { use, useMemo } from "react"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { useSearchParams } from "react-router"
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary"
import { usePaginateHero } from "@/heroes/hooks/usePaginateHero"
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext"

export const HomePage = () => {
    const { favortiteCount, favorties } = use(FavoriteHeroContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get("tab") ?? "all";
    const page = searchParams.get("page") ?? '1';
    const limit = searchParams.get("limit") ?? '6';
    const category = searchParams.get("category") ?? 'all';

    const selectedTab = useMemo(() => {
        const validTabs = ['all', 'favorites', 'heroes', 'villains'];
        return validTabs.includes(activeTab) ? activeTab : 'all';
    }, [activeTab])

    // const [activeTab, setActiveTab] = useState<
    //     'all' | 'favorites' | 'heroes' | 'villains'>('all');

    // const { data: heroesResponse } = useQuery({
    //     queryKey: ['heroes', { page, limit }],
    //     queryFn: () => getHoroesByPageAction(+page, +limit),
    //     staleTime: 1000 * 60 * 5
    // });

    const { data: heroesResponse } = usePaginateHero(+page, +limit, category);

    const { data: summary } = useHeroSummary();

    // useEffect(() => {
    //     getHoroesByPageAction().then();
    // }, []);

    return (
        <>
            <>
                {/* Header */}
                <CustomJumbotron
                    title="Universo de SuperHéroes"
                    description="Descrubre, explora y administra super héroes"
                />

                {/* Stats Dashboard */}
                <HeroStats />

                {/* Controls */}

                {/* Advanced Filters */}

                {/* Tabs */}
                <Tabs value={selectedTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'all');
                                prev.set('category', 'all');
                                prev.set('page', '1');
                                return prev
                            })}
                            value="all">All Characters ({summary?.totalHeroes})</TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'favorites');
                                prev.set('category', 'favorites');
                                return prev
                            })}
                            value="favorites" className="flex items-center gap-2">
                            Favorites ({favortiteCount})
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'heroes');
                                prev.set('category', 'hero');
                                prev.set('page', '1');
                                return prev
                            })}
                            value="heroes">Heroes ({summary?.heroCount})</TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'villains');
                                prev.set('category', 'villain');
                                prev.set('page', '1');
                                return prev
                            })}
                            value="villains">Villains ({summary?.villainCount})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <h1>Todos los personajes</h1>
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value="favorites">
                        <h1>Favoritos</h1>
                        <HeroGrid heroes={favorties ?? []} />
                    </TabsContent>
                    <TabsContent value="heroes">
                        <h1>Herores</h1>
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value="villains">
                        <h1>Villanos</h1>
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                </Tabs>

                {/* Character Grid */}
                {/* <HeroGrid /> */}

                {/* Pagination */}
                {selectedTab !== 'favorites' && (
                    <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
                )}
            </>
        </>
    )
}