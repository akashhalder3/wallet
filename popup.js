document.addEventListener("DOMContentLoaded", function () {
  //TARGET THE ELEMENTS
  document
    .getElementById("accountList")
    .addEventListener("click", changeAccount);
  document.getElementById("userAddress").addEventListener("click", copyAddress);
  document.getElementById("transferFund").addEventListener("click", handler);
  document
    .getElementById("header_network")
    .addEventListener("click", getOpenNetwork);
  document
    .getElementById("network_item")
    .addEventListener("click", getSelectedNetwork);
  document.getElementById("add_network").addEventListener("click", setNetwork);
  document.getElementById("loginAccount").addEventListener("click", loginUser);
  document
    .getElementById("accountCreate")
    .addEventListener("click", createUser);
  document.getElementById("openCreate").addEventListener("click", openCreate);
  document.getElementById("sign_up").addEventListener("click", signUp);
  document.getElementById("login_up").addEventListener("click", login);
  document.getElementById("logout").addEventListener("click", logout);
  document.getElementById("open_transfer").addEventListener("click", openTransfer);
  document.getElementById("goBack").addEventListener("click", goBack);
  document.getElementById("open_Import").addEventListener("click", openImport);
  document.getElementById("goBack_import").addEventListener("click", importGoBack);
  document.getElementById("open_assets").addEventListener("click", openAssets);
  document
    .getElementById("open_activity")
    .addEventListener("click", openActivity);
  document.getElementById("goHomePage").addEventListener("click", goHomePage);
  document
    .getElementById("openAccountImport")
    .addEventListener("click", openImportModel);
  document
    .getElementById("close_import_account")
    .addEventListener("click", closeImportModel);
  document.getElementById("add_new_token").addEventListener("click", addToken);
  document
    .getElementById("add_New_Account")
    .addEventListener("click", addAccount);
});

//STATE VARIABLES
let providerUrl = "http://20.40.53.142:8545";
let provider;
// let privateKey;
let address;

//FUNCTION
function handler() {
  document.getElementById("transfer_center").style.display = "flex";
  const amount = document.getElementById("amount").value;
  const address = document.getElementById("address").value;

  const value = localStorage.getItem("userWallet");
  const data = JSON.parse(value);
  const privateKey = data.private_key;
  console.log(privateKey);
  const testAccount = "";

  //PROVIDER
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  let wallet = new ethers.Wallet(privateKey, provider);

  const tx = {
    to: address,
    value: ethers.utils.parseEther(amount),
  };

  let a = document.getElementById("link");
  a.hrer = "some link url";
  wallet.sendTransaction(tx).then((txObj) => {
    console.log("Transaction hash ", txObj);
    document.getElementById("transfer_center").style.display = "none";
    const a = document.getElementById("link");
    a.href = `http://103.76.122.123:4000/tx/${txObj.hash}`;
    document.getElementById("link").style.display = "block";
  });
}

function checkBalance() {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  provider.getBalance(address).then((balance) => {
    const balanceInEth = ethers.utils.formatEther(balance);
    document.getElementById(
      "accountBalance"
    ).innerHTML = `${balanceInEth} MATIC`;

    document.getElementById("userAddress").innerHTML = `${address.slice(
      0,
      15
    )}...`;
  });
}
function getOpenNetwork() {
  document.getElementById("network").style.display = "block";
}
function getSelectedNetwork(e) {
  const element = document.getElementById("selected_network");
  element.innerHTML = e.target.innerHTML;

  if (e.target.innerHTML === "Ethereum Maninet") {
    providerUrl = "https://mainnet.infura.io/v3/";
    document.getElementById("network").style.display = "none";
  } else if (e.target.innerHTML === "Polygon Maninet") {
    providerUrl = "https://polygon-bor-rpc.publicnode.com";
    document.getElementById("network").style.display = "none";
  } else if (e.target.innerHTML === "Polygon Mumbai") {
    providerUrl = "https://rpc-amoy.polygon.technology/";
    document.getElementById("network").style.display = "none";
  } else if (e.target.innerHTML === "Goreli Testnet") {
    providerUrl = "https://goerli.gateway.tenderly.co";
    document.getElementById("network").style.display = "none";
  }

  console.log("providerUrl ", providerUrl);
}
function setNetwork() {
  document.getElementById("network").style.display = "none";
}

function loginUser() {
  document.getElementById("createAccount").style.display = "none";
  document.getElementById("LoginUser").style.display = "block";
}
function createUser() {
  document.getElementById("createAccount").style.display = "block";
  document.getElementById("LoginUser").style.display = "none";
}
function openCreate() {
  document.getElementById("createAccount").style.display = "none";
  document.getElementById("create_popUp").style.display = "block";
}
function signUp() {
  const name = document.getElementById("sign_up_name").value;
  const email = document.getElementById("sign_up_email").value;
  const password = document.getElementById("sign_up_password").value;
  const passwordConfirm = document.getElementById(
    "sign_up_passwordConfirm"
  ).value;
  document.getElementById("field").style.display = "none";
  document.getElementById("center").style.display = "block";
  const wallet = ethers.Wallet.createRandom();
  if (wallet.address) {
    const data = {
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    };
    //API CALL
    const url = "http://localhost:3000/api/v1/user/signup";
    console.log(JSON.stringify(data));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        document.getElementById("createdAddress").innerHTML = wallet.address;
        document.getElementById("createdPrivateKey").innerHTML =
          wallet.privateKey;
        document.getElementById("createdMnemonic").innerHTML =
          wallet.mnemonic.phrase;
        document.getElementById("center").style.display = "none";
        document.getElementById("accountData").style.display = "block";
        document.getElementById("sign_up").style.display = "none";

        const userWallet = {
          address: wallet.address,
          private_key: wallet.privateKey,
          mnemonic: wallet.mnemonic.phrase,
        };

        const jsonObject = JSON.stringify(userWallet);
        localStorage.setItem("userWallet", jsonObject);
        document.getElementById("goHomePage").style.display = "block";
        window.location.reload();
      })
      .catch((error) => {
        console.log("error in signUp ", error);
      });
  } else {
    console.log("Wallet not generated");
  }
}

