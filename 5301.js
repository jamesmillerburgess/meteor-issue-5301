import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

c = new Mongo.Collection('docs');
t = new Mongo.Collection('tests');

const noop = () => null;

if (Meteor.isServer) {
  Meteor.startup(function () {
    let res;
    let num = 1;
    c.remove({});
    c.insert({ a: 'abc', b: 'def' });
    c.insert({ a: 'def', b: 'abc' });
    t.remove({});

    const test = (str, res) => {
      console.log(`${num} ${str}:`);
      console.log(res);
      t.insert({ num, str, res });
      num++;
    };

    test('c.find({}).fetch()', c.find({}).fetch());         // 1 both
    test('c.findOne({})', c.findOne({}));                   // 2 first
    test('c.findOne({ a: noop })', c.findOne({ a: noop })); // 3 first
    test('c.findOne({ b: noop })', c.findOne({ b: noop })); // 4 first
    test('c.findOne({ c: noop })', c.findOne({ c: noop })); // 5 first
    test(                                                   // 6 first
      'c.findOne({ a: "abc", b: noop })',
      c.findOne({ a: "abc", b: noop }),
    );
    test(                                                   // 7 first
      'c.findOne({ b: noop, a: "abc" })',
      c.findOne({ b: noop, a: "abc" }),
    );

    test('c.find({ a: noop })', c.find({ a: noop }).fetch()); // 8  both
    test('c.find({ b: noop })', c.find({ b: noop }).fetch()); // 9  both
    test('c.find({ c: noop })', c.find({ c: noop }).fetch()); // 10 both
    test(                                                     // 11 first
      'c.find({ a: "abc", b: noop })',
      c.find({ a: "abc", b: noop }).fetch(),
    );
    test(                                                     // 12 first
      'c.find({ b: noop, a: "abc" })',
      c.find({ b: noop, a: "abc" }).fetch(),
    );
  });
}

if (Meteor.isClient) {
  setTimeout(() => {
    let num = 1;
    const check = (res) => {
      const svr = t.findOne({ num });
      if (!_.isEqual(svr.res, res)) {
        console.log();
        console.log('--------------------------------------');
        console.log(`${num} FAIL ${svr.str}`);
        console.log(svr.res);
        console.log(res);
      } else {
        console.log(`${num} OK`);
      }
      num++;
    };
    check(c.find({}).fetch());               // 1 both
    check(c.findOne({}));                    // 2 first
    check(c.findOne({ a: noop }));           // 3 undefined
    check(c.findOne({ b: noop }));           // 4 undefined
    check(c.findOne({ c: noop }));           // 5 undefined
    check(c.findOne({ a: "abc", b: noop })); // 6 undefined
    check(c.findOne({ b: noop, a: "abc" })); // 7 undefined

    check(c.find({ a: noop }).fetch());           // 8  []
    check(c.find({ b: noop }).fetch());           // 9  []
    check(c.find({ c: noop }).fetch());           // 10 []
    check(c.find({ a: "abc", b: noop }).fetch()); // 11 []
    check(c.find({ b: noop, a: "abc" }).fetch()); // 12 []
  }, 300);
}
