import type { Directive } from './directive'
import type { Exhibits } from './exhibits'

export interface DirectiveSet {
  name: string
  exhibits: Exhibits
  id: number
  opacity: number
  isCycle: boolean
  directives: Directive[]
}
