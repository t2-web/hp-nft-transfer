import web3 from '~/plugins/web3'
import erc721ContractAtifact from '../contracts/Erc721.json'
import contractAtifact from '../contracts/NftTransfer.json'

export const erc721Abi = erc721ContractAtifact.abi

export const state = () => ({})
export const mutations = {}
export const actions = {
  async erc721Info(context, params) {
    try {
      // console.log('Store erc721Info: ', params)
      // Get contract install
      const contractInstance = new web3.eth.Contract(
        erc721Abi,
        params.nftAddress,
      )

      // Check approval
      const balance = await contractInstance.methods
        .balanceOf(params.from)
        .call()
      // console.log('Store erc721Info balance: ', balance)

      const name = await contractInstance.methods.name().call()
      // console.log('Store erc721Info balance: ', name)

      return {
        balance,
        name,
      }
    } catch (e) {
      console.log('Store erc721Info: ', e)
      this.$toast.error(
        'Error: Please check your blockchain net or smart contract address!',
      )
      return false
    }
  },
  async ownerOf(context, params) {
    try {
      // Get contract install
      const contractInstance = new web3.eth.Contract(
        erc721Abi,
        params.nftAddress,
      )

      // console.log('Store erc721OwnerOf: ', params)
      const ownerAddress = await contractInstance.methods
        .ownerOf(params.tokenId)
        .call()
      // console.log('Store ownerOf: ', ownerAddress)

      return ownerAddress
    } catch (error) {
      console.log('Store ownerOf error: ', error)
      return ''
    }
  },
  async erc721ApproveForAll(context, params) {
    try {
      const networkId = context.rootState.web3.web3.networkId
      // console.log('context: ', networkId)
      // console.log('nftSystemAddress: ', this.$config.nftSystemAddress)

      const operatorAddress =
        contractAtifact.addresses && contractAtifact.addresses[networkId]
          ? contractAtifact.addresses[networkId]
          : this.$config.nftSystemAddress

      // console.log(
      //   'Store erc721ApproveForAll operatorAddress: ',
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
        erc721Abi,
        params.nftAddress,
      )

      // Check approval
      // console.log('Store getErc721ApproveForAll: ', params)
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
      console.log('Store getErc721ApproveForAll: ', e)
      this.$toast.error(
        'Error: Please check your blockchain net or smart contract address!',
      )
      return false
    }
  },
  async erc721Approve(context, params) {
    // Get contract install
    const contractInstance = new web3.eth.Contract(erc721Abi, params.nftAddress)
    // console.log('Store erc721Approve: ', params)

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
