"use client";

import { useParams } from "next/navigation";
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
    const selectedConsole = consoles.find(c => c.shortCode === currentConsoleId);

    return (
        <Root>
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
