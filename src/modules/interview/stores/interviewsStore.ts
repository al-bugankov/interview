import { defineStore } from 'pinia'
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'
import type { IInterviewsStoreState } from '@/modules/interview/types/IInterviewsStoreState'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'

export const useInterviewStore = defineStore('interviewsStore', {
  state: (): IInterviewsStoreState => ({
    interviews: [],
    selectedFilterResult: ''
  }),
  getters: {},
  actions: {
    setFilterResult(filterValue: string) {
      this.selectedFilterResult = filterValue
    },
    async getAllInterviews(isFilter: boolean = false) {
      const feedbackStore = useFeedbackStore()
      const db = getFirestore()

      try {
        const userInterviewsRawData = () => {
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

        const userInterviews = await getDocs(userInterviewsRawData())
        this.interviews = userInterviews.docs.map((doc) => {
          return doc.data() as IInterview
        })
      } catch (error: unknown) {
        if (error instanceof Error) {
          feedbackStore.showToast({ type: 'error', title: 'Error', message: error.message })
        }
      }
    }
  }
})
