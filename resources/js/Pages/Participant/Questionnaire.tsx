import axios from 'axios';
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Question {
    id: number;
    text_id: string;
    text_en: string;
    answer_options: {
        id: number;
        label_id: string;
        label_en: string;
    }[];
}

interface Props {
    questions: {
        digital_literacy: Question[];
        data_security: Question[];
    };
    participant_id: number;
    test_type: string;
    activity_id: number;
}

export default function Questionnaire({ questions, participant_id, test_type, activity_id }: Props) {
    const allQuestions = [
        ...questions.digital_literacy,
        ...questions.data_security,
    ];
    
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const currentQuestion = allQuestions[currentStep];
    const isLastStep = currentStep === allQuestions.length - 1;
    const progressPercentage = Math.round(((currentStep + 1) / allQuestions.length) * 100);

    const handleSelectOption = (questionId: number, optionId: number) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleNext = () => {
        if (isLastStep) {
            submit();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submit = () => {
        setIsSubmitting(true);
        axios.post(route('participant.submit'), {
            participant_id,
            test_type,
            activity_id,
            language: 'id',
            answers,
        }).then((res: any) => {
            if (res.data.success && res.data.redirect) {
                window.location.href = res.data.redirect;
            }
        }).catch((err: any) => {
            alert('Terjadi kesalahan. Silakan coba lagi.');
            setIsSubmitting(false);
        });
    };

    return (
        <ParticipantLayout>
            <Head title="Kuesioner" />
            
            <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto pt-4 pb-12">
                
                {/* Progress Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Soal {currentStep + 1} dari {allQuestions.length}
                        </span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {progressPercentage}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <Card className="flex-1 flex flex-col min-h-[400px]">
                    <CardContent className="p-8 flex-1 flex flex-col">
                        <div className="mb-8 flex-1">
                            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-slate-900 dark:text-white leading-tight">
                                {currentQuestion.text_id}
                            </h2>
                            {/* <p className="text-slate-500 mt-2 italic text-sm">{currentQuestion.text_en}</p> */}
                        </div>

                        <div className="space-y-3">
                            {currentQuestion.answer_options.map(option => {
                                const isSelected = answers[currentQuestion.id] === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group ${
                                            isSelected 
                                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 shadow-md' 
                                                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <span className="font-medium text-lg">{option.label_id}</span>
                                        {isSelected && <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8">
                    <Button 
                        variant="ghost" 
                        onClick={handlePrev}
                        disabled={currentStep === 0 || isSubmitting}
                        className={currentStep === 0 ? 'invisible' : ''}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Sebelumnya
                    </Button>

                    <Button 
                        size="lg"
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id] || isSubmitting}
                        className="px-8"
                    >
                        {isSubmitting ? 'Menyimpan...' : isLastStep ? 'Selesai & Kirim' : 'Selanjutnya'}
                        {!isLastStep && !isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
                
            </div>
        </ParticipantLayout>
    );
}
