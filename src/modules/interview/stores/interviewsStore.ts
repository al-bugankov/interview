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
          where('result', '==', this.selectedFilterResult) // Проверить, соответствует ли значение фильтру
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

  // const formatDate = (date: Date): string => {
  //   const day = String(date.getDate()).padStart(2, '0')
  //   const month = String(date.getMonth() + 1).padStart(2, '0')
  //   const year = date.getFullYear()
  //   return `${day}.${month}.${year}`
  // }
})
