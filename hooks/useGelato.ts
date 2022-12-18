import axios from 'axios'
import {BigNumberish, BytesLike, ethers} from 'ethers'
import {GelatoRelaySDK} from '@gelatonetwork/relay-sdk'

export interface SyncFeeRequest {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  feeToken: string;
}

export interface RelayResponse {
  taskId: string;
}

export enum RelayTaskStatus {
  Waiting = 'WaitingForConfirmation',
  Pending = 'ExecPending',
  Executed = 'ExecSuccess',
  Failed = 'Cancelled',
}

export type GelatoType = {
  buildRelayRequest: (contractAddr: string, chainId: number, dataSignature: string) => SyncFeeRequest,
  sendRelayRequest: (request: SyncFeeRequest) => Promise<RelayResponse>,
  waitForRelayTask: (response: RelayResponse) => Promise<RelayTaskStatus>
}

export type GaslessMintType = {
  gaslessMint: (contract: ethers.Contract, chainId: number, mintNum: number) => Promise<RelayResponse>,
  waitForRelayTask: (response: RelayResponse) => Promise<RelayTaskStatus>
}

export const useGelato = (): GelatoType => {
  const buildRelayRequest = (contractAddr: string, chainId: number, dataSignature: string): SyncFeeRequest => {
    const data = dataSignature
    const feeToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // pay Gelato in native token

    // populate the relay SDK request body
    return {
      chainId,
      target: contractAddr,
      data: data as BytesLike,
      feeToken: feeToken,
    } as SyncFeeRequest
  }

  const sendRelayRequest = async (request: SyncFeeRequest): Promise<RelayResponse> => {
    return await GelatoRelaySDK.relayWithSyncFee(request)
  }

  const waitForRelayTask = async (relayResponse: RelayResponse): Promise<RelayTaskStatus> => {
    const relayTaskUrl = `https://relay.gelato.digital/tasks/status/${relayResponse.taskId}`
    const fetchTaskState = async() => {
      return new Promise<RelayTaskStatus>((res, rej) => {
        setTimeout(() => {
          axios.get(relayTaskUrl)
            .then((data: any) => {
              console.log(data.data)
              res(data.data.task.taskState as RelayTaskStatus)
            })
            .catch(e => rej(e))
        }, 10000)
      })
    }

    console.log('waiting relay task: ', relayTaskUrl)
    for (;;) {
      const taskState = await fetchTaskState()
      if (taskState == RelayTaskStatus.Executed || taskState == RelayTaskStatus.Failed) return taskState
      console.log('task state: ', taskState)
    }
  }

  return {
    buildRelayRequest,
    sendRelayRequest,
    waitForRelayTask
  }
}

export const useGaslessMint = () => {
  const { buildRelayRequest, sendRelayRequest, waitForRelayTask } = useGelato()

  const gaslessMint = async (contract: ethers.Contract, chainId: number, mintNum: number, minter: string): Promise<RelayResponse> => {
    const { data } = await contract.populateTransaction.publicMintGasless(mintNum, minter)

    if (!data) throw new Error('useGaslessMint: Unable to encode gaslessMint function data')

    const request = buildRelayRequest(contract.address, chainId, data)
    return sendRelayRequest(request)
  }

  return {
    gaslessMint,
    waitForRelayTask
  }
}
