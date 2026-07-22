import axios from 'axios';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    BookOpenCheck,
    Check,
    CheckCircle2,
    ClipboardCheck,
    Globe2,
    Loader2,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ParticipantStepper from '@/Components/ldkd/ParticipantStepper';

type Language = 'id' | 'en';
type Phase = 'instructions' | 'questions' | 'review';
type ModuleKey = 'digital_literacy' | 'data_security';

interface AnswerOption {
    id: number;
    label_id: string;
    label_en: string;
}

interface Question {
    id: number;
    module?: ModuleKey;
    text_id: string;
    text_en: string;
    answer_options: AnswerOption[];
}

interface Props {
    questions: Partial<Record<ModuleKey, Question[]>>;
    participant_id: number;
    test_type: 'pre_test' | 'post_test';
    activity_id: number;
    language?: Language;
}

const copy = {
    id: {
        title: 'Kuesioner LDKD Care',
        badge: 'Digital Literacy & Data Security Assessment',
        instructionsTitle: 'Instruksi Pengisian',
        instructionsText: 'Jawab seluruh pertanyaan sesuai kondisi Anda. Semua soal wajib dijawab sebelum dikirim.',
        instructionItems: [
            'Terdapat dua modul: Literasi Digital dan Keamanan Digital.',
            'Perkiraan waktu pengisian 5-10 menit.',
            'Gunakan skala jawaban yang tersedia pada setiap pertanyaan.',
            'Jawaban tidak dapat diubah setelah submit.',
        ],
        agree: 'Saya memahami instruksi dan bersedia mengisi kuesioner.',
        start: 'Mulai Kuesioner',
        question: 'Soal',
        from: 'dari',
        answered: 'terjawab',
        progress: 'Progress Pengisian',
        estimated: '5-10 menit',
        prev: 'Sebelumnya',
        next: 'Selanjutnya',
        review: 'Review Jawaban',
        reviewTitle: 'Review Sebelum Submit',
        reviewText: 'Pastikan semua soal sudah terjawab. Anda masih dapat kembali untuk mengubah jawaban.',
        finalConfirm: 'Saya sudah memeriksa jawaban dan siap mengirim kuesioner.',
        edit: 'Edit',
        submit: 'Submit Jawaban',
        submitting: 'Menyimpan Jawaban',
        missing: 'Belum dijawab',
        complete: 'Lengkap',
        validation: 'Pilih salah satu jawaban untuk melanjutkan.',
        submitError: 'Terjadi kesalahan. Silakan coba lagi.',
        noQuestion: 'Belum ada soal aktif. Hubungi admin kegiatan.',
        digital_literacy: 'Literasi Digital',
        data_security: 'Keamanan Digital',
        pre: 'Pre-Test',
        post: 'Post-Test',
    },
    en: {
        title: 'LDKD Care Questionnaire',
        badge: 'Digital Literacy & Data Security Assessment',
        instructionsTitle: 'Questionnaire Instructions',
        instructionsText: 'Answer every question based on your condition. All questions are required before submission.',
        instructionItems: [
            'There are two modules: Digital Literacy and Digital Security.',
            'Estimated completion time is 5-10 minutes.',
            'Use the available response scale on each question.',
            'Answers cannot be changed after submission.',
        ],
        agree: 'I understand the instructions and agree to complete the questionnaire.',
        start: 'Start Questionnaire',
        question: 'Question',
        from: 'of',
        answered: 'answered',
        progress: 'Completion Progress',
        estimated: '5-10 minutes',
        prev: 'Previous',
        next: 'Next',
        review: 'Review Answers',
        reviewTitle: 'Review Before Submit',
        reviewText: 'Make sure all questions are answered. You can still go back and change answers.',
        finalConfirm: 'I have reviewed my answers and am ready to submit the questionnaire.',
        edit: 'Edit',
        submit: 'Submit Answers',
        submitting: 'Saving Answers',
        missing: 'Missing',
        complete: 'Complete',
        validation: 'Choose one answer to continue.',
        submitError: 'Something went wrong. Please try again.',
        noQuestion: 'No active questions are available. Contact the activity admin.',
        digital_literacy: 'Digital Literacy',
        data_security: 'Digital Security',
        pre: 'Pre-Test',
        post: 'Post-Test',
    },
};

