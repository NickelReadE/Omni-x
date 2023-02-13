import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'
import {BridgeContext, UnwrapInfo} from '../../contexts/bridge'
import useWallet from '../../hooks/useWallet'
import {
  getERC1155Instance,
  getERC721Instance,
  getLayerZeroEndpointInstance,
  getOmnixBridge1155Instance,
  getOmnixBridgeInstance, getONFTCore721Instance, validateContract
} from '../../utils/contracts'
import {
  ERC1155_INTERFACE_ID,
  ERC721_INTERFACE_ID,
  getAddressByName,
  getLayerzeroChainId, ONFT1155_CORE_INTERFACE_ID,
  ONFT_CORE_INTERFACE_ID
} from '../../utils/constants'
import {NFTItem} from '../../interface/interface'
import useData from '../../hooks/useData'

type BridgeProviderProps = {
  children?: React.ReactNode
}

export const BridgeProvider = ({
  children,
}: BridgeProviderProps): JSX.Element => {
  const {
    provider,
    signer,
    address,
    chainId
  } = useWallet()
  const { userNfts: nfts } = useData()

  const [estimating, setEstimating] = useState(false)
  const [unwrapInfo, setUnwrapInfo] = useState<UnwrapInfo | undefined>()
  const [selectedUnwrapInfo, setSelectedUnwrapInfo] = useState<UnwrapInfo | undefined>()

  const estimateGasFee = async (selectedNFTItem: NFTItem, senderChainId: number, targetChainId: number) => {
    setEstimating(true)
    try {
      const lzEndpointInstance = getLayerZeroEndpointInstance(senderChainId, provider)
      const lzTargetChainId = getLayerzeroChainId(targetChainId)
      const _signerAddress = address

      if (selectedNFTItem.contract_type === 'ERC721') {
        const contractInstance = getOmnixBridgeInstance(senderChainId, signer)
        const erc721Instance = getERC721Instance(selectedNFTItem.collection_address, 0, signer)
        const noSignerOmniXInstance = getOmnixBridgeInstance(targetChainId, null)
        const dstAddress = await noSignerOmniXInstance.persistentAddresses(selectedNFTItem.collection_address)
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
          [selectedNFTItem.collection_address, _signerAddress, _name, _symbol, _tokenURI, selectedNFTItem.token_id]
        )
        const estimatedFee = await lzEndpointInstance.estimateFees(lzTargetChainId, contractInstance.address, _payload, false, adapterParams)
        return estimatedFee.nativeFee
      } else if (selectedNFTItem.contract_type === 'ERC1155') {
        const contractInstance = getOmnixBridge1155Instance(senderChainId, signer)
        const noSignerOmniX1155Instance = getOmnixBridge1155Instance(targetChainId, null)
        const erc1155Instance = getERC1155Instance(selectedNFTItem.collection_address, 0, signer)
        const dstAddress = await noSignerOmniX1155Instance.persistentAddresses(selectedNFTItem.collection_address)
        let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
        if (dstAddress !== ethers.constants.AddressZero) {
          adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
        }
        // Estimate fee from layerzero endpoint
        const _tokenURI = await erc1155Instance.uri(selectedNFTItem.token_id)
        const _payload = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'string', 'uint256', 'uint256'],
          [selectedNFTItem.collection_address, _signerAddress, _tokenURI, selectedNFTItem.token_id, selectedNFTItem.amount]
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

  const estimateGasFeeONFTCore = async (selectedNFTItem: NFTItem, senderChainId: number, targetChainId: number) => {
    try {
      const lzEndpointInstance = getLayerZeroEndpointInstance(senderChainId, signer)
      const lzTargetChainId = getLayerzeroChainId(targetChainId)
      const _signerAddress = address

      if (selectedNFTItem.contract_type === 'ERC721') {
        const onftCoreInstance = getONFTCore721Instance(selectedNFTItem.collection_address, 0, signer)
        console.log('---', lzTargetChainId, _signerAddress, selectedNFTItem.token_id, false, '0x', selectedNFTItem.collection_address)
        const estimatedFee = await onftCoreInstance.estimateSendFee(lzTargetChainId, _signerAddress, selectedNFTItem.token_id, false, '0x')
        return estimatedFee.nativeFee
      } else if (selectedNFTItem.contract_type === 'ERC1155') {
        const contractInstance = getOmnixBridge1155Instance(senderChainId, signer)
        const noSignerOmniX1155Instance = getOmnixBridge1155Instance(targetChainId, null)
        const erc1155Instance = getERC1155Instance(selectedNFTItem.collection_address, 0, signer)
        const dstAddress = await noSignerOmniX1155Instance.persistentAddresses(selectedNFTItem.collection_address)
        let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
        if (dstAddress !== ethers.constants.AddressZero) {
          adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
        }
        // Estimate fee from layerzero endpoint
        const _tokenURI = await erc1155Instance.uri(selectedNFTItem.token_id)
        const _payload = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'string', 'uint256', 'uint256'],
          [selectedNFTItem.collection_address, _signerAddress, _tokenURI, selectedNFTItem.token_id, selectedNFTItem.amount]
        )
        const estimatedFee = await lzEndpointInstance.estimateFees(lzTargetChainId, contractInstance.address, _payload, false, adapterParams)
        return estimatedFee.nativeFee
      }
    } catch (e) {
      console.error(e)
    }
  }

  const validateOwNFT = async (nft: NFTItem) => {
    if (!chainId) return false
    const nftChainId = nft.chain_id
    if (chainId !== nftChainId) return false

    try {
      if (nft.contract_type === 'ERC721') {
        if (!nft.name?.startsWith('Ow')) return false
        const ERC721Instance = getERC721Instance(nft.collection_address, chainId, null)
        const noSignerOmniXInstance = getOmnixBridgeInstance(chainId, null)
        const isERC721 = await ERC721Instance.supportsInterface(ERC721_INTERFACE_ID)
        if (isERC721) {
          const originAddress = await noSignerOmniXInstance.originAddresses(nft.collection_address)
          const originERC721Instance = getERC721Instance(originAddress, chainId, null)
          const owner = await originERC721Instance.ownerOf(nft.token_id)
          const bridgeAddress = getAddressByName('Omnix', chainId)
          if (owner === bridgeAddress) {
            setSelectedUnwrapInfo({
              type: 'ERC721',
              chainId: chainId,
              originAddress: originAddress,
              persistentAddress: nft.collection_address,
              amount: 1,
              tokenId: nft.token_id,
            })
            return true
          }
          return false
        }
        return false
      } else if (nft.contract_type === 'ERC1155') {
        const ERC1155Instance = getERC1155Instance(nft.collection_address, chainId, null)
        const noSignerOmniX1155Instance = getOmnixBridge1155Instance(chainId, null)
        const isERC1155 = await ERC1155Instance.supportsInterface(ERC1155_INTERFACE_ID)
        if (isERC1155) {
          const originAddress = await noSignerOmniX1155Instance.originAddresses(nft.collection_address)
          const originERC1155Instance = getERC1155Instance(originAddress, chainId, null)
          const bridgeAddress = getAddressByName('Omnix1155', chainId)
          const ownedCount = await originERC1155Instance.balanceOf(bridgeAddress, nft.token_id)
          if (ownedCount > 0) {
            setSelectedUnwrapInfo({
              type: 'ERC1155',
              chainId: chainId,
              originAddress: originAddress,
              persistentAddress: nft.collection_address,
              amount: ownedCount.toNumber(),
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

  const validateONFT = async (nft: NFTItem) => {
    const chainId = nft.chain_id
    try {
      if (nft.contract_type === 'ERC721') {
        const ERC721Instance = getERC721Instance(nft.collection_address, chainId, signer)
        const isERC721 = await ERC721Instance.supportsInterface(ERC721_INTERFACE_ID)
        const isONFTERC721 = await ERC721Instance.supportsInterface(ONFT_CORE_INTERFACE_ID)
        return !!(isERC721 && isONFTERC721)
      } else if (nft.contract_type === 'ERC1155') {
        const ERC1155Instance = getERC1155Instance(nft.collection_address, chainId, signer)
        const isERC1155 = await ERC1155Instance.supportsInterface(ERC1155_INTERFACE_ID)
        const isONFTERC1155 = await ERC1155Instance.supportsInterface(ONFT1155_CORE_INTERFACE_ID)
        return !!(isERC1155 && isONFTERC1155)
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  useEffect(() => {
    (async () => {
      const filteredNFT = nfts.filter((item: { chain_id: number }) => (item.chain_id === chainId))
      if (chainId && unwrapInfo === undefined) {
        let selectedItem = filteredNFT.filter((item: { name: string, contract_type: string }) => item.name?.startsWith('Ow') && item.contract_type === 'ERC721').length > 0 ? filteredNFT[0] : null
        if (selectedItem !== null) {
          const chainId = selectedItem.chain_id
          if (selectedItem.contract_type === 'ERC721') {
            const ERC721Instance = getERC721Instance(selectedItem.collection_address, chainId, null)
            const noSignerOmniXInstance = getOmnixBridgeInstance(chainId, null)
            const isERC721 = await ERC721Instance.supportsInterface(ERC721_INTERFACE_ID)
            if (isERC721) {
              const originAddress = await noSignerOmniXInstance.originAddresses(selectedItem.collection_address)
              const isValid = await validateContract(chainId, originAddress)
              if (isValid) {
                const originERC721Instance = getERC721Instance(originAddress, chainId, null)
                const owner = await originERC721Instance.ownerOf(selectedItem.token_id)
                const bridgeAddress = getAddressByName('Omnix', chainId)
                if (owner === bridgeAddress) {
                  return setUnwrapInfo({
                    type: 'ERC721',
                    chainId: chainId,
                    originAddress: originAddress,
                    persistentAddress: selectedItem.collection_address,
                    amount: 1,
                    tokenId: selectedItem.token_id,
                  })
                }
              }
            }
          }
        }
        const filteredERC1155 = filteredNFT.filter((item: { contract_type: string }) => item.contract_type === 'ERC1155')
        selectedItem = filteredERC1155.length > 0 ? filteredERC1155[0] : null
        if (selectedItem !== null && selectedItem.contract_type === 'ERC1155') {
          const chainId = selectedItem.chain_id
          const ERC1155Instance = getERC1155Instance(selectedItem.collection_address, chainId, null)
          const noSignerOmniX1155Instance = getOmnixBridge1155Instance(chainId, null)
          const isERC1155 = await ERC1155Instance.supportsInterface(ERC1155_INTERFACE_ID)
          if (isERC1155) {
            const originAddress = await noSignerOmniX1155Instance.originAddresses(selectedItem.collection_address)
            const isValid = await validateContract(chainId, originAddress)
            if (isValid) {
              const originERC1155Instance = getERC1155Instance(originAddress, chainId, null)
              const bridgeAddress = getAddressByName('Omnix1155', chainId)
              const ownedCount = await originERC1155Instance.balanceOf(bridgeAddress, selectedItem.token_id)
              if (ownedCount > 0) {
                setUnwrapInfo({
                  type: 'ERC1155',
                  chainId: chainId,
                  originAddress: originAddress,
                  persistentAddress: selectedItem.collection_address,
                  amount: ownedCount.toNumber(),
                  tokenId: selectedItem.token_id,
                })
              }
            }
          }
        }
      }
    })()
  }, [nfts, chainId, unwrapInfo])

  return (
    <BridgeContext.Provider
      value={{
        estimating,
        unwrapInfo,
        selectedUnwrapInfo,
        validateONFT,
        validateOwNFT,
        estimateGasFee,
        estimateGasFeeONFTCore,
      }}
    >
      {children}
    </BridgeContext.Provider>
  )
}
