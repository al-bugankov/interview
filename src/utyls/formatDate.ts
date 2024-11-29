import { Timestamp } from 'firebase/firestore'

export const formatDate = (date: Timestamp | Date | string): string => {

  if (date && typeof date !== 'string' && date instanceof Timestamp) {

    date = date.toDate()

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }
  return ''
}