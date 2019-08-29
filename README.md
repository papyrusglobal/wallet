# Papyrus Wallet
The easyest way to stake/unstake tokens is to use Papyrus Wallet. Papyrus Wallet works with MetaMask extension and gives you a particularly user-friendly interface for all features of Papyrus Network.

### Docker
#### Lazy
```
docker build https://github.com/papyrusglobal/wallet.git -t wallet:latest && docker run --name=papyrus-wallet -p 8380:80 -d wallet:latest
```
#### Harder
```
git clone git@github.com:papyrusglobal/wallet.git
docker-compose up
```

### Setup environment (optional)
In case you want change BIOS_ADDRESS (should not be constant in future) and PAPYRUS_NETWORK_ID.
```
echo 'VUE_APP_PAPYRUS_NETWORK_ID={id}' >> .env.local
echo 'VUE_APP_BIOS_ADDRESS={address}' >> .env.local
```
or
```
cp .env > .env.local
vim .env.local
```

### Development (very optional)
```
git clone https://github.com/papyrusglobal/wallet.git 
yarn install
yarn run serve
```
