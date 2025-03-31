import OpenAI from 'openai'
import Web3 from 'web3'
import ERC20ABI from '../../app/abi/erc20.json'
import { ethers } from 'ethers'

// export const config = {
//   maxDuration: 60, // 5 seconds
// };
export const maxDuration = 60 // This function can run for a maximum of 5 seconds

const openai = new OpenAI({
  dangerouslyAllowBrowser: false,
  apiKey: process.env.OPENAI_API_KEY,
})

const airdropContractAddress = '0x69a7373E94fE85256f104Bf327b6D3d9ca81c08E'

let messages = [
  {
    role: 'system',
    content: `You're on Linea Sepolia TESTNET. After the hackathon Amir will deploy Nea on mainnet.`,
  },
  {
    role: 'system',
    content: `Your wallet address is 0x0fda0a5832F910473E1E2f4e39391fD91B132D2E`,
  },
  {
    role: 'system',
    content: `Token CROAK on Linea explorer https://lineascan.build/token/0xaCb54d07cA167934F57F829BeE2cC665e1A5ebEF`,
  },
  {
    role: 'system',
    content: `Make the all links bold`,
  },
   {
    role: 'system',
    content: `Amir built you for Linea Dev Cook-Off Feb-March.`,
  },
  {
    role: 'system',
    content: `Your name is Nea and you can create  ERC20 token and deploy it on Linea blockchain. In order to 
    create ERC20 tokens you need to ask for token Name, Symbol, Initial Supply and wallet address to transfer ownership of deployed token. 
    After deploying the token provideo the all links about the token/ contract.`,
  },
  {
    role: 'system',
    content: `
    Amir contact information:
    fullname: Amir Rahimi
    birthday: 1994-07-18
    geneder: male
    email: atenyun@gmail.com
    telegram id: @atenyun
    twitter: @atenyun
    generate a link for my telegram & twitter id
    `,
  },
  {
    role: 'system',
    content: `In order to read users wallet address ask them to connect their wallet to the DApp.`,
  },

  {
    role: 'system',
    content: `Link to the all transactions hash https://sepolia.lineascan.build/tx/[TX]`,
  },
  {
    role: 'system',
    content: `Link to contract on the explorer https://sepolia.lineascan.build/address/[CONTRACT_ADDRESS]`,
  },
]

