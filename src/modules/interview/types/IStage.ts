import type { Timestamp } from 'firebase/firestore'

export interface IStage {
  name: string
  date: Date | Timestamp | string
  description: string
}
