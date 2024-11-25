import type { RouteLocationRaw } from 'vue-router'
import type { ComputedRef } from 'vue'

export interface INavigationItem {
  label: string
  icon: string
  path: RouteLocationRaw
  show: ComputedRef<boolean>
}
