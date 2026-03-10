import { getAllConsoles } from "./actions";
import { ConsoleDropdown } from "@/components/ui/ConsoleDropdown";
import { ConsolePortal } from "@/components/ui/ConsolePortal";

export const dynamic = "force-dynamic";

export default async function CollectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const consoles = await getAllConsoles();

    return (
        <div className="flex-1 flex flex-col w-full relative h-[calc(100vh-140px)]">
            {/* Mobile inline dropdown fallback */}
            <div className="flex-none w-full lg:hidden mb-4">
                <ConsoleDropdown consoles={consoles} />
            </div>

            <ConsolePortal>
                <div className="w-full pb-4 border-b-2 border-slate-100/10 mb-4 z-40 relative">
                    <ConsoleDropdown consoles={consoles} />
                </div>
            </ConsolePortal>

            {/* The rest of the page content */}
            <div className="flex-1 flex flex-col overflow-y-auto w-full min-h-0 relative z-20">
                {children}
            </div>
        </div>
    );
}
