// Question interface

export interface Question {
    id: number;
    level: number;
    question: string;
    answer: string;
    hint: string;
    isTest: boolean;
}