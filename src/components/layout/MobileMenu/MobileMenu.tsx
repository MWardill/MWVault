"use client";

import { useMemo } from "react";
import { JrpgMenuList } from "@/components/ui/JrpgMenuList";
import { Root } from "./Root";
import { TopNav } from "./TopNav";
import { Expandable } from "./Expandable";
import { useMobileMenu } from "./context";

export interface MenuItemType {
    id: string;
    label: string;
    disabled?: boolean;
    onClick?: () => void;
    description?: string;
}

export interface MobileMenuProps {
    items: MenuItemType[];
    currentRouteId: string;
}

function HomeButton({ isActive, onClick }: { isActive: boolean; onClick?: () => void }) {
    const { setIsOpen } = useMobileMenu();
    return (
        <button
            type="button"
            aria-label="Home"
            onClick={() => { onClick?.(); setIsOpen(false); }}
            className={`py-2 px-4 transition-colors flex items-center justify-center hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${isActive ? 'text-white' : 'text-gray-400'}`}
        >
            Home
        </button>
    );
}

function MobileMenuDropdown({ items }: { items: MenuItemType[] }) {
    const { setIsOpen } = useMobileMenu();
    return (
        <JrpgMenuList
            items={items.map(item => ({
                ...item,
                onClick: () => {
                    item.onClick?.();
                    setIsOpen(false);
                }
            }))}
        />
    );
}

export function MobileMenuMain({ items, currentRouteId }: MobileMenuProps) {
    const homeItem = items.find(i => i.id === 'home');
    const dropdownItems = useMemo(() => items.filter(i => i.id !== 'home'), [items]);

    return (
        <Root>
            <TopNav>
                {homeItem && (
                    <HomeButton isActive={currentRouteId === 'home'} onClick={homeItem.onClick} />
                )}
            </TopNav>
            <Expandable>
                <MobileMenuDropdown items={dropdownItems} />
            </Expandable>
        </Root>
    );
}

export const MobileMenu = MobileMenuMain as typeof MobileMenuMain & {
    Root: typeof Root;
    TopNav: typeof TopNav;
    Expandable: typeof Expandable;
};

MobileMenu.Root = Root;
MobileMenu.TopNav = TopNav;
MobileMenu.Expandable = Expandable;
