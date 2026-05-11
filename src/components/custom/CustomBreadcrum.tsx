import { Link, useLocation } from "react-router"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"

export const CustomBreadcrum = () => {
    const { pathname } = useLocation();
    const arrayMenu = pathname.split('/').filter(item => item.trim() !== "");

    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList className="flex items-center gap-2 text-sm text-gray-500">

                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link
                            to="/"
                            className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Inicio
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {arrayMenu.length > 0 && (
                    <>
                        {arrayMenu.map((item, index) => {
                            const path = "/" + arrayMenu.slice(0, index + 1).join("/");
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <BreadcrumbSeparator className="text-gray-400" />
                                    <BreadcrumbItem>
                                        {index === arrayMenu.length - 1 ? (
                                            <BreadcrumbPage className="font-semibold text-gray-900 capitalize">
                                                {item}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    to={path}
                                                    className="text-gray-500 hover:text-blue-600 transition-colors capitalize"
                                                >
                                                    {item}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>

                                </div>
                            )
                        })}
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}