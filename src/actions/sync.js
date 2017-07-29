import { syncAccounts } from '../util/storage/accounts'
import { syncTransactions } from '../util/storage/transactions'
import { updateAccountsList } from './accounts'
import { updateRecentTransactionsList } from './transactions'

export const SYNC_REQUEST = 'SYNC_REQUEST'
export const SYNC_SUCCESS = 'SYNC_SUCCESS'
export const SYNC_FAILURE = 'SYNC_FAILURE'
export function startSync() {
  return async dispatch => {
    dispatch({ type: SYNC_REQUEST })
    try {
      const accounts = await syncAccounts()
      const transactions = await syncTransactions()
      if (accounts) dispatch(updateAccountsList(accounts))
      if (transactions) dispatch(updateRecentTransactionsList(transactions))
      dispatch({ type: SYNC_SUCCESS })
    } catch (error) {
      dispatch({ type: SYNC_FAILURE })
    }
  }
}
