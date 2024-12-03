<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useInterviewStore } from '@/modules/interview/stores/interviewsStore'
import type { IInterview } from '@/modules/interview/types/IInterview'

const interviewsStore = useInterviewStore()
const chartData = ref()
const chartOptions = ref<null | object>(null)

onMounted(async () => {
  await interviewsStore.getAllInterviews()
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body)

  const data: number[] = [0, 0, 0]
  interviewsStore.interviews.forEach((interview: IInterview) => {
    if (interview.result === 'Offer') {
      data[0]++
    } else if (interview.result === 'Refusal') {
      data[1]++
    } else {
      data[2]++
    }
  })

  return {
    labels: ['Оффер', 'Отказ', 'В процессе'],
    datasets: [
      {
        data,
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-gray-500')
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-gray-400')
        ]
      }
    ]
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor
        }
      }
    }
  }
}
</script>

<template>
  <h1>Статистика</h1>
  <div class="card flex justify-center">
    <app-chart
      :data="chartData"
      :options="chartOptions"
      class="w-30rem md:w-[30rem]"
      type="doughnut"
    />
  </div>
</template>
