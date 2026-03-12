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
        <div className="flex-1 flex flex-col w-full min-h-0">
            {/* Mobile inline dropdown — hidden on lg+ where the portal version is used */}
            <div className="flex-none w-full lg:hidden mb-4">
                <ConsoleDropdown consoles={consoles} />
            </div>

            {/* Desktop: portals the dropdown into the sidebar portal slot in AppShell */}
            <ConsolePortal>
                <div className="w-full pb-4 border-b-2 border-slate-100/10 mb-4 z-40 relative">
                    <ConsoleDropdown consoles={consoles} />
                </div>
            </ConsolePortal>

            {/* Page content — flex-1 + min-h-0 lets parent control scroll */}
            <div className="flex-1 flex flex-col w-full min-h-0">
                {children}
            </div>
        </div>
    );
}
