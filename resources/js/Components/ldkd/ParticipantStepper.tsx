import { Check } from 'lucide-react';

type ParticipantStepperProps = {
    current: number;
    labels?: string[];
};

const defaultLabels = ['Mode', 'Peran', 'Kode', 'Kuesioner', 'Hasil'];

export default function ParticipantStepper({ current, labels = defaultLabels }: ParticipantStepperProps) {
    return (
        <div className="mx-auto mb-8 w-full max-w-[calc(100vw-2rem)] rounded-2xl border border-[#E8ECF3] bg-white/88 p-2.5 shadow-sm backdrop-blur sm:max-w-3xl sm:p-3">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {labels.map((label, index) => {
                    const state = index < current ? 'done' : index === current ? 'active' : 'idle';

                    return (
                        <div key={label} className="flex min-w-0 flex-col items-center gap-2">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition sm:h-9 sm:w-9 ${
                                    state === 'done'
                                        ? 'bg-[#10B981] text-white'
                                        : state === 'active'
                                          ? 'bg-[#5B5FEF] text-white shadow-[0_12px_24px_-18px_rgba(91,95,239,0.9)]'
                                          : 'bg-[#F3F7FC] text-[#98A2B3]'
                                }`}
                            >
                                {state === 'done' ? <Check className="h-4 w-4" /> : index + 1}
                            </div>
                            <p className={`max-w-full truncate text-[10px] font-semibold sm:text-xs ${state === 'idle' ? 'text-[#98A2B3]' : 'text-[#172033]'}`}>{label}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
