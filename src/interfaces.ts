import type { Timestamp } from 'firebase/firestore'

export interface IInterview {
    id: string,
    company: string,
    vacancyLink: string,
    hrName: string,
    contactTelegram?: string,
    contactWhatsApp?: string,
    contactPhone?: string,
    createdAt: Date,
    salaryFrom?: number | null,
    salaryTo?: number | null,
    stages?: IStage[],
    result?: TResultFilter,
}
export type TResultFilter = 'Refusal' | 'Offer' | 'inProgress'

export interface IStage {
    name: string,
    date?: Date | Timestamp,
    description: string,
}