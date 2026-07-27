import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

type SelectValue = string | number | null | undefined;

export interface ModernSelectOption {
    value: string | number;
    label: ReactNode;
    disabled?: boolean;
}

interface ModernSelectProps {
    id?: string;
    value?: SelectValue;
    onChange: (value: string) => void;
    options?: ModernSelectOption[];
    children?: ReactNode;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    contentClassName?: string;
}

const EMPTY_VALUE = '__ldkd_empty_value__';

export default function ModernSelect({
    id,
    value,
    onChange,
    options,
    children,
    placeholder = 'Pilih opsi',
    disabled = false,
    className = '',
    contentClassName = '',
}: ModernSelectProps) {
    const parsedOptions = options ?? optionsFromChildren(children);
    const stringValue = value === null || value === undefined ? '' : String(value);
    const radixValue = stringValue === '' ? EMPTY_VALUE : stringValue;

    return (
        <SelectPrimitive.Root
            value={radixValue}
            onValueChange={(nextValue) => onChange(nextValue === EMPTY_VALUE ? '' : nextValue)}
            disabled={disabled}
        >
            <SelectPrimitive.Trigger
                id={id}
                className={`group flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#E8ECF3] bg-white px-3 text-left text-sm font-semibold text-[#172033] shadow-sm outline-none transition hover:border-[#D9DDFF] hover:bg-[#FBFDFF] focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#5B5FEF]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#98A2B3] ${className}`}
            >
                <SelectPrimitive.Value placeholder={placeholder} />
                <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#667085] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={8}
                    className={`z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-[#E8ECF3] bg-white p-1 shadow-[0_24px_70px_-32px_rgba(23,32,51,0.38)] data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:slide-in-from-top-1 ${contentClassName}`}
                >
                    <SelectPrimitive.Viewport className="max-h-72 overflow-y-auto p-1">
                        {parsedOptions.map((option) => (
                            <SelectPrimitive.Item
                                key={String(option.value)}
                                value={option.value === '' ? EMPTY_VALUE : String(option.value)}
                                disabled={option.disabled}
                                textValue={textFromNode(option.label)}
                                className="relative flex min-h-10 cursor-pointer select-none items-center rounded-xl py-2 pl-9 pr-3 text-sm font-semibold text-[#172033] outline-none transition data-[disabled]:pointer-events-none data-[highlighted]:bg-[#F1F3FF] data-[state=checked]:bg-[#EEF7FF] data-[highlighted]:text-[#5B5FEF] data-[disabled]:text-[#98A2B3]"
                            >
                                <SelectPrimitive.ItemIndicator className="absolute left-3 flex h-4 w-4 items-center justify-center text-[#5B5FEF]">
                                    <Check className="h-4 w-4" />
                                </SelectPrimitive.ItemIndicator>
                                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                            </SelectPrimitive.Item>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}

function optionsFromChildren(children: ReactNode): ModernSelectOption[] {
    return Children.toArray(children)
        .filter(isValidElement)
        .map((child) => {
            const option = child as ReactElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>;

            return {
                value: option.props.value ?? '',
                label: option.props.children,
                disabled: option.props.disabled,
            };
        });
}

function textFromNode(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }

    if (Array.isArray(node)) {
        return node.map(textFromNode).join(' ');
    }

    return '';
}
