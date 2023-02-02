import {getERC1155Instance, getERC721Instance, getRoyaltyFeeMangerInstance} from './contracts'
import {RoyaltyFeeManagerAddress} from './constants/addresses'

export const getRoyalty = async (contractType: string, address: string, chainId: number): Promise<number> => {
  try {
    if (contractType === 'ERC721') {
      const NFTContract = getERC721Instance(address, chainId, null)
      // const supportedERP2981 = await NFTContract.supportsInterface(ERC2189_INTERFACE_ID)
      // if(supportedERP2981){
      // 	const royalty = await NFTContract.royaltyInfo(1,100)
      // 	setRoyalty(parseInt(royalty[1])/100.0)
      // }
      // else{
      // 	const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
      // 	const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address,1,100)
      // 	setRoyalty(parseInt(royaltyInfo[1])/100.0)

      // }
      try {
        const royalty = await NFTContract.royaltyInfo(1, 100)
        return Number(royalty[1])
      } catch (error) {
        const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
        const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address, 1, 100)
        return Number(royaltyInfo[1])
      }
    } else if (contractType === 'ERC1155') {
      const NFTContract = getERC1155Instance(address, chainId, null)

      //const supportedERP2981 = await NFTContract.supportsInterface(ERC2189_INTERFACE_ID)
      // if(supportedERP2981){
      // 	const royalty = await NFTContract.royaltyInfo(1,100)
      // 	setRoyalty(parseInt(royalty[1])/100.0)
      // }
      // else{
      // 	const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
      // 	const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address,1,100)
      // 	setRoyalty(parseInt(royaltyInfo[1])/100.0)

      // }
      try {
        const royalty = await NFTContract.royaltyInfo(1, 100)
        return Number(royalty[1])
      } catch (error) {
        const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
        const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address, 1, 100)
        return Number(royaltyInfo[1])
      }
    } else {
      console.log('Invalid contract type')
    }
  } catch (error) {
    console.log(error)
  }
  return 0
}

export const getETHPrice = async (): Promise<number> => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
  const data = await response.json()
  return data.ethereum.usd
}
