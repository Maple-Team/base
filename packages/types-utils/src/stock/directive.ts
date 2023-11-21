import type { UserInfo } from './user'
import type { DirectiveSet } from './directive-set'

export interface Directive {
  id: number
  name: string
  no: number
  delay: number
  cmd: string
  isHex: boolean
  directiveSet: DirectiveSet
}
/**
 * tcp发送的指令类型
 */
export type DirectiveCMD = Pick<Directive, 'cmd' | 'delay' | 'no' | 'isHex'> &
  Pick<DirectiveSet, 'isCycle'> &
  Pick<UserInfo, 'feature'>
