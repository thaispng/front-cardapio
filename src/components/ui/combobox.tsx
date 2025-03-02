"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboboxProps {
    items: { value: string; label: string }[];
    placeholder?: string;
    onSelect: (value: string) => void;
    onAddNew?: () => void;
    defaultValue?: string;
}

export function Combobox({ items, placeholder = "Selecione uma opção...", onSelect, onAddNew, defaultValue }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(defaultValue || "");
    
    React.useEffect(() => {
        setValue(defaultValue || "");
    }, [defaultValue]);


    const handleSelect = (selectedValue: string) => {
        setValue(selectedValue);
        onSelect(selectedValue);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {value ? items.find((item) => item.value === value)?.label : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Pesquise..." />
                    <CommandList>
                        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => handleSelect(item.value)}
                                >
                                    {item.label}
                                    <Check className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {onAddNew && (
                            <div className="p-1 border-t">
                                <Button variant="default" className="w-full" onClick={onAddNew}>
                                    <Plus className="h-4 w-4" />
                                    <span>Cadastrar categoria</span>
                                </Button>
                            </div>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
