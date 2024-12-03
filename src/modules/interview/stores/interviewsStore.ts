import { defineStore } from 'pinia'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
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
    interviewId: '',
    // было
    // currentInterview: {} as IInterview,

    //// разобрал этот объект на отдельные существующие поля
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
      this.interviewId = id
    },
    addStage() {
      //// было
      // if (this.currentInterview) {
      //// надо стараться выходить из функции как можно раньше, если интервью не существует то мы сразу выходим
      //   if (!this.currentInterview.stages) {
      //     this.currentInterview.stages = []
      //   }
      //   this.currentInterview.stages.push({ name: '', date: '', description: '' })
      // }

      if (!this.currentInterview) {
        return
      }

      //// здесь нам не нужно разбивать на 2 части (создать массив, добавить элемент), мы можем сразу добавить элемент в массив с помощью spread оператора
      this.currentInterview.stages = [
        ...this.currentInterview.stages,
        { name: '', date: '', description: '' }
      ]
    },
    removeStage(index: number) {
      //// было
      // if (this.currentInterview) {
      //   if (this.currentInterview.stages) {
      //     this.currentInterview.stages.splice(index, 1)
      //   }
      // }

      //// надо стараться выходить из функции как можно раньше, если интервью не существует то мы сразу выходим
      if (!this.currentInterview) {
        return
      }

      //// надо стараться выходить из функции как можно раньше, если стейджей 0 то мы сразу выходим
      if (this.currentInterview.stages.length === 0) {
        return
      }

      this.currentInterview.stages.splice(index, 1)

      //// можно переписать это через фильтр, но твой вариант тоже подходит
      //// this.currentInterview.stages.filter(stage, stageIndex) => stageIndex !== index)
    },
    //// это плохая практика, засовывать в стор работу с DOM элементами, лучше это делать в компоненте
    doActiveButton() {
      //// TODO название переменной не соответствует содержимому, лучше назвать ее allInterviewsFilterButton
      const activeButton = document.getElementById('all-button')
      if (activeButton) {
        activeButton.classList.add('active')
      }
    },
    async clearFilter() {
      this.setFilterResult('')

      //// плохая практика мешать логику. Из названия функции мы видим что она должна очистить фильтр, но внутри она еще и делает запрос на сервер и перекрашивает кнопку
      await this.getAllInterviews()
      this.doActiveButton()
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

        //// TODO я бы все таки назвал эту переменную userInterviewsRawData, так как это ещё сырые данные, которые ты потом обрабатываешь
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
    async updateInterview() {
      const db = getFirestore()
      //// TODO что означает эта переменная? Лучше назвать ее interviewDataBaseReference типа это ссылка на интервью в базе данных
      const docref = doc(db, `users/${userIdFromStorage()}/interviews`, this.interviewId)
      await updateDoc(docref, this.currentInterview)
    },
    async getInterview(): Promise<void> {
      const feedbackStore = useFeedbackStore()
      feedbackStore.isGlobalLoading = true
      const db = getFirestore()
      //// TODO аналогичный комментарий, что означает эта переменная? Лучше назвать ее interviewDataBaseReference типа это ссылка на интервью в базе данных
      const docref = doc(db, `users/${userIdFromStorage()}/interviews`, this.interviewId)
      //// TODO аналогичный комментарий, что означает эта переменная? Лучше назвать ее interviewDataBaseSnapshot типа это отпечаток=объект интервью в базе данных
      const docSnap = await getDoc(docref)

      if (docSnap.exists()) {
        //// TODO что означает эта data? Лучше назвать ее interviewData типа это объект интервью
        const data = docSnap.data() as IInterview
        if (data.stages && data.stages.length) {
          data.stages = data.stages.map((stage: IStage) => {
            if (stage.date && stage.date instanceof Timestamp) {
              return {
                ...stage,
                date: stage.date?.toDate()
              }
            }
            return stage
          })
        }
        this.currentInterview = data
      }
      feedbackStore.isGlobalLoading = false
    }
  }
})
