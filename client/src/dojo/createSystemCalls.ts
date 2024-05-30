import { AccountInterface } from 'starknet'
import { Entity, getComponentValue } from '@dojoengine/recs'
import { uuid } from '@latticexyz/utils'
import { ClientComponents } from './createClientComponents'
import {
  getEntityIdFromKeys,
  getEvents,
  setComponentsFromEvents,
} from '@dojoengine/utils'
import { ContractComponents } from './generated/contractComponents'
import type { IWorld } from './generated/generated'

export type SystemCalls = ReturnType<typeof createSystemCalls>

export function createSystemCalls(
  { client }: { client: IWorld },
  contractComponents: ContractComponents,
  {
    Game,
    GameTurn,
    GameId,
    MancalaGame,
    Moves,
    GamePlayer,
    Player,
    Seed,
  }: ClientComponents,
) {
  const create_initial_game_id = async (account: AccountInterface) => {
    const movesId = uuid()

    try {
      const { transaction_hash } = await client.actions.create_initial_game_id(
        account,
      )

      console.log(
        await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        }),
      )

      setComponentsFromEvents(
        contractComponents,
        getEvents(
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
          }),
        ),
      )
    } catch (e) {
      console.log(e)
      GameId.removeOverride(movesId)
    } finally {
      GameId.removeOverride(movesId)
    }
  }

  return {
    create_initial_game_id,
  }
}
