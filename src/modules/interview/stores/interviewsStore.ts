import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  getDoc,
  Timestamp,
} from 'firebase/firestore'
import { userIdFromStorage } from '@/modules/auth/composables/userIdFromStorage'
import { useFeedbackStore } from '@/modules/feedback/stores/feedbackStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { doc, updateDoc } from 'firebase/firestore'

import type { IInterview, IStage } from '@/interfaces'
import type { IInterviewsStoreState } from '@/modules/interview/types/IInterviewsStoreState'

export const useInterviewStore = defineStore('interviewsStore', {

  state: (): IInterviewsStoreState => ({
    interviews: [],
    selectedFilterResult: '',
    interviewId: '',
    currentInterview: {} as IInterview,
  }),
  getters: {},
  actions: {
    setFilterResult(filterValue: string) {
      this.selectedFilterResult = filterValue;
    },
    setInterviewId(id: string) {
      this.interviewId = id;
    },
    addStage() {
      if (this.currentInterview) {
        if (!this.currentInterview.stages) {
          this.currentInterview.stages = []
        }
        this.currentInterview.stages.push({ name: '', date: '', description: '' })
      }
    },
    removeStage(index: number) {
      if (this.currentInterview) {
        if (this.currentInterview.stages) {
          this.currentInterview.stages.splice(index, 1)
        }
      }
    },
    doActiveButton() {
      const activeButton = document.getElementById('all-button');
      if (activeButton) {
        activeButton.classList.add('active');
      }
    },
    async clearFilter() {
      this.setFilterResult('')
      await this.getAllInterviews()
      this.doActiveButton()
    },
    async getAllInterviews(isFilter: boolean = false) {
      const feedbackStore = useFeedbackStore();
      const db = getFirestore();

      try {
        const userInterviewsRawData = () => {
          if (isFilter) {
            return query(
              collection(db, `users/${userIdFromStorage()}/interviews`),
              orderBy('createdAt', 'desc'),
              where('result', '==', this.selectedFilterResult)
            );
          }

          return query(
            collection(db, `users/${userIdFromStorage()}/interviews`),
            orderBy('createdAt', 'desc')
          );
        };

        const userInterviews = await getDocs(userInterviewsRawData());
        this.interviews = userInterviews.docs.map((doc) => {
          return doc.data() as IInterview;
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          feedbackStore.showToast({ type: 'error', title: 'Error', message: error.message });
        }
      }
    },
    async updateInterview() {
      const userStore = useAuthStore();
      const db = getFirestore();
      const docref = doc(db, `users/${userStore.userId}/interviews`, this.interviewId);
      await updateDoc(docref, this.currentInterview);
    },
    async getInterview(): Promise<void> {
      const feedbackStore = useFeedbackStore()
      console.log('Начало загрузки данных собеседования');

      feedbackStore.isGlobalLoading = true;

      const userStore = useAuthStore();
      const db = getFirestore();
      const docref = doc(db, `users/${userStore.userId}/interviews`, this.interviewId);

      // Логирование перед запросом
      console.log('Запрос данных из документа:', docref.path);

      const docSnap = await getDoc(docref);

      // Логирование получения данных
      console.log('Ответ от Firestore существует?', docSnap.exists());

      if (docSnap.exists()) {
        const data = docSnap.data() as IInterview;

        // Логирование полученных данных
        console.log('Данные собеседования:', data);

        if (data.stages && data.stages.length) {
          // Логирование этапов до их обработки
          console.log('Этапы до обработки:', data.stages);

          data.stages = data.stages.map((stage: IStage) => {
            if (stage.date && stage.date instanceof Timestamp) {
              // Логирование преобразования даты
              console.log('Преобразование даты для этапа:', stage);
              return {
                ...stage,
                date: stage.date?.toDate()
              };
            }
            return stage;
          });

          // Логирование этапов после обработки
          console.log('Этапы после обработки:', data.stages);
        }

        this.currentInterview = data;

        // Логирование успешного завершения загрузки
        console.log('Данные собеседования успешно загружены');
      }

      feedbackStore.isGlobalLoading = false;

      // Логирование завершения загрузки
      console.log('Загрузка данных завершена');
    }
  }
})