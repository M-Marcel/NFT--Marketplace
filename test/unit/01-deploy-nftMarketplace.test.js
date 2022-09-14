/**Tests
 * 1. Constructor
 * 2. List Items:
 *  - Starting price should be above zero
 *  - nftMarketplace should be approved to sell nft
 *  - ensure that the nft has not been listed before (modifier[notListed])
 *  - ensure that only the owner can list/spend nft (modifier[isOwner])
 *  - emit ItemListed event after each listing
 *  {Extra-challenge} = list/sell, buys token in multiple token subsets using chainlink pricefeed to convert the token between themselves
 * 3. Buy Item:
 *  - Confirm that nft is listed (modifier[isListed])
 *  - Confirm that buying amount is > listing price
 *  - map/keep track of sellers earnings.proceeds
 *  - emit event once the token/nft is bought
 *  - delete from listing mapping
 *  - transfer token/nft to buyer
 *  - confirm that event "itembought" is emitted
 * 4. Cancel Listing
 *  -  Confirm that isOwner
 *  - Confirm that it's listed
 *  - confirm item is deleted by conmfirming that event itemCanceled was emitted
 * 5. Update Listing
 *  - confirm that isListed and isOwner
 *  - confirm that price was updated by conmfirming that event itemListed was emitted
 * 6. WithdraProceeds
 *  - check if proceeds is greater than 0
 *  - check if proceeds mapping was reset
 *  - confirm if withdrwal of proceed was successful
 * */

const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig, networks } = require("../../helper-hardhat-config")

// !developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("NFT Marketplace unit test", async () => {
//           let nftMarketplaceContract, nftMarketplace, basicNftContract, basicNft, deployer, player
//           const PRICE = ethers.utils.parseEther("0.1")
//           const TOKEN_ID = 0

//           beforeEach(async () => {
//               deployer = (await getNamedAccounts()).deployer
//               player = (await getNamedAccounts()).player
//               await deployments.fixture(["all"])
//               nftMarketplaceContract = await ethers.getContract("NftMarketplace")
//               nftMarketplace = await nftMarketplaceContract.connect(player)
//               basicNftContract = await ethers.getContract("BasicNft")
//               basicNft = basicNftContract.connect(deployer)
//               await basicNft.mintNft()
//               await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID)
//           })

//           describe("List Item", () => {
//               it("Starting price is above zero", async () => {
//                   const nftMarketplaceAddress = nftMarketplace.address
//                   const tokenId = nftMarketplace.tokenId
//                   const listingPrice = nftMarketplace.listItem(nftMarketplaceAddress, tokenId, 1)

//                   assert.equal(listingPrice.price, "1")
//               })
//           })
//       })

//Test for Github Repo

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Marketplace Unit Tests", function () {
        let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract
        const PRICE = ethers.utils.parseEther("0.1")
        const TOKEN_ID = 0

        beforeEach(async () => {
            accounts = await ethers.getSigners() // could also do with getNamedAccounts
            deployer = accounts[0]
            user = accounts[1]
            await deployments.fixture(["all"])
            nftMarketplaceContract = await ethers.getContract("NftMarketplace")
            nftMarketplace = nftMarketplaceContract.connect(deployer)
            basicNftContract = await ethers.getContract("BasicNft")
            basicNft = await basicNftContract.connect(deployer)
            await basicNft.mintNFT()
            await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID)
        })

        describe("listItem", function () {
            it("emits an event after listing an item", async function () {
                expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit(
                    "ItemListed"
                )
            })
            it("exclusively items that haven't been listed", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                const error = `AlreadyListed("${basicNft.address}", ${TOKEN_ID})`
                //   await expect(
                //       nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                //   ).to.be.revertedWith("AlreadyListed")
                await expect(
                    nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                ).to.be.revertedWith(error)
            })
            it("exclusively allows owners to list", async function () {
                nftMarketplace = nftMarketplaceContract.connect(user)
                await basicNft.approve(user.address, TOKEN_ID)
                await expect(
                    nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                ).to.be.revertedWith("NotOwner")
            })
            it("needs approvals to list item", async function () {
                await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                await expect(
                    nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                ).to.be.revertedWith("NotApprovedForMarketplace")
            })
            it("Updates listing with seller and price", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                assert(listing.price.toString() == PRICE.toString())
                assert(listing.seller.toString() == deployer.address)
            })
        })
        describe("cancelListing", function () {
            it("reverts if there is no listing", async function () {
                const error = `NotListed("${basicNft.address}", ${TOKEN_ID})`
                await expect(
                    nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                ).to.be.revertedWith(error)
            })
            it("reverts if anyone but the owner tries to call", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                nftMarketplace = nftMarketplaceContract.connect(user)
                await basicNft.approve(user.address, TOKEN_ID)
                await expect(
                    nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                ).to.be.revertedWith("NotOwner")
            })
            it("emits event and removes listing", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                expect(await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)).to.emit(
                    "ItemCanceled"
                )
                const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                assert(listing.price.toString() == "0")
            })
        })
        describe("buyItem", function () {
            it("reverts if the item isnt listed", async function () {
                await expect(
                    nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
                ).to.be.revertedWith("NotListed")
            })
            it("reverts if the price isnt met", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                await expect(
                    nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
                ).to.be.revertedWith("PriceNotMet")
            })
            it("transfers the nft to the buyer and updates internal proceeds record", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                nftMarketplace = nftMarketplaceContract.connect(user)
                expect(
                    await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
                ).to.emit("ItemBought")
                const newOwner = await basicNft.ownerOf(TOKEN_ID)
                const deployerProceeds = await nftMarketplace.getProceeds(deployer.address)
                assert(newOwner.toString() == user.address)
                assert(deployerProceeds.toString() == PRICE.toString())
            })
        })
        describe("updateListing", function () {
            it("must be owner and listed", async function () {
                await expect(
                    nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
                ).to.be.revertedWith("NotListed")
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                nftMarketplace = nftMarketplaceContract.connect(user)
                await expect(
                    nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
                ).to.be.revertedWith("NotOwner")
            })
            it("updates the price of the item", async function () {
                const updatedPrice = ethers.utils.parseEther("0.2")
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                expect(
                    await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, updatedPrice)
                ).to.emit("ItemListed")
                const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                assert(listing.price.toString() == updatedPrice.toString())
            })
        })
        describe("withdrawProceeds", function () {
            it("doesn't allow 0 proceed withdrawls", async function () {
                await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith("NoProceeds")
            })
            it("withdraws proceeds", async function () {
                await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                nftMarketplace = nftMarketplaceContract.connect(user)
                await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
                nftMarketplace = nftMarketplaceContract.connect(deployer)

                const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer.address)
                const deployerBalanceBefore = await deployer.getBalance()
                const txResponse = await nftMarketplace.withdrawProceeds()
                const transactionReceipt = await txResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                const deployerBalanceAfter = await deployer.getBalance()

                assert(
                    deployerBalanceAfter.add(gasCost).toString() ==
                    deployerProceedsBefore.add(deployerBalanceBefore).toString()
                )
            })
        })
    })
