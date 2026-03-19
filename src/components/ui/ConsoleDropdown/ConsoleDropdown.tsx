"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Root } from "./Root";
import { Trigger } from "./Trigger";
import { Content } from "./Content";
import { Item } from "./Item";

interface ConsoleDataType {
    id: number;
    shortCode: string;
    name: string;
    iconPath: string | null;
}

export function ConsoleDropdownMain({ consoles }: { consoles: ConsoleDataType[] }) {
    const params = useParams();
    const currentConsoleId = typeof params?.consoleId === 'string' ? params.consoleId : null;

    // Optimistic state to immediately update the trigger UI during the 200ms animation delay
    const [optimisticConsoleId, setOptimisticConsoleId] = useState<string | null>(currentConsoleId);

    // Sync optimistic state whenever the actual URL params change
    useEffect(() => {
        setOptimisticConsoleId(currentConsoleId);
    }, [currentConsoleId]);

    const activeConsoleId = optimisticConsoleId ?? currentConsoleId;
    const selectedConsole = consoles.find(c => c.shortCode === activeConsoleId);

    return (
        <Root onSelect={setOptimisticConsoleId}>
            <Trigger
                selectedName={selectedConsole?.name}
                selectedIconPath={selectedConsole?.iconPath}
            />
            <Content>
                {consoles.map(c => (
                    <Item
                        key={c.id}
                        id={c.id}
                        shortCode={c.shortCode}
                        name={c.name}
                        iconPath={c.iconPath}
                    />
                ))}
            </Content>
        </Root>
    );
}

export const ConsoleDropdown = ConsoleDropdownMain as typeof ConsoleDropdownMain & {
    Root: typeof Root;
    Trigger: typeof Trigger;
    Content: typeof Content;
    Item: typeof Item;
};

ConsoleDropdown.Root = Root;
ConsoleDropdown.Trigger = Trigger;
ConsoleDropdown.Content = Content;
ConsoleDropdown.Item = Item;
