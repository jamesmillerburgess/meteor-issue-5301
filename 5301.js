TestCollection = new Mongo.Collection("test");

if (Meteor.isClient) {
  // counter starts at 0
  var testclient = TestCollection.findOne({
    stuff1: function () {}
  });

  console.log('should be undefined', testclient);

}

if (Meteor.isServer) {
  Meteor.startup(function () {

    if (TestCollection.find({}).count() === 0) {
      var result = TestCollection.insert({
        stuff1: 'abc',
        stuff2: 'def'
      });

      console.log("Created", result);
    }

    var testserver = TestCollection.findOne({
      stuff1: function () {}
    });

    console.log('should be undefined but isnt', testserver); // is not undefined as expected
  });
}
