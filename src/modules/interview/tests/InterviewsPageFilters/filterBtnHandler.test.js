import { mount } from '@vue/test-utils'
import InterviewsPageFilters from '@/modules/interview/components/InterviewsPageFilters.vue'
import { beforeAll, describe, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '@/main'

describe('InterviewsPageFilters', () => {
  let wrapper
  let pinia

  beforeAll(() => {
    initializeApp(firebaseConfig)
    pinia = createPinia()
    setActivePinia(pinia)
    wrapper = mount(InterviewsPageFilters, {
      global: {
        plugins: [pinia]
      }
    })
  })

  it('should call filterBtnHandler when button is clicked', async () => {
    const button = wrapper.find('#offer-button')

    expect(button.classes()).not.toContain('active')

    const filterBtnHandlerSpy = vi.spyOn(wrapper.vm, 'filterBtnHandler')

    button.trigger('click')

    await wrapper.vm.$nextTick()

    expect(filterBtnHandlerSpy).toHaveBeenCalledWith('Offer')

    expect(button.classes()).toContain('active')
  })
})
