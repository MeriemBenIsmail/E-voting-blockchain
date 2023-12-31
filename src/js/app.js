App = {
  // TEMP
  gotPromise: false,
  // END TEMP
  web3Provider: null,
  contracts: {},
  account: "0x0",
  hasVoted: false,
  // set up web3 .js : is a javascript library that allows
  // our client - side application to talk to the blockchain .
  // We configure web3 inside the"initWeb3"function .
  init: function () {
    return App.initWeb3();
  },
  initWeb3: function () {
    // TODO : refactor conditional
    if (typeof web3 !== undefined) {
      // If a web3 instance is already provided by Meta
      Mask.ethereum.enable().then((msg) => console.log(msg, "test"));
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance
      provided;
      App.web3Provider = new Web3.providers.HttpProvider(
        "http :// localhost :7545 "
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },
  // Initialize contracts : We fetch the deployed instance of
  // the smart contract inside this function and assign some
  // values that will allow us to interact with it.
  initContract: function () {
    $.getJSON("Election.json", function (election) {
      // Instantiate a new truffle contract from the
      artifact;
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },
  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this
      event;
      // This is a known issue with Metamask
      //
      // github .com / MetaMask / metamask - extension / issues /2393
      https: instance
        .votedEvent(
          {},
          {
            fromBlock: 0,
            toBlock: "latest",
          }
        )
        .watch(function (error, event) {
          console.log("event triggered", event);
          // Reload when a new vote is recorded
          App.render();
        });
    });
  },
  // The render function lays out all the content on the page with data
  // from the smart contract.For now , we list the candidates we created
  // inside the smart contract.We do this by looping through each candidate
  // in the mapping , and rendering it to the table .
  // We also fetch the current account that is connected to the blockchain
  // inside this function and display it on the page .
  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();
    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account :" + account);
      }
    });
    // Load contract data
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      })
      .then(function (candidatesCount) {
        if (!App.gotPromise) {
          App.gotPromise = true;
          var candidatesResults = $("#candidatesResults");
          candidatesResults.empty();
          var candidatesSelect = $("#candidatesSelect");
          candidatesSelect.empty();
          for (var i = 1; i <= candidatesCount; i++) {
            electionInstance.candidates(i).then(function (candidate) {
              var id = candidate[0];
              var name = candidate[1];
              var voteCount = candidate[2];
              // Render candidate Result
              var candidateTemplate =
                "<tr> <th>" +
                id +
                "</th> <td>" +
                name +
                "</td> <td>" +
                voteCount +
                "</td> </tr>";
              candidatesResults.append(candidateTemplate);
              // console.log("arrived to load template")
              // Render candidate ballot option
              var candidateOption =
                "<option value = ’" + id + "’>" + name + "</ option>";
              candidatesSelect.append(candidateOption);
            });
          }
        }
        return electionInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        // Do not allow a user to vote
        if (hasVoted) {
          $("form").hide();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },
  castVote: function () {
    var candidateId = $("#candidatesSelect").val();
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.vote(candidateId, { from: App.account });
      })
      .then(function (result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      })
      .catch(function (err) {
        console.error(err);
      });
  },
};
$(function () {
  $(window).load(function () {
    App.init();
  });
});
