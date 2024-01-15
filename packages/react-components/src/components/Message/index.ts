import { Message, error, info, success } from './message'
import { attachPropertiesToComponent } from '@/utils/attach-properties-to-component'

export { MessageLevel } from './message'

export default attachPropertiesToComponent(Message, {
  success,
  info,
  error,
})