let tools = [
  {
    type: 'function',
    function: {
      name: 'create_token',
      description: `Create LSP7 token on LUKSO`,
      parameters: {
        type: 'object',
        properties: {
          wallet: {
            type: 'string',
            description: `Wallet address to transfer ownership of the deployed token.`,
          },
          name: {
            type: 'string',
            description: `Token name`,
          },
          symbol: {
            type: 'string',
            description: `Token symbol`,
          },
          supply: {
            type: 'number',
            description: `Initial supply`,
          },
        },
        required: ['wallet', 'name', 'symbol', 'supply'],
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_total_holder',
      description: 'Count of token holders. Total holders of a token',
      parameters: {
        type: 'object',
        properties: {
          contract: {
            type: 'string',
            description: 'Starts with 0x e.g. 0xf76253bddf123543716092e77fc08ba81d63ff38. Default value is 0xf76253bddf123543716092e77fc08ba81d63ff38',
          },
        },
        required: ['contract'],
        additionalProperties: false,
      },
      strict: false,
    },
  },
]

async function create_token(args) {
  // owner, name, symbol, supply
  console.log(`Parameters => `, args)
  if (args.wallet === `null`) return { result: false, data: `You need to connect your wallet and retry!` }

  const RPC_ENDPOINT = 'https://rpc.sepolia.linea.build'
  const web3 = new Web3(RPC_ENDPOINT)
  const privateKey = '0x' + process.env.PRIVATEKEY
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)

  const contract = new web3.eth.Contract(ERC20ABI)

  try {
    const contractDeployer = contract.deploy({
      data:
        `0x` +
        `60806040523480156200001157600080fd5b50604051620018ac380380620018ac83398181016040528101906200003791906200056b565b828281600390816200004a91906200085c565b5080600490816200005c91906200085c565b5050506200007181856200007b60201b60201c565b5050505062000a46565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620000f05760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401620000e7919062000954565b60405180910390fd5b62000104600083836200010860201b60201c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036200015e578060026000828254620001519190620009a0565b9250508190555062000234565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015620001ed578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401620001e493929190620009ec565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200027f5780600260008282540392505081905550620002cc565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200032b919062000a29565b60405180910390a3505050565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b62000361816200034c565b81146200036d57600080fd5b50565b600081519050620003818162000356565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620003dc8262000391565b810181811067ffffffffffffffff82111715620003fe57620003fd620003a2565b5b80604052505050565b60006200041362000338565b9050620004218282620003d1565b919050565b600067ffffffffffffffff821115620004445762000443620003a2565b5b6200044f8262000391565b9050602081019050919050565b60005b838110156200047c5780820151818401526020810190506200045f565b60008484015250505050565b60006200049f620004998462000426565b62000407565b905082815260208101848484011115620004be57620004bd6200038c565b5b620004cb8482856200045c565b509392505050565b600082601f830112620004eb57620004ea62000387565b5b8151620004fd84826020860162000488565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620005338262000506565b9050919050565b620005458162000526565b81146200055157600080fd5b50565b60008151905062000565816200053a565b92915050565b6000806000806080858703121562000588576200058762000342565b5b6000620005988782880162000370565b945050602085015167ffffffffffffffff811115620005bc57620005bb62000347565b5b620005ca87828801620004d3565b935050604085015167ffffffffffffffff811115620005ee57620005ed62000347565b5b620005fc87828801620004d3565b92505060606200060f8782880162000554565b91505092959194509250565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200066e57607f821691505b60208210810362000684576200068362000626565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620006ee7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620006af565b620006fa8683620006af565b95508019841693508086168417925050509392505050565b6000819050919050565b60006200073d6200073762000731846200034c565b62000712565b6200034c565b9050919050565b6000819050919050565b62000759836200071c565b62000771620007688262000744565b848454620006bc565b825550505050565b600090565b6200078862000779565b620007958184846200074e565b505050565b5b81811015620007bd57620007b16000826200077e565b6001810190506200079b565b5050565b601f8211156200080c57620007d6816200068a565b620007e1846200069f565b81016020851015620007f1578190505b6200080962000800856200069f565b8301826200079a565b50505b505050565b600082821c905092915050565b6000620008316000198460080262000811565b1980831691505092915050565b60006200084c83836200081e565b9150826002028217905092915050565b62000867826200061b565b67ffffffffffffffff811115620008835762000882620003a2565b5b6200088f825462000655565b6200089c828285620007c1565b600060209050601f831160018114620008d45760008415620008bf578287015190505b620008cb85826200083e565b8655506200093b565b601f198416620008e4866200068a565b60005b828110156200090e57848901518255600182019150602085019450602081019050620008e7565b868310156200092e57848901516200092a601f8916826200081e565b8355505b6001600288020188555050505b505050505050565b6200094e8162000526565b82525050565b60006020820190506200096b600083018462000943565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000620009ad826200034c565b9150620009ba836200034c565b9250828201905080821115620009d557620009d462000971565b5b92915050565b620009e6816200034c565b82525050565b600060608201905062000a03600083018662000943565b62000a126020830185620009db565b62000a216040830184620009db565b949350505050565b600060208201905062000a406000830184620009db565b92915050565b610e568062000a566000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063313ce56711610066578063313ce5671461013457806370a082311461015257806395d89b4114610182578063a9059cbb146101a0578063dd62ed3e146101d057610093565b806306fdde0314610098578063095ea7b3146100b657806318160ddd146100e657806323b872dd14610104575b600080fd5b6100a0610200565b6040516100ad9190610aaa565b60405180910390f35b6100d060048036038101906100cb9190610b65565b610292565b6040516100dd9190610bc0565b60405180910390f35b6100ee6102b5565b6040516100fb9190610bea565b60405180910390f35b61011e60048036038101906101199190610c05565b6102bf565b60405161012b9190610bc0565b60405180910390f35b61013c6102ee565b6040516101499190610c74565b60405180910390f35b61016c60048036038101906101679190610c8f565b6102f7565b6040516101799190610bea565b60405180910390f35b61018a61033f565b6040516101979190610aaa565b60405180910390f35b6101ba60048036038101906101b59190610b65565b6103d1565b6040516101c79190610bc0565b60405180910390f35b6101ea60048036038101906101e59190610cbc565b6103f4565b6040516101f79190610bea565b60405180910390f35b60606003805461020f90610d2b565b80601f016020809104026020016040519081016040528092919081815260200182805461023b90610d2b565b80156102885780601f1061025d57610100808354040283529160200191610288565b820191906000526020600020905b81548152906001019060200180831161026b57829003601f168201915b5050505050905090565b60008061029d61047b565b90506102aa818585610483565b600191505092915050565b6000600254905090565b6000806102ca61047b565b90506102d7858285610495565b6102e285858561052a565b60019150509392505050565b60006012905090565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461034e90610d2b565b80601f016020809104026020016040519081016040528092919081815260200182805461037a90610d2b565b80156103c75780601f1061039c576101008083540402835291602001916103c7565b820191906000526020600020905b8154815290600101906020018083116103aa57829003601f168201915b5050505050905090565b6000806103dc61047b565b90506103e981858561052a565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b610490838383600161061e565b505050565b60006104a184846103f4565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156105245781811015610514578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161050b93929190610d6b565b60405180910390fd5b6105238484848403600061061e565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361059c5760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016105939190610da2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361060e5760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016106059190610da2565b60405180910390fd5b6106198383836107f5565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036106905760006040517fe602df050000000000000000000000000000000000000000000000000000000081526004016106879190610da2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107025760006040517f94280d620000000000000000000000000000000000000000000000000000000081526004016106f99190610da2565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555080156107ef578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516107e69190610bea565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361084757806002600082825461083b9190610dec565b9250508190555061091a565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156108d3578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016108ca93929190610d6b565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361096357806002600082825403925050819055506109b0565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610a0d9190610bea565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610a54578082015181840152602081019050610a39565b60008484015250505050565b6000601f19601f8301169050919050565b6000610a7c82610a1a565b610a868185610a25565b9350610a96818560208601610a36565b610a9f81610a60565b840191505092915050565b60006020820190508181036000830152610ac48184610a71565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610afc82610ad1565b9050919050565b610b0c81610af1565b8114610b1757600080fd5b50565b600081359050610b2981610b03565b92915050565b6000819050919050565b610b4281610b2f565b8114610b4d57600080fd5b50565b600081359050610b5f81610b39565b92915050565b60008060408385031215610b7c57610b7b610acc565b5b6000610b8a85828601610b1a565b9250506020610b9b85828601610b50565b9150509250929050565b60008115159050919050565b610bba81610ba5565b82525050565b6000602082019050610bd56000830184610bb1565b92915050565b610be481610b2f565b82525050565b6000602082019050610bff6000830184610bdb565b92915050565b600080600060608486031215610c1e57610c1d610acc565b5b6000610c2c86828701610b1a565b9350506020610c3d86828701610b1a565b9250506040610c4e86828701610b50565b9150509250925092565b600060ff82169050919050565b610c6e81610c58565b82525050565b6000602082019050610c896000830184610c65565b92915050565b600060208284031215610ca557610ca4610acc565b5b6000610cb384828501610b1a565b91505092915050565b60008060408385031215610cd357610cd2610acc565b5b6000610ce185828601610b1a565b9250506020610cf285828601610b1a565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610d4357607f821691505b602082108103610d5657610d55610cfc565b5b50919050565b610d6581610af1565b82525050565b6000606082019050610d806000830186610d5c565b610d8d6020830185610bdb565b610d9a6040830184610bdb565b949350505050565b6000602082019050610db76000830184610d5c565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610df782610b2f565b9150610e0283610b2f565b9250828201905080821115610e1a57610e19610dbd565b5b9291505056fea2646970667358221220f29a6a35c5843a6e7a01c144388a78db5e0940497423c3f280cde6eb9972638b64736f6c63430008130033`,
      arguments: [args.supply, args.name, args.symbol, args.wallet],
    })

    // const gas = await contractDeployer.estimateGas({
    //   from: account.address,
    // })
    // console.log('Estimated gas:', gas)

    const suggestion_gas = await web3.eth.getGasPrice()

    const deployResult = await web3.eth.accounts.signTransaction(
      {
        from: account.address,
        // to: airdropContractAddress,
        gasPrice: web3.utils.toHex(suggestion_gas),
        data: contractDeployer.encodeABI(),
      },
      privateKey
    )

    const res = await web3.eth.sendSignedTransaction(deployResult.rawTransaction)
    console.log(res)

    const tokenAddress = res.logs[0].address

    // New contract
    // const deployedTokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress)

    // Transfer token to the new owner
    /* const transferTokenResult = await web3.eth.accounts.signTransaction(
      {
        from: account.address,
        to: tokenAddress,
        gasPrice: web3.utils.toHex(suggestion_gas),
        data: deployedTokenContract.methods.transfer(account.address, args.wallet, web3.utils.toWei(args.supply, `ether`), true, '0x').encodeABI(),
      },
      privateKey
    )
    const transferTokenRes = await web3.eth.sendSignedTransaction(transferTokenResult.rawTransaction)
    console.log('Transfer Token', transferTokenRes)*/

    // Transfer ownership
    /* const transferOwnershipResult = await web3.eth.accounts.signTransaction(
      {
        from: account.address,
        to: tokenAddress,
        gasPrice: web3.utils.toHex(suggestion_gas),
        data: deployedTokenContract.methods.transferOwnership(args.wallet).encodeABI(),
      },
      privateKey
    )
    const transferOwnershipRes = await web3.eth.sendSignedTransaction(transferOwnershipResult.rawTransaction)
    console.log('Transfer Ownership', transferOwnershipRes)*/

    return { result: true, data: `Here is the TX hash ${res.logs[0].transactionHash} & contract address: ${tokenAddress}` }
  } catch (error) {
    return { result: false, data: error }
  }
}

