import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useInterviewStore } from '@/stores/interviewsStore';
import type { IInterview } from '@/interfaces';

export const useInterviewFilterStore = defineStore('interviewFilter', () => {
  const interviewStore = useInterviewStore(); // Подключаем основной стор
  const isLoading = ref<boolean>(false);
  const interviews = ref<IInterview[]>([]);

  const submitFilter = async (filterValue: string): Promise<void> => {
    console.log('Setting filter value to:', filterValue);

    // Устанавливаем значение фильтра
    await interviewStore.setFilterResult(filterValue);

    // Убедитесь, что фильтр был установлен
    if (interviewStore.selectedFilterResult.value) {
      console.log('Filter value is set:', interviewStore.selectedFilterResult.value);

      // Выполняем запрос с фильтром
      isLoading.value = true;
      interviews.value = await interviewStore.getAllInterviews<IInterview>(true);
      console.log('Filtered interviews:', interviews.value);
    } else {
      console.error('Filter value is not set!');
    }

    isLoading.value = false;
  };

  const clearFilter = async (): Promise<void> => {
    console.log('Clearing filter');
    isLoading.value = true;
    interviewStore.selectedFilterResult.value = ''; // Сбрасываем значение
    interviews.value = await interviewStore.getAllInterviews<IInterview>();
    isLoading.value = false;
  };

  return {
    interviews,
    isLoading,
    submitFilter,
    clearFilter,
  };
});