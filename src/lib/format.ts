const TH_MONTHS = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
]

/** วันที่ไทย พ.ศ. เช่น 5 ก.ค. 69 */
export function formatDateTh(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const mon = TH_MONTHS[d.getMonth()]
  const yearBE = (d.getFullYear() + 543) % 100
  return `${day} ${mon} ${yearBE}`
}

export function formatTimeTh(iso: string): string {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm} น.`
}

export function formatDateTimeTh(iso: string): string {
  return `${formatDateTh(iso)} · ${formatTimeTh(iso)}`
}

export function formatNumber(n: number): string {
  return n.toLocaleString('th-TH')
}

export function fullName(s: {
  title: string
  firstName: string
  lastName: string
}): string {
  return `${s.title}${s.firstName} ${s.lastName}`
}

export function initials(s: { firstName: string; lastName: string }): string {
  return `${s.firstName.charAt(0)}${s.lastName.charAt(0)}`
}
