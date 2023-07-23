import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Token contract', function () {
  it('Deployment should assign the total supply of tokens to the owner', async function () {
    const [owner] = await ethers.getSigners();

    const token = await ethers.deployContract('Token');

    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it('Should transfer tokens between accounts', async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const token = await ethers.deployContract('Token');

    // Transfer 50 tokens from owner to addr1
    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);

    // Transfer 50 tokens from addr1 to addr2
    await token.connect(addr1).transfer(addr2.address, 50);
    expect(await token.balanceOf(addr2.address)).to.equal(50);
  });

  it('Should fail if sender doesn\'t have enough tokens', async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const token = await ethers.deployContract('Token');

    // Try to send 1 token from addr1 (0 tokens) to addr2
    await expect(
      token.connect(addr1).transfer(addr2.address, 50)
    ).to.be.revertedWith('Not enough tokens');
  });

  it('Should emit Transfer event when transferring tokens', async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const token = await ethers.deployContract('Token');

    // Transfer 50 tokens from owner to addr1
    await expect(token.transfer(addr1.address, 50))
      .to.emit(token, 'Transfer')
      .withArgs(owner.address, addr1.address, 50);
  });
});
