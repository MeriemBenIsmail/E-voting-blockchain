// we require the contract Election .sol and assign it to a variable
var Election = artifacts.require("./ Election . sol");
// we call the " contract " function , and write all our
// tests within the callback function that provides an " accounts " variable
// that represents all the accounts on our blockchain , provided by Ganache .
contract(" Election ", function (accounts) {
  var electionInstance;
  // checking the candidates count is equal to 2
  it(" initializes with two candidates ", function () {
    return Election.deployed()
      .then(function (instance) {
        return instance.candidatesCount();
      })
      .then(function (count) {
        assert.equal(count, 2);
      });
  });
  // ensuring that each candidate has the correct id , name , and vote count .
  it("it initializes the candidates with the correct values ", function () {
    return Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidates(1);
      })
      .then(function (candidate) {
        assert.equal(candidate[0], 1, " contains the correct id");
        assert.equal(
          candidate[1],
          " Candidate 1",
          " contains the correct name "
        );
        assert.equal(candidate[2], 0, " contains the correct votes count ");
        return electionInstance.candidates(2);
      })
      .then(function (candidate) {
        assert.equal(candidate[0], 2, " contains the correct id");
        assert.equal(
          candidate[1],
          " Candidate 2",
          " contains the correct name "
        );
        assert.equal(candidate[2], 0, " contains the correct votes count ");
      });
  });
});
