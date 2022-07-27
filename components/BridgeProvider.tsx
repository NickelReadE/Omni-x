import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'
import {BridgeContext, UnwrapInfo} from '../contexts/bridge'
import useWallet from '../hooks/useWallet'
import {
  getERC1155Instance,
  getERC721Instance,
  getLayerZeroEndpointInstance,
  getOmnixBridge1155Instance,
  getOmnixBridgeInstance, validateContract
} from '../utils/contracts'
import {getAddressByName, getChainIdFromName, getLayerzeroChainId} from '../utils/constants'
import {NFTItem} from '../interface/interface'
import {useDispatch, useSelector} from 'react-redux'
import {getUserNFTs, selectUserNFTs} from '../redux/reducers/userReducer'

type BridgeProviderProps = {
  children?: React.ReactNode
}

export const BridgeProvider = ({
  children,
}: BridgeProviderProps): JSX.Element => {
  const {
    provider,
    signer,
    address
  } = useWallet()

  const [estimating, setEstimating] = useState(false)
  const [unwrapInfo, setUnwrapInfo] = useState<UnwrapInfo | undefined>()
  const [selectedUnwrapInfo, setSelectedUnwrapInfo] = useState<UnwrapInfo | undefined>()

  const dispatch = useDispatch()
  const nfts = useSelector(selectUserNFTs)

  useEffect(() => {
    if (address) {
      dispatch(getUserNFTs(address) as any)
    }
  }, [address, dispatch])

  const estimateGasFee = async (selectedNFTItem: NFTItem, senderChainId: number, targetChainId: number) => {
    setEstimating(true)
    try {
      const lzEndpointInstance = getLayerZeroEndpointInstance(senderChainId, provider)
      const lzTargetChainId = getLayerzeroChainId(targetChainId)
      const _signerAddress = await signer?.getAddress()

      if (selectedNFTItem.contract_type === 'ERC721') {
        const contractInstance = getOmnixBridgeInstance(senderChainId, signer)
        const erc721Instance = getERC721Instance(selectedNFTItem.token_address, 0, signer)
        const noSignerOmniXInstance = getOmnixBridgeInstance(targetChainId, null)
        const dstAddress = await noSignerOmniXInstance.persistentAddresses(selectedNFTItem.token_address)
        let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
        if (dstAddress !== ethers.constants.AddressZero) {
          adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
        }
        // Estimate fee from layerzero endpoint
        const _name = await erc721Instance.name()
        const _symbol = await erc721Instance.symbol()
        const _tokenURI = await erc721Instance.tokenURI(selectedNFTItem.token_id)
        const _payload = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'string', 'string', 'string', 'uint256'],
          [selectedNFTItem.token_address, _signerAddress, _name, _symbol, _tokenURI, selectedNFTItem.token_id]
        )
        const estimatedFee = await lzEndpointInstance.estimateFees(lzTargetChainId, contractInstance.address, _payload, false, adapterParams)
        return estimatedFee.nativeFee
      } else if (selectedNFTItem.contract_type === 'ERC1155') {
        const contractInstance = getOmnixBridge1155Instance(senderChainId, signer)
        const noSignerOmniX1155Instance = getOmnixBridge1155Instance(targetChainId, null)
        const erc1155Instance = getERC1155Instance(selectedNFTItem.token_address, signer)
        const dstAddress = await noSignerOmniX1155Instance.persistentAddresses(selectedNFTItem.token_address)
        let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
        if (dstAddress !== ethers.constants.AddressZero) {
          adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
        }
        // Estimate fee from layerzero endpoint
        const _tokenURI = await erc1155Instance.uri(selectedNFTItem.token_id)
        const _payload = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'string', 'uint256', 'uint256'],
          [selectedNFTItem.token_address, _signerAddress, _tokenURI, selectedNFTItem.token_id, selectedNFTItem.amount]
        )
        const estimatedFee = await lzEndpointInstance.estimateFees(lzTargetChainId, contractInstance.address, _payload, false, adapterParams)
        return estimatedFee.nativeFee
      }
    } catch (e) {
      console.error(e)
    } finally {
      setEstimating(false)
    }
  }

  const validateONFT = async (nft: NFTItem) => {
    const chainId = getChainIdFromName(nft.chain)
    if (!nft.name?.startsWith('Ow')) return false
    try {
      if (nft.contract_type === 'ERC721') {
        const ERC721Instance = getERC721Instance(nft.token_address, chainId, null)
        const noSignerOmniXInstance = getOmnixBridgeInstance(chainId, null)
        const isERC721 = await ERC721Instance.supportsInterface('0x80ac58cd')
        if (isERC721) {
          const originAddress = await noSignerOmniXInstance.originAddresses(nft.token_address)
          const originERC721Instance = getERC721Instance(originAddress, chainId, null)
          const owner = await originERC721Instance.ownerOf(nft.token_id)
          const bridgeAddress = getAddressByName('Omnix', chainId)
          if (owner === bridgeAddress) {
            setSelectedUnwrapInfo({
              type: 'ERC721',
              chainId: chainId,
              originAddress: originAddress,
              persistentAddress: nft.token_address,
              tokenId: nft.token_id,
            })
            return true
          }
          return false
        }
        return false
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  useEffect(() => {
    (async () => {
      const filteredNFT = nfts.filter((item: { name: string, chain: string }) => (item.name?.startsWith('Ow') && getChainIdFromName(item.chain) === provider?._network?.chainId))
      const selectedItem = filteredNFT.length > 0 ? filteredNFT[0] : null
      if (selectedItem !== null && provider?._network?.chainId && unwrapInfo === undefined) {
        const chainId = getChainIdFromName(selectedItem.chain)
        if (selectedItem.contract_type === 'ERC721') {
          const ERC721Instance = getERC721Instance(selectedItem.token_address, chainId, null)
          const noSignerOmniXInstance = getOmnixBridgeInstance(chainId, null)
          const isERC721 = await ERC721Instance.supportsInterface('0x80ac58cd')
          if (isERC721) {
            const originAddress = await noSignerOmniXInstance.originAddresses(selectedItem.token_address)
            const isValid = await validateContract(provider?._network?.chainId, originAddress)
            if (isValid) {
              const originERC721Instance = getERC721Instance(originAddress, chainId, null)
              const owner = await originERC721Instance.ownerOf(selectedItem.token_id)
              const bridgeAddress = getAddressByName('Omnix', chainId)
              if (owner === bridgeAddress) {
                setUnwrapInfo({
                  type: 'ERC721',
                  chainId: chainId,
                  originAddress: originAddress,
                  persistentAddress: selectedItem.token_address,
                  tokenId: selectedItem.token_id,
                })
              }
            }
          }
        }
      }
    })()
  }, [nfts, provider?._network?.chainId])

  return (
    <BridgeContext.Provider
      value={{
        estimating,
        unwrapInfo,
        selectedUnwrapInfo,
        validateONFT,
        estimateGasFee
      }}
    >
      {children}
    </BridgeContext.Provider>
  )
}
