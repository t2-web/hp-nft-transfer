import web3 from '~/plugins/web3'
import erc1155ContractAtifact from '../contracts/ERC1155.json'
import contractAtifact from '../contracts/NftTransfer.json'

export const erc1155Abi = erc1155ContractAtifact.abi

export const state = () => ({})
export const mutations = {}
export const actions = {
  async erc1155Info(context, params) {
    try {
      // console.log('Store erc1155Info: ', params)
      // Get contract install
      const contractInstance = new web3.eth.Contract(
        erc1155Abi,
        params.nftAddress,
      )

      return true
    } catch (e) {
      console.log('Store erc1155Info: ', e)
      this.$toast.error(
        'Error: Please check your blockchain net or smart contract address!',
      )
      return false
    }
  },
  async balanceOf(context, params) {
    try {
      // Get contract install
      const contractInstance = new web3.eth.Contract(
        erc1155Abi,
        params.nftAddress,
      )

      // console.log('Store erc1155OwnerOf: ', params)
      const ownerAddress = await contractInstance.methods
        .balanceOf(params.from, params.tokenId)
        .call()
      // console.log('Store ownerOf: ', ownerAddress)

      return ownerAddress
    } catch (error) {
      console.log('Store erc1155 balanceOf error: ', error)
      return ''
    }
  },
  async erc1155ApproveForAll(context, params) {
    try {
      const networkId = context.rootState.web3.web3.networkId
      // console.log('context: ', networkId)
      // console.log('nftSystemAddress: ', this.$config.nftSystemAddress)

      const operatorAddress =
        contractAtifact.addresses && contractAtifact.addresses[networkId]
          ? contractAtifact.addresses[networkId]
          : this.$config.nftSystemAddress

      // console.log(
      //   'Store erc1155ApproveForAll operatorAddress: ',
      //   operatorAddress,
      // )

      // Validate operatorAddress
      if (!operatorAddress) {
        this.$toast.error(
          'Error: NFT Transfer System contract address is missing!',
        )
        return
      }
      // Get contract install
      const contractInstance = new web3.eth.Contract(
        erc1155Abi,
        params.nftAddress,
      )

      // Check approval
      // console.log('Store getErc1155ApproveForAll: ', params)
      const isAlreadyApproved = await contractInstance.methods
        .isApprovedForAll(params.from, operatorAddress)
        .call()
      // console.log('Store isAlreadyApproved: ', isAlreadyApproved)

      if (isAlreadyApproved != params.setValue) {
        // Set approval
        const receipt = await contractInstance.methods
          .setApprovalForAll(operatorAddress, params.setValue)
          .send({ from: params.from })
        // console.log('Store receipt: ', receipt.transactionHash)
      }

      return params.setValue
    } catch (e) {
      console.log('Store erc1155ApproveForAll: ', e)
      this.$toast.error(
        'Error: Please check your blockchain net or smart contract address!',
      )
      return false
    }
  },
  async erc1155Approve(context, params) {
    // Get contract install
    const contractInstance = new web3.eth.Contract(
      erc1155Abi,
      params.nftAddress,
    )
    // console.log('Store erc1155Approve: ', params)

    // Check approval
    // console.log('Store getApproved: ', params)
    const approvedAddress = await contractInstance.methods
      .getApproved(params.tokenID)
      .call()
    // console.log('Store approvedAddress: ', approvedAddress)

    if (approvedAddress != operatorAddress) {
      // Set approval
      const receipt = await contractInstance.methods
        .approve(
          params.address ? params.address : contractAddress,
          params.tokenID,
        )
        .send({ from: params.from })

      return true
    }

    return false
  },
}

export const getters = {}
