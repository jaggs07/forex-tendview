import fetch from 'node-fetch'
import { sortBy } from 'lodash'
import { BASE_URL } from './config'

export async function getPreviousCryptoData () {
  return fetch(`${BASE_URL}/crypto/previous`)
    .then(res => res.json())
    .then(body => {
      const previousTricks = body.ticks
      const sortedPreviousTicks = sortBy(previousTricks, 't')
      return sortedPreviousTicks
    })
}
