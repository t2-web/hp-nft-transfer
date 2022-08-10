export const validAddress = (ethereumAddress) => {
  var regex = /^0x[a-fA-F0-9]{40}$/g

  return regex.test(ethereumAddress)
}

export const duplicateCheck = (inArrayString, targetString) => {
  // console.log('inArrayString: ', inArrayString)
  // console.log('targetString: ', targetString)

  return inArrayString.includes(targetString)
}

export const shortenString = (targetString) => {
  return `${targetString.substring(0, 12)}...${targetString.substring(
    targetString.length - 10,
  )}`
}

export const csvTextToJsonObject = async (inputString) => {
  const lines = inputString.split('\n')
  const header = ['address', 'id']
  const output = lines.map((line) => {
    const fields = line.split(',')
    return Object.fromEntries(
      header.map((h, i) => [h, fields[i].split(' ').join('')]),
    )
  })
  return output
}

export const csvTextToList = async (inputString, index, isNumber = false) => {
  const lines = inputString.split('\n')
  const output = lines.map((line) => {
    const fields = line.split(',')
    return isNumber ? Number.parseInt(fields[index]) : fields[index]
  })
  return output
}
