import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, Printer } from 'lucide-react';

interface PrintableAnswerOption {
    id: number;
    label_id: string;
    label_en?: string | null;
    display_order?: number;
}

interface PrintableQuestion {
    id: number;
    module: 'digital_literacy' | 'data_security';
    module_label: string;
    kominfo_pillar?: string | null;
    pillar_label: string;
    text_id: string;
    text_en?: string | null;
    display_order?: number;
    question_type?: string | null;
    response_scale?: string | null;
    answer_options: PrintableAnswerOption[];
}

interface Props {
    questions: PrintableQuestion[];
    version?: {
        id: number;
        name: string;
        code: string;
        status: string;
    } | null;
    filters: {
        module: 'all' | 'digital_literacy' | 'data_security';
        pillar?: string | null;
        version_id?: number | null;
    };
    printedAt: string;
    sourceNote: string;
}

type IndexedQuestion = PrintableQuestion & { print_number: number };

export default function Print({ questions, version, filters, printedAt, sourceNote }: Props) {
    const indexedQuestions = questions.map((question, index) => ({ ...question, print_number: index + 1 }));
    const moduleGroups = groupBy(indexedQuestions, (question) => question.module);
    const backModule = filters.module === 'data_security' ? 'data_security' : 'digital_literacy';
    const backParams = {
        module: backModule,
        ...(filters.pillar ? { pillar: filters.pillar } : {}),
        ...(filters.version_id ? { version_id: filters.version_id } : {}),
    };

    return (
        <>
            <Head title="Cetak Kuesioner" />
            <style>{printStyles}</style>

            <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-[#172033] print:bg-white print:p-0">
                <div className="screen-only mx-auto mb-5 flex max-w-5xl flex-col gap-3 rounded-2xl border border-[#E8ECF3] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Preview Cetak</p>
                        <p className="mt-1 text-sm text-[#667085]">Layout kertas akan otomatis dirapikan saat dicetak.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href={route('admin.questions.index', backParams)}>
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button type="button" className="gap-2" onClick={() => window.print()}>
                            <Printer className="h-4 w-4" />
                            Cetak Sekarang
                        </Button>
                    </div>
                </div>

                <article className="print-sheet mx-auto max-w-5xl rounded-3xl border border-[#E8ECF3] bg-white p-8 shadow-[0_24px_70px_-45px_rgba(23,32,51,0.45)] print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
                    <header className="border-b-2 border-[#172033] pb-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF] print:text-black">LDKD Care</p>
                                <h1 className="mt-2 font-heading text-3xl font-bold tracking-normal text-[#172033] print:text-[20pt]">
                                    Lembar Kuesioner Literasi Digital dan Keamanan Digital
                                </h1>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085] print:text-[9pt] print:text-black">
                                    {sourceNote}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4 text-sm print:border-black print:bg-white">
                                <InfoRow label="Versi" value={version ? `${version.name} (${version.code})` : '-'} />
                                <InfoRow label="Jumlah Soal" value={`${questions.length} soal`} />
                                <InfoRow label="Dicetak" value={printedAt} />
                            </div>
                        </div>
                    </header>

                    <section className="mt-6 rounded-2xl border border-[#E8ECF3] p-5 print:mt-4 print:rounded-none print:border-black print:p-3">
                        <h2 className="font-heading text-lg font-bold print:text-[12pt]">Identitas Peserta</h2>
                        <div className="mt-4 grid gap-x-6 gap-y-4 md:grid-cols-2 print:grid-cols-2">
                            <FillLine label="Kode Peserta" hint="LDKD-_____" />
                            <FillLine label="Jenis Tes" hint="Pre-Test / Post-Test" />
                            <FillLine label="Nama Lengkap" />
                            <FillLine label="Peran" hint="Siswa / Guru" />
                            <FillLine label="Sekolah" />
                            <FillLine label="Kelas / Jabatan" />
                            <FillLine label="Tanggal Pengisian" />
                            <FillLine label="Tanda Tangan" />
                        </div>
                    </section>

                    <section className="mt-5 rounded-2xl border border-[#D9DDFF] bg-[#F8FAFC] p-5 print:rounded-none print:border-black print:bg-white print:p-3">
                        <h2 className="font-heading text-lg font-bold print:text-[12pt]">Petunjuk Pengisian</h2>
                        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-[#667085] print:text-[9pt] print:text-black">
                            <li>Isi identitas peserta dengan jelas sebelum menjawab soal.</li>
                            <li>Pilih satu jawaban pada setiap pertanyaan dengan memberi tanda centang pada kotak pilihan.</li>
                            <li>Gunakan kode peserta yang sama untuk Pre-Test dan Post-Test agar hasil dapat dibandingkan.</li>
                            <li>Setelah selesai, serahkan lembar ini kepada admin atau panitia untuk dimasukkan kembali ke sistem.</li>
                        </ol>
                    </section>

                    {questions.length === 0 ? (
                        <section className="mt-8 rounded-2xl border border-dashed border-[#CBD5E1] p-10 text-center text-[#667085] print:border-black">
                            Belum ada soal aktif yang dapat dicetak untuk filter ini.
                        </section>
                    ) : (
                        <div className="mt-8 space-y-8 print:mt-6 print:space-y-5">
                            {moduleGroups.map(([module, moduleQuestions]) => (
                                <section key={module} className="module-section">
                                    <div className="module-title mb-4 rounded-2xl bg-[#F1F3FF] px-5 py-4 print:rounded-none print:border print:border-black print:bg-white print:px-3 print:py-2">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5B5FEF] print:text-black">
                                            Modul
                                        </p>
                                        <h2 className="mt-1 font-heading text-2xl font-bold print:text-[15pt]">
                                            {moduleQuestions[0]?.module_label || module}
                                        </h2>
                                    </div>

                                    {groupBy(moduleQuestions, (question) => question.kominfo_pillar || 'other').map(([pillar, pillarQuestions]) => (
                                        <div key={pillar} className="pillar-section mb-6 print:mb-4">
                                            <h3 className="mb-3 border-b border-[#E8ECF3] pb-2 font-heading text-lg font-bold text-[#172033] print:border-black print:text-[12pt]">
                                                {pillarQuestions[0]?.pillar_label || pillar}
                                            </h3>
                                            <div className="space-y-4 print:space-y-3">
                                                {pillarQuestions.map((question) => (
                                                    <QuestionBlock key={question.id} question={question} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            ))}
                        </div>
                    )}

                    <footer className="mt-8 border-t border-[#E8ECF3] pt-4 text-xs leading-5 text-[#667085] print:mt-6 print:border-black print:text-[8pt] print:text-black">
                        Lembar ini digunakan untuk pengisian manual ketika peserta tidak memiliki perangkat. Admin tetap perlu memasukkan jawaban ke sistem agar skor dan perbandingan Pre-Test/Post-Test dapat dihitung otomatis.
                    </footer>
                </article>
            </main>
        </>
    );
}

function QuestionBlock({ question }: { question: IndexedQuestion }) {
    return (
        <article className="question-block rounded-2xl border border-[#E8ECF3] p-5 print:rounded-none print:border-black print:p-3">
            <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5B5FEF] text-sm font-bold text-white print:h-7 print:w-7 print:bg-white print:text-[9pt] print:text-black print:ring-1 print:ring-black">
                    {question.print_number}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-base font-bold leading-7 text-[#172033] print:text-[10.5pt] print:leading-5">
                        {question.text_id}
                    </p>
                    {question.text_en && (
                        <p className="mt-1 text-sm leading-6 text-[#667085] print:text-[9pt] print:leading-5 print:text-black">
                            {question.text_en}
                        </p>
                    )}
                    {question.response_scale && (
                        <p className="mt-2 text-xs font-semibold text-[#98A2B3] print:text-[8pt] print:text-black">
                            Skala: {question.response_scale}
                        </p>
                    )}

                    <div className="mt-4 grid gap-2 md:grid-cols-2 print:grid-cols-2 print:gap-1.5">
                        {question.answer_options.map((option, index) => (
                            <div key={option.id} className="answer-option flex items-start gap-2 rounded-xl border border-[#E8ECF3] bg-[#F8FAFC] px-3 py-2 print:rounded-none print:border-black print:bg-white print:px-2 print:py-1.5">
                                <span className="answer-box mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-[#667085] print:h-3.5 print:w-3.5 print:border-black" />
                                <span className="font-bold text-[#172033] print:text-[9pt]">{optionLetter(index)}.</span>
                                <span className="text-sm font-medium leading-5 text-[#172033] print:text-[9pt] print:leading-4">
                                    {option.label_id}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}

function FillLine({ label, hint = '' }: { label: string; hint?: string }) {
    return (
        <div className="grid grid-cols-[120px_1fr] items-end gap-3 text-sm print:grid-cols-[85px_1fr] print:text-[9pt]">
            <span className="font-bold text-[#172033]">{label}</span>
            <span className="min-h-7 border-b border-[#98A2B3] px-2 pb-1 text-[#98A2B3] print:min-h-6 print:border-black print:text-black">
                {hint}
            </span>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-[80px_1fr] gap-2">
            <span className="font-bold text-[#667085] print:text-black">{label}</span>
            <span className="font-semibold text-[#172033]">{value}</span>
        </div>
    );
}

function groupBy<T>(items: T[], keyGetter: (item: T) => string): Array<[string, T[]]> {
    const groups = new Map<string, T[]>();

    items.forEach((item) => {
        const key = keyGetter(item);
        groups.set(key, [...(groups.get(key) || []), item]);
    });

    return Array.from(groups.entries());
}

function optionLetter(index: number): string {
    return String.fromCharCode(65 + index);
}

const printStyles = `
@page {
    size: A4;
    margin: 12mm;
}

@media print {
    html,
    body {
        background: #ffffff !important;
    }

    .screen-only {
        display: none !important;
    }

    .print-sheet {
        width: 100% !important;
    }

    .module-section,
    .pillar-section,
    .question-block,
    .answer-option {
        break-inside: avoid;
        page-break-inside: avoid;
    }

    .module-section + .module-section {
        break-before: page;
        page-break-before: always;
    }
}
`;
