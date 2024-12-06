import { defineStore } from 'pinia'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'

import type { IInterviewsStoreState } from '@/modules/interview/types/IInterviewsStoreState'
import type { IInterview } from '@/modules/interview/types/IInterview'
import type { IStage } from '@/modules/interview/types/IStage'

export const useInterviewStore = defineStore('interviewsStore', {
  state: (): IInterviewsStoreState => ({
    interviews: [],
    selectedFilterResult: '',
    currentInterview: {
      id: '',
      company: '',
      vacancyLink: '',
      hrName: '',
      contactTelegram: '',
      contactWhatsApp: '',
      contactPhone: '',
      createdAt: new Date(),
      salaryFrom: null,
      salaryTo: null,
      stages: [],
      result: 'inProgress'
    }
  }),
  getters: {},
  actions: {
    setFilterResult(filterValue: string) {
      this.selectedFilterResult = filterValue
    },
    setInterviewId(id: string) {
      this.currentInterview.id = id
    },
    addStage() {
      if (!this.currentInterview) {
        return
      }

      this.currentInterview.stages = [
        ...this.currentInterview.stages,
        { name: '', date: '', description: '' }
      ]
    },
    removeStage(index: number) {
      if (!this.currentInterview) {
        return
      }
      if (this.currentInterview.stages.length === 0) {
        return
      }
      this.currentInterview.stages.splice(index, 1)
    },
    clearFilter() {
      this.setFilterResult('')
    },
    async getAllInterviews(isFilter: boolean = false) {
      const feedbackStore = useFeedbackStore()
      const db = getFirestore()

      try {
        const userInterviewsRaw = () => {
          if (isFilter) {
            return query(
              collection(db, `users/${userIdFromStorage()}/interviews`),
              orderBy('createdAt', 'desc'),
              where('result', '==', this.selectedFilterResult)
            )
          }
          return query(
            collection(db, `users/${userIdFromStorage()}/interviews`),
            orderBy('createdAt', 'desc')
          )
        }
        const userInterviewsData = await getDocs(userInterviewsRaw())
        this.interviews = userInterviewsData.docs.map((doc) => {
          return doc.data() as IInterview
        })
      } catch (error: unknown) {
        if (error instanceof Error) {
          feedbackStore.showToast({ type: 'error', title: 'Error', message: error.message })
        }
      }
    },
    async updateInterview() {
      const db = getFirestore()
      const interviewDataBaseReference = doc(
        db,
        `users/${userIdFromStorage()}/interviews`,
        this.currentInterview.id
      )
      await updateDoc(interviewDataBaseReference, this.currentInterview)
    },
    async getInterview(): Promise<void> {
      const feedbackStore = useFeedbackStore()
      feedbackStore.isGlobalLoading = true
      const db = getFirestore()
      const interviewDataBaseReference = doc(
        db,
        `users/${userIdFromStorage()}/interviews`,
        this.currentInterview.id
      )
      const interviewDataBaseSnapshot = await getDoc(interviewDataBaseReference)

      if (interviewDataBaseSnapshot.exists()) {
        const interviewData = interviewDataBaseSnapshot.data() as IInterview
        if (interviewData.stages && interviewData.stages.length) {
          interviewData.stages = interviewData.stages.map((stage: IStage) => {
            if (stage.date && stage.date instanceof Timestamp) {
              return {
                ...stage,
                date: stage.date?.toDate()
              }
            }
            return stage
          })
        }
        this.currentInterview = interviewData
      }
      feedbackStore.isGlobalLoading = false
    },
    async addInterview(): Promise<void> {
      const db = getFirestore()
      await setDoc(
        doc(db, `users/${userIdFromStorage()}/interviews`, this.currentInterview.id),
        this.currentInterview
      )
    },
    async deleteInterview(id: string): Promise<void> {
      const feedbackStore = useFeedbackStore()
      const db = getFirestore()
      feedbackStore.isGlobalLoading = true
      await deleteDoc(doc(db, `users/${userIdFromStorage()}/interviews`, id))
      await this.getAllInterviews()
      feedbackStore.isGlobalLoading = false
    }
  }
})