async function get_total_holder(contract) {
  console.log(contract)
  let myHeaders = new Headers()
  myHeaders.append('Content-Type', `application/json`)
  myHeaders.append('Accept', `application/json`)

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      query: `query MyQuery {
  Asset(where: {id: {_eq: "${contract.toLowerCase()}"}}) {
    id
    isLSP7
    lsp4TokenName
    lsp4TokenSymbol
    lsp4TokenType
    name
    totalSupply
    owner_id
    holders(order_by: {balance: desc}) {
      balance
    }
    createdTimestamp
  }
}`,
    }),
  }

  const response = await fetch(`${process.env.LUKSO_API_ENDPOINT}`, requestOptions)
  if (!response.ok) {
    return { result: false, message: `Failed to fetch query` }
  }
  const data = await response.json()

  // Conver numbers from wei to eth
  if (data.data.Asset[0].holders) {
    return { result: true, total: data.data.Asset[0].holders.length }
  }

  return { result: false, message: `Failed to fetch query` }
}

export default async function handler(req, res) {
  console.log(req.body.old_messages)
  // console.log(req.body.profile)
  // console.log(req.body.messages)

  messages.push(req.body.profile)
  if (req.body.old_messages.length > 0) messages.push(...req.body.old_messages)

  messages.push(req.body.messages)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      tools: tools,
    })

    console.log(`res => `, completion.choices[0].message)

    // Check if it needs to call a function/ call an API
    if (completion.choices[0].message.tool_calls && completion.choices[0].message.tool_calls.length > 0) {
      const toolCall = completion.choices[0].message.tool_calls[0]
      let result, completion2, args

      switch (completion.choices[0].message.tool_calls[0].function.name) {
        case 'create_token':
          console.log(`CREATE TOKEN`)
          args = JSON.parse(toolCall.function.arguments)
          console.log(args)
          result = await create_token(args)
          console.log(`result of create_token function => `, result)

          messages.push(completion.choices[0].message)

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          })

          completion2 = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            tools,
          })

          res.status(200).json({ output: completion2.choices[0].message })
          break
        case 'get_lsp7':
          args = JSON.parse(toolCall.function.arguments)
          result = await get_lsp7(args.contract)
          console.log(`get_lsp7 => `, result)

          messages.push(completion.choices[0].message)
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          })

          completion2 = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            tools,
          })
          res.status(200).json({ output: completion2.choices[0].message })
          break
        default:
          res.status(200).json({ output: completion.choices[0].message })
          break
      }
    } else {
      res.status(200).json({ output: completion.choices[0].message })
    }
  } catch (err) {
    res.status(500).json({ error: 'failed to load data', message: err })
  }
}
