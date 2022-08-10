import web3 from '~/plugins/web3'
import contractAtifact from '../contracts/NftTransfer.json'

const contractABI = contractAtifact.abi

export const state = () => ({})

export const mutations = {}

export const actions = {
  async transferNFTToReceivers(context, params) {
    try {
      // console.log('transferToMultiSender: ', params)
      const networkId = context.rootState.web3.web3.networkId
      // console.log('context: ', networkId)
      // console.log('nftSystemAddress: ', this.$config.nftSystemAddress)

      const contractAddress =
        contractAtifact.addresses && contractAtifact.addresses[networkId]
          ? contractAtifact.addresses[networkId]
          : this.$config.nftSystemAddress

      // console.log('contractAddress: ', contractAddress)

      const contractInstance = new web3.eth.Contract(
        contractABI,
        contractAddress,
      )

      let receipt

      if (!contractInstance) {
        return { isTransferred: false, hash: '' }
      }
      // console.log('params.tokenAddress: ', params.tokenAddress)
      // console.log('params.recipientsAddresses: ', params.recipientsAddresses)
      // console.log('params.tokenIds: ', params.tokenIds)

      if (params.NFTType) {
        receipt = await contractInstance.methods
          .transferERC721(
            params.tokenAddress,
            params.recipientsAddresses,
            params.tokenIds,
          )
          .send({ from: params.from })
      } else {
        // console.log('params.amounts: ', params.amounts)
        receipt = await contractInstance.methods
          .transferERC1155(
            params.tokenAddress,
            params.recipientsAddresses,
            params.tokenIds,
            params.amounts,
          )
          .send({ from: params.from })
      }

      return receipt
    } catch (err) {
      console.log('Store transferNFTToReceivers error: ', err)
      return { isTransferred: false, hash: '' }
    }
  },
}

export const getters = {}
