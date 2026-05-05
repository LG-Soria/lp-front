import { apiService } from '@/services/apiService';
import { StarDoodle, StitchDivider, SmileyFlowerDoodle } from '@/components/doodles';
import { Product, ProductType } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { CategoryFilters } from '@/components/CategoryFilters';

export default async function CategoryPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const params = await searchParams;
    const activeCategory = params.cat || 'Todas';
    const activeType = (params.tipo as ProductType) || null;
    const currentPage = Number(params.page) || 1;
    const LIMIT = 12;

    // Fetch inicial de categorías
    const categories = await apiService.getCategories();

    // Buscar el ID de la categoría activa
    const categoryId = activeCategory === 'Todas' ? undefined : categories.find(c => c.nombre === activeCategory)?.id;

    // Fetch de productos con filtros
    const data = await apiService.getProducts({
        page: currentPage,
        limit: LIMIT,
        imageMode: 'cover',
        categoryId,
        tipo: activeType || undefined,
    });

    const products = data.items;
    const totalPages = data.meta.totalPages;
    const totalItems = data.meta.total;
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
    const endItem = Math.min(startItem + products.length - 1, totalItems);

    return (
        <div className="container mx-auto px-8 md:px-16 lg:px-24 py-20 min-h-screen bg-doodle-dots relative">
            {/* Background doodles */}
            <StarDoodle className="absolute top-10 right-10 w-32 h-32 text-coral opacity-5 animate-pulse" />
            <SmileyFlowerDoodle className="absolute bottom-10 left-10 w-40 h-40 text-lila-suave opacity-5" />

            <header className="mb-20 text-center lg:text-left">
                <h1 className="text-6xl md:text-7xl font-heading font-bold text-gray-900 mb-6">
                    Nuestras <br /> <span className="font-script text-coral text-7xl md:text-8xl">Colecciones</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl font-medium">
                    Explorá nuestras piezas artesanales organizadas por categoría. Cada una tejida con dedicación.
                </p>
            </header>

            {/* Client Component para los filtros que manejan la URL */}
            <CategoryFilters
                categories={categories}
                activeCategory={activeCategory}
                activeType={activeType}
            />

            {/* Indicador de elementos mostrados */}
            {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 relative z-10 px-6 py-4 bg-white/70 backdrop-blur-md rounded-[30px] border border-white/60 shadow-sm">
                    <p className="text-gray-500 font-medium text-sm md:text-base">
                        Mostrando <span className="text-coral font-bold mx-1">{startItem} - {endItem}</span> de <span className="text-gray-800 font-bold mx-1">{totalItems}</span> piezas
                    </p>
                    <div className="h-px bg-gray-200 flex-grow mx-6 opacity-50 hidden sm:block"></div>
                    <div className="mt-2 sm:mt-0 opacity-40">
                        <StarDoodle className="w-6 h-6 text-coral" />
                    </div>
                </div>
            )}

            {/* Grid de productos */}
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </>
            ) : (
                <div className="text-center py-40 bg-white/50 backdrop-blur-sm rounded-[60px] border-2 border-dashed border-white/30 z-10 relative">
                    <div className="mb-6 opacity-20 inline-block">
                        <StarDoodle className="w-20 h-20 text-[#f89eb6]" />
                    </div>
                    <p className="text-gray-600 text-xl font-medium italic">No encontramos tesoros con estos filtros...</p>
                    <a
                        href="/categorias"
                        className="mt-6 inline-block text-coral font-bold text-lg underline hover:text-coral-dark transition-colors"
                    >
                        Limpiar filtros y ver todo
                    </a>
                </div>
            )}

            <div className="mt-40 relative z-10">
                <StitchDivider />
            </div>
        </div>
    );
}
