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
      const db = getFirestore();
      const docref = doc(db, `users/${userIdFromStorage()}/interviews`, this.interviewId);
      await updateDoc(docref, this.currentInterview);
    },
    async getInterview(): Promise<void> {
      const feedbackStore = useFeedbackStore()
      feedbackStore.isGlobalLoading = true;
      const db = getFirestore();
      const docref = doc(db, `users/${userIdFromStorage()}/interviews`, this.interviewId);
      const docSnap = await getDoc(docref);

      if (docSnap.exists()) {
        const data = docSnap.data() as IInterview;
        if (data.stages && data.stages.length) {
          data.stages = data.stages.map((stage: IStage) => {
            if (stage.date && stage.date instanceof Timestamp) {
              return {
                ...stage,
                date: stage.date?.toDate()
              };
            }
            return stage;
          });
        }
        this.currentInterview = data;
      }
      feedbackStore.isGlobalLoading = false;
    }
  }
})