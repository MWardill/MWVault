"use client";

import { useMemo } from "react";
import { JrpgMenuList } from "@/components/ui/JrpgMenuList";
import { Root } from "./Root";
import { TopNav } from "./TopNav";
import { CoreItem } from "./CoreItem";
import { Expandable } from "./Expandable";
import { useMobileMenu } from "./context";

export interface MenuItemType {
    id: string;
    label: string;
    disabled?: boolean;
    onClick?: () => void;
    isMobileCore?: boolean;
    description?: string;
}

export interface MobileMenuProps {
    items: MenuItemType[];
    currentRouteId: string;
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
    const coreItems = useMemo(() => items.filter((item) => item.isMobileCore), [items]);
    const dropdownItems = useMemo(() => items.filter((item) => !item.isMobileCore), [items]);

    return (
        <Root>
            <TopNav>
                {coreItems.map((item) => (
                    <CoreItem
                        key={item.id}
                        label={item.label}
                        isActive={currentRouteId === item.id}
                        disabled={item.disabled}
                        onClick={item.onClick}
                    />
                ))}
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
    CoreItem: typeof CoreItem;
    Expandable: typeof Expandable;
};

MobileMenu.Root = Root;
MobileMenu.TopNav = TopNav;
MobileMenu.CoreItem = CoreItem;
MobileMenu.Expandable = Expandable;