function login() {
  document.getElementById("login_form").style.display = "none";
  document.getElementById("center").style.display = "block";

  const email = document.getElementById("login_email").value;
  const password = document.getElementById("login_password").value;

  //API CALL
  const url = "http://localhost:3000/api/v1/user/login";
  const data = {
    email: email,
    password: password,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      const userWallet = {
        address: result.data.user.address,
        private_key: result.data.user.private_key,
        mnemonic: result.data.user.mnemonic,
      };
      const jsonObject = JSON.stringify(userWallet);
      localStorage.setItem("userWallet", jsonObject);
      window.location.reload();
    })
    .catch((error) => {
      console.log("email ", email);
    });
}
function logout() {
  localStorage.removeItem("userWallet");
  window.location.reload();
}
function openTransfer() {
  document.getElementById("transfer_form").style.display = "block";
  document.getElementById("home").style.display = "none";
}
function goBack() {
  document.getElementById("transfer_form").style.display = "none";
  document.getElementById("home").style.display = "block";
}
function openImport() {
  document.getElementById("import_token").style.display = "block";
  document.getElementById("home").style.display = "none";
}
function importGoBack() {
  document.getElementById("import_token").style.display = "none";
  document.getElementById("home").style.display = "block";
}
function openActivity() {
  document.getElementById("activity").style.display = "block";
  document.getElementById("assets").style.display = "none";
}
function openAssets() {
  document.getElementById("activity").style.display = "none";
  document.getElementById("assets").style.display = "block";
}
function goHomePage() {
  document.getElementById("create_popUp").style.display = "none";
  document.getElementById("home").style.display = "block";
}
function openImportModel() {
  document.getElementById("import_account").style.display = "block";
  document.getElementById("home").style.display = "none";
}

function closeImportModel() {
  document.getElementById("import_account").style.display = "none";
  document.getElementById("home").style.display = "block";
}
function addToken() {
  const address = document.getElementById("token_address").value;
  const name = document.getElementById("token_name").value;
  const symbol = document.getElementById("token_symbol").value;

  //API CALL
  const url = "http://localhost:3000/api/v1/tokens/createtoken";
  const data = {
    name: name,
    address: address,
    symbol: symbol,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      response.json();
    })
    .then((result) => {
      console.log("result ", result);
      window.location.reload();
    })
    .catch((error) => {
      console.log("Error ", error);
    });
}
function addAccount() {
  let privateKey = document.getElementById("add_account_private_key").value;
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  let wallet = new ethers.Wallet(privateKey, provider);
  const url = "http://localhost:3000/api/v1/account/createaccount";
  const data = {
    privateKey: privateKey,
    address: wallet.address,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("response ", response);
      response.json();
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log("addAccount ", error);
    });
}
function MyFunction() {
  const str = localStorage.getItem("userWallet");
  const parsedObj = JSON.parse(str);

  if (parsedObj.address) {
    document.getElementById("LoginUser").style.display = "none";
    document.getElementById("home").style.display = "block";

    privateKey = parsedObj.privateKey;
    address = parsedObj.address;
    checkBalance(parsedObj.address);
  }

  const tokenRender = document.querySelector(".assets");
  const accountRender = document.querySelector(".accountList");
  const url = "http://localhost:3000/api/v1/tokens/alltoken";
  fetch(url)
    .then((response) => {
      response.json();
    })
    .then((data) => {
      let elements = "";
      data?.data.tokens.map(
        (token) =>
          (elements += `<div class="assets_item">
        <img class="assets_item_img" src="./assets/theblockchaincoders.png" alt="image" />
        <span> ${token.address.slice(0, 15)}... </span>
        <span> ${token.symbol} </span>
        </div>`)
      );
      tokenRender.innerHTML = elements;
    })
    .catch((error) => {
      console.log(error);
    });

  fetch("http://localhost:3000/api/v1/account/allaccount")
    .then((response) => {
      response.json();
    })
    .then((data) => {
      let accounts = "";
      data?.data.accounts.map(
        (account, i) =>
          (accounts += `
            <div class="lists">
                <p>
                    ${i + 1}
                </p>
                <p class="accountValue" data-addre=${
                  account.address
                } data-privatekey=${account.privateKey}>
                    ${account.address.slice(0, 15)}...
                </p>
            </div>
        `)
      );
      accountRender.innerHTML = accounts;
    })
    .catch((error) => {
      console.log(error);
    });
  // console.log(privateKey);
}
function copyAddress() {
  navigator.clipboard.writeText(address);
}
function changeAccount() {
  const data = document.querySelector(".accountValue");
  const address = data.getAttribute("data-address");
  const privateKey = data.getAttribute("data-privateKey");

  console.log(privateKey, address);

  const userAddress = {
    address: address,
    private_key: privateKey,
    mnemonic: "Changed",
  };

  const jsonObj = JSON.stringify(userWallet);
  localStorage.setItem("userWallet", jsonObj);
  window.location.reload();
}

window.onload = MyFunction();
