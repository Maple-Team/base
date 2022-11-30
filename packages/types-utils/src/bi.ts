export interface BiliPlaylistResponse {
  media_list: Medialist[]
  has_more: boolean
  total_count: number
}

interface Medialist {
  id: number
  offset: number
  index: number
  intro: string
  attr: number
  tid: number
  copy_right: number
  cnt_info: Cntinfo
  cover: string
  duration: number
  pubtime: number
  like_state: number
  fav_state: number
  page: number
  pages: Page[]
  title: string
  type: number
  upper: Upper
  link: string
  bv_id: string
  short_link: string
  rights: Rights
  coin: Coin
}

interface Coin {
  max_num: number
  coin_number: number
}

interface Rights {
  bp: number
  elec: number
  download: number
  movie: number
  pay: number
  ugc_pay: number
  hd5: number
  no_reprint: number
  autoplay: number
  no_background: number
}

interface Upper {
  mid: number
  name: string
  face: string
  followed: number
  fans: number
  vip_type: number
  vip_statue: number
  vip_due_date: number
  vip_pay_type: number
  official_role: number
  official_title: string
  official_desc: string
  display_name: string
}

interface Page {
  id: number
  title: string
  intro: string
  duration: number
  link: string
  page: number
  metas: Meta[]
  from: string
  dimension: Dimension
}

interface Dimension {
  width: number
  height: number
  rotate: number
}

interface Meta {
  quality: number
  size: number
}

interface Cntinfo {
  collect: number
  play: number
  thumb_up: number
  thumb_down: number
  share: number
  reply: number
  danmaku: number
  coin: number
}
