const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId
  let ethUsdPriceFeedAddress

  if (developmentChains.includes(network.name)) {
    const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
    ethUsdPriceFeedAddress = EthUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
  }

  log("----------------------")
  const lowSVG = await fs.readFileSync("./images/dynamicNFT/frown.svg", { encoding: "utf8" })
  const highSVG = await fs.readFileSync("./images/dynamicNFT/happy.svg", { encoding: "utf8" })
  args = [ethUsdPriceFeedAddress, lowSVG, highSVG]
  const dynamicSvgNft = await deploy("DynamicSvgNft", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log("-----------------------------")
  if (!developmentChains.includes(network.name) && process.env.ETHERSACN_API_KEY) {
    log("Verifying...")
    await verify(dynamicSvgNft.address, arguments)
  }
}

module.exports.tags = ["all", "dynamicsvg", "main"]
