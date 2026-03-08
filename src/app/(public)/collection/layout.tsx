import { getAllConsoles } from "./actions";
import { ConsoleDropdown } from "@/components/ui/ConsoleDropdown";

export const dynamic = "force-dynamic";

export default async function CollectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const consoles = await getAllConsoles();

    return (
        <div className="flex-1 flex flex-col w-full relative h-[calc(100vh-140px)]">
            {/* The dropdown handles its own height/margin */}
            <div className="flex-none w-full">
                <ConsoleDropdown consoles={consoles} />
            </div>

            {/* The rest of the page content */}
            <div className="flex-1 flex flex-col overflow-y-auto w-full min-h-0 relative z-20">
                {children}
            </div>
        </div>
    );
}
