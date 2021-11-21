           const { expect } = require("chai");

describe("Token contract", function () {

    let donation;
    let donationContract;
    let owner;
    let addr1;
    let addrs;

    beforeEach(async function () {
        donation = await ethers.getContractFactory("donation");
        [owner, addr1, ...addrs] = await ethers.getSigners();

        donationContract = await donation.deploy();
        await donationContract.deployed();
    });

    describe("Transactions", function () {

        it("Should balance replenished", async function () {   
            await donationContract.connect(addr1).donate({ value: 5 });
            expect(await donationContract.getBalance()).to.equal(5);
        });

        it("Should balance change if the owner is trying to withdraw tokens", async function () {  
            await donationContract.connect(addr1).donate({ value: 5 });
            await donationContract.connect(owner).withdraw(addr1.address, 2);

            expect(await donationContract.getBalance()).to.equal(3);
        });

        it("Should balance not change if not the owner is trying to withdraw tokens", async function () {
            await donationContract.connect(addr1).donate({ value: 5 });

            //На этой строке ошибка "Transaction reverted without a reason string".
            //Как я понимаю, причина в модификаторе onlyOwner() в контракте: транзакция прерывается, т.к. msg.sender не равен owner, как и задумывалось.
            //Видимо, из-за этого тест ломается и не идет дальше на строку с expect, но как специально для теста (в контракте же это условие и задумывалось) обойти это условие, я не успел понять.
            await donationContract.connect(addr1).withdraw(addr1.address, 2);

            expect(await donationContract.getBalance()).to.equal(5);
        });
    });

    describe("Storing addresses and amounts", function () {

        it("Should be stored sender addresses and amounts", async function () {    
            await donationContract.connect(addr1).donate({ value: 5 });
            await donationContract.connect(addr1).donate({ value: 2 });

            expect(await donationContract.receiveAmountAtAddress(addr1.address)).to.equal(7);
        });
    });
});