import { defineStore } from 'pinia'
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { doc, updateDoc } from 'firebase/firestore'

import type { IInterview } from '@/interfaces'
import type { IInterviewsStoreState } from '@/modules/interview/types/IInterviewsStoreState'

export const useInterviewStore = defineStore('interviewsStore', {
  state: (): IInterviewsStoreState => ({
    interviews: [],
    selectedFilterResult: '',
    interviewId: '',
  }),
  getters: {},
  actions: {

    setFilterResult(filterValue: string) {
      this.selectedFilterResult = filterValue
    },
    setInterviewId(id: string) {
      this.interviewId = id;
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
    },
    async updateInterview(interviewData) {
      const db = getFirestore()
      const userStore = useAuthStore()
      const docref = doc(db, `users/${userStore.userId}/interviews`, this.interviewId)
      await updateDoc(docref, interviewData)
    },
  }
})
