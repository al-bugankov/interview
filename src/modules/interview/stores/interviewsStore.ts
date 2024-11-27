import { defineStore } from 'pinia'
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'
import type { IInterviewsStoreState } from '@/modules/interview/types/IInterviewsStoreState'

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
      const db = getFirestore()
      let getData
      if (isFilter) {
        getData = query(
          collection(db, `users/${userIdFromStorage()}/interviews`),
          orderBy('createdAt', 'desc'),
          where('result', '==', this.selectedFilterResult)
        )
      } else {
        getData = query(
          collection(db, `users/${userIdFromStorage()}/interviews`),
          orderBy('createdAt', 'desc')
        )
      }
      const listDocs = await getDocs(getData)
      this.interviews = listDocs.docs.map((doc) => {
        return doc.data() as IInterview
      })
    }
  }
})
