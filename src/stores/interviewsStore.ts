import { defineStore } from "pinia";
import { ref } from "vue";
import { getFirestore, collection, query, orderBy, where, getDocs, Timestamp } from "firebase/firestore";
import { useUserStore } from "@/stores/user"; // Импорт стора для user
import type { IInterview } from '@/interfaces'; // Тип для интервью

export const useInterviewStore = defineStore('interviewsStore', () => {
  const userStore = useUserStore();
  const db = getFirestore();  // Инициализация Firestore
  const interviews = ref<IInterview[]>([]);
  const isLoading = ref(false);
  const selectedFilterResult = ref(''); // Реактивное состояние фильтра

  const setFilterResult = (filterValue: string) => {
    selectedFilterResult.value = filterValue;
    console.log('Filter result set to:', filterValue);
  };

  // Функция для получения интервью с фильтрами
  const getAllInterviews = async (isFilter: boolean = false) => {
    let getData;

    if (isFilter) {
      console.log('Applying filter with value:', selectedFilterResult.value);
      getData = query(
        collection(db, `users/${userStore.userId}/interviews`),
        orderBy('createdAt', 'desc'),
        where('result', '==', selectedFilterResult.value) // Проверить, соответствует ли значение фильтру
      );
    } else {
      console.log('Fetching all interviews without filter');
      getData = query(
        collection(db, `users/${userStore.userId}/interviews`),
        orderBy('createdAt', 'desc')
      );
    }

    const listDocs = await getDocs(getData);
    interviews.value = listDocs.docs.map((doc) => {
      return doc.data() as IInterview;
    });
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Экспортируем состояние и функцию
  return {
    interviews,
    isLoading,
    selectedFilterResult, // Делаем реактивное состояние доступным для других сторов
    setFilterResult,
    getAllInterviews,
  };
});