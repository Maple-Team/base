import { show } from './show'
import { Dialog } from './Dialog'
import { attachPropertiesToComponent } from '@/utils/attach-properties-to-component'

export type { DialogProps } from './Dialog'
export type { DialogShowProps } from './show'

export default attachPropertiesToComponent(Dialog, { show })
