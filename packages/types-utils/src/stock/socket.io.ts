import type { UserRole } from '@liutsing/enums'
import type { JwtPayload } from 'jsonwebtoken'
// socket.io推送相关

type Message =
  | {
      type: 'type1'
      payload: ''
    }
  | {
      type: ''
    }

export interface ClientToServerEvents {
  message: Message
}

export interface ServerToClientEvents {
  message: Message
}

export interface UserPayload extends JwtPayload {
  username: string
  role: UserRole
}