export default function Questionnaire({ questions, participant_id, test_type, activity_id, language: initialLanguage = 'id' }: Props) {
    const reduceMotion = useReducedMotion();
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const [phase, setPhase] = useState<Phase>('instructions');
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [hasAgreed, setHasAgreed] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [finalConfirmed, setFinalConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const t = copy[language];
    const storageKey = `ldkd-care:${activity_id}:${participant_id}:${test_type}`;

    const moduleQuestions = useMemo(
        () => ({
            digital_literacy: (questions.digital_literacy || []).map((question) => ({ ...question, module: 'digital_literacy' as ModuleKey })),
            data_security: (questions.data_security || []).map((question) => ({ ...question, module: 'data_security' as ModuleKey })),
        }),
        [questions],
    );

    const allQuestions = useMemo(
        () => [...moduleQuestions.digital_literacy, ...moduleQuestions.data_security],
        [moduleQuestions],
    );

    const currentQuestion = allQuestions[currentStep];
    const answeredCount = allQuestions.filter((question) => Boolean(answers[question.id])).length;
    const missingQuestions = allQuestions.filter((question) => !answers[question.id]);
    const progressPercentage = allQuestions.length > 0 ? Math.round((answeredCount / allQuestions.length) * 100) : 0;

    useEffect(() => {
        const saved = window.localStorage.getItem(storageKey);

        if (!saved) {
            return;
        }

        try {
            const parsed = JSON.parse(saved) as {
                answers?: Record<number, number>;
                currentStep?: number;
                phase?: Phase;
                language?: Language;
                hasAgreed?: boolean;
            };

            setAnswers(parsed.answers || {});
            setCurrentStep(Math.min(parsed.currentStep || 0, Math.max(allQuestions.length - 1, 0)));
            setPhase(parsed.phase || 'instructions');
            setLanguage(parsed.language || initialLanguage);
            setHasAgreed(Boolean(parsed.hasAgreed));
        } catch {
            window.localStorage.removeItem(storageKey);
        }
    }, [allQuestions.length, initialLanguage, storageKey]);

    useEffect(() => {
        window.localStorage.setItem(
            storageKey,
            JSON.stringify({
                answers,
                currentStep,
                phase,
                language,
                hasAgreed,
            }),
        );
    }, [answers, currentStep, phase, language, hasAgreed, storageKey]);

    const pageTransition = {
        initial: { opacity: 0, x: reduceMotion ? 0 : 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: reduceMotion ? 0 : -20 },
        transition: { duration: reduceMotion ? 0 : 0.25 },
    };

    const handleSelectOption = (questionId: number, optionId: number) => {
        setAnswers((current) => ({ ...current, [questionId]: optionId }));
        setValidationError(null);
    };

    const goToQuestion = (index: number) => {
        setCurrentStep(index);
        setPhase('questions');
        setValidationError(null);
    };

    const handleNext = () => {
        if (!currentQuestion || !answers[currentQuestion.id]) {
            setValidationError(t.validation);
            return;
        }

        if (currentStep === allQuestions.length - 1) {
            setPhase('review');
            return;
        }

        setCurrentStep((step) => step + 1);
        setValidationError(null);
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((step) => step - 1);
        }
        setValidationError(null);
    };

    const submit = () => {
        if (missingQuestions.length > 0) {
            goToQuestion(allQuestions.findIndex((question) => question.id === missingQuestions[0].id));
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        axios
            .post(route('participant.submit'), {
                participant_id,
                test_type,
                activity_id,
                language,
                answers,
            })
            .then((res: any) => {
                if (res.data.success && res.data.redirect) {
                    setIsSubmitted(true);
                    window.localStorage.removeItem(storageKey);
                    window.location.href = res.data.redirect;
                }
            })
            .catch((error: any) => {
                setSubmitError(error.response?.data?.message || t.submitError);
                setIsSubmitting(false);
            });
    };

    if (allQuestions.length === 0) {
        return (
            <ParticipantLayout>
                <Head title={t.title} />
                <div className="mx-auto flex w-full max-w-lg flex-1 items-center justify-center">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-600" />
                            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">{t.noQuestion}</h1>
                        </CardContent>
                    </Card>
                </div>
            </ParticipantLayout>
        );
    }

    return (
        <ParticipantLayout>
            <Head title={t.title} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col pb-12 pt-2">
                <ParticipantStepper current={3} />
                <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.08fr_0.92fr]">
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                                    <Sparkles className="h-4 w-4" />
                                    {t.badge}
                                </div>
                                <h1 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-normal text-slate-950 sm:text-4xl">
                                    {t.title}
                                </h1>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-600">
                                        {test_type === 'pre_test' ? t.pre : t.post}
                                    </span>
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-700">
                                        {t.digital_literacy}
                                    </span>
                                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-700">
                                        {t.data_security}
                                    </span>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                                        {t.estimated}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-950 p-4 text-white shadow-xl shadow-slate-950/10">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.progress}</p>
                                    <p className="mt-1 font-heading text-2xl font-bold">{progressPercentage}%</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                                >
                                    <Globe2 className="h-4 w-4" />
                                    {language.toUpperCase()}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                    <BookOpenCheck className="mb-3 h-5 w-5 text-indigo-300" />
                                    <p className="text-xs font-semibold text-slate-400">{t.digital_literacy}</p>
                                    <p className="mt-1 text-lg font-bold">
                                        {moduleQuestions.digital_literacy.filter((question) => answers[question.id]).length}/{moduleQuestions.digital_literacy.length}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                    <ShieldCheck className="mb-3 h-5 w-5 text-cyan-300" />
                                    <p className="text-xs font-semibold text-slate-400">{t.data_security}</p>
                                    <p className="mt-1 text-lg font-bold">
                                        {moduleQuestions.data_security.filter((question) => answers[question.id]).length}/{moduleQuestions.data_security.length}
                                    </p>
                                </div>
                            </div>

                            {phase !== 'instructions' && (
                                <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-300">
                                        <span>
                                            {answeredCount} / {allQuestions.length} {t.answered}
                                        </span>
                                        <span>{progressPercentage}%</span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500"
                                            animate={{ width: `${progressPercentage}%` }}
                                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 24 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <AnimatePresence mode="wait">
                    {phase === 'instructions' && (
                        <motion.div key="instructions" {...pageTransition}>
                            <Card className="!border-slate-200 !bg-white !shadow-sm">
                                <CardContent className="p-8">
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                                        <ClipboardCheck className="h-7 w-7" />
                                    </div>
                                    <h2 className="font-heading text-3xl font-bold text-slate-950">{t.instructionsTitle}</h2>
                                    <p className="mt-3 leading-7 text-slate-600">{t.instructionsText}</p>

                                    <div className="mt-8 grid gap-3">
                                        {t.instructionItems.map((item) => (
                                            <div key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                                <p className="text-sm font-medium leading-6 text-slate-600">{item}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40">
                                        <input
                                            type="checkbox"
                                            checked={hasAgreed}
                                            onChange={(event) => setHasAgreed(event.target.checked)}
                                            className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="font-medium leading-6 text-slate-700">{t.agree}</span>
                                    </label>

                                    <div className="mt-8 flex justify-end">
                                        <Button size="lg" disabled={!hasAgreed} onClick={() => setPhase('questions')} className="gap-2">
                                            {t.start}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {phase === 'questions' && currentQuestion && (
                        <motion.div key={`question-${currentQuestion.id}`} {...pageTransition}>
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                                    currentQuestion.module === 'digital_literacy'
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                        : 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300'
                                }`}>
                                    {currentQuestion.module === 'digital_literacy' ? <BookOpenCheck className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                    {t[currentQuestion.module || 'digital_literacy']}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {t.question} {currentStep + 1} {t.from} {allQuestions.length}
                                </span>
                            </div>

                            <motion.div animate={validationError && !reduceMotion ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.28 }}>
                                <Card className="flex min-h-[420px] flex-col !border-slate-200 !bg-white !shadow-sm">
                                    <CardContent className="flex flex-1 flex-col p-7 sm:p-8">
                                        <div className="mb-8 flex-1">
                                            <h2 className="font-heading text-2xl font-semibold leading-tight text-slate-950 md:text-3xl">
                                                {language === 'id' ? currentQuestion.text_id : currentQuestion.text_en || currentQuestion.text_id}
                                            </h2>
                                        </div>

                                        <div className="space-y-3">
                                            {currentQuestion.answer_options.map((option) => {
                                                const isSelected = answers[currentQuestion.id] === option.id;

                                                return (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                                                        className={`group flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                                            isSelected
                                                                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-md'
                                                                : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <span className="text-base font-semibold sm:text-lg">
                                                            {language === 'id' ? option.label_id : option.label_en || option.label_id}
                                                        </span>
                                                        {isSelected && <CheckCircle2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {validationError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                                            >
                                                {validationError}
                                            </motion.p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <div className="mt-8 flex items-center justify-between">
                                <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0 || isSubmitting} className={currentStep === 0 ? 'invisible' : ''}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t.prev}
                                </Button>

                                <Button size="lg" onClick={handleNext} disabled={isSubmitting} className="gap-2 px-8">
                                    {currentStep === allQuestions.length - 1 ? t.review : t.next}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'review' && (
                        <motion.div key="review" {...pageTransition}>
                            <Card className="!border-slate-200 !bg-white !shadow-sm">
                                <CardContent className="p-8">
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                        <ClipboardCheck className="h-7 w-7" />
                                    </div>
                                    <h2 className="font-heading text-3xl font-bold text-slate-950">{t.reviewTitle}</h2>
                                    <p className="mt-3 leading-7 text-slate-600">{t.reviewText}</p>

                                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                                        {(['digital_literacy', 'data_security'] as ModuleKey[]).map((module) => {
                                            const total = moduleQuestions[module].length;
                                            const answered = moduleQuestions[module].filter((question) => answers[question.id]).length;
                                            const isComplete = total > 0 && answered === total;

                                            return (
                                                <div key={module} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <p className="font-heading text-lg font-bold text-slate-950">{t[module]}</p>
                                                            <p className="mt-1 text-sm font-medium text-slate-500">
                                                                {answered} / {total} {t.answered}
                                                            </p>
                                                        </div>
                                                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {isComplete ? t.complete : t.missing}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {missingQuestions.length > 0 && (
                                        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                                            <div className="mb-3 flex items-center gap-2 font-bold">
                                                <AlertTriangle className="h-5 w-5" />
                                                {t.missing}
                                            </div>
                                            <div className="space-y-2">
                                                {missingQuestions.map((question) => (
                                                    <button
                                                        key={question.id}
                                                        type="button"
                                                        onClick={() => goToQuestion(allQuestions.findIndex((item) => item.id === question.id))}
                                                        className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-amber-100 dark:bg-slate-900 dark:text-slate-200"
                                                    >
                                                        <span>
                                                            {t.question} {allQuestions.findIndex((item) => item.id === question.id) + 1}
                                                        </span>
                                                        <span>{t.edit}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {submitError && (
                                        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                                            {submitError}
                                        </div>
                                    )}

                                    <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4 transition hover:border-[#D9DDFF] hover:bg-[#F1F3FF]/50">
                                        <input
                                            type="checkbox"
                                            checked={finalConfirmed}
                                            onChange={(event) => setFinalConfirmed(event.target.checked)}
                                            className="mt-1 h-5 w-5 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                                        />
                                        <span className="font-medium leading-6 text-[#667085]">{t.finalConfirm}</span>
                                    </label>

                                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                                        <Button variant="ghost" onClick={() => setPhase('questions')} disabled={isSubmitting}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            {t.prev}
                                        </Button>
                                        <Button size="lg" onClick={submit} disabled={isSubmitting || isSubmitted || missingQuestions.length > 0 || !finalConfirmed} className="gap-2">
                                            {isSubmitted ? (
                                                <Check className="h-5 w-5" />
                                            ) : isSubmitting ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-5 w-5" />
                                            )}
                                            {isSubmitting ? t.submitting : t.submit}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ParticipantLayout>
    );
}
