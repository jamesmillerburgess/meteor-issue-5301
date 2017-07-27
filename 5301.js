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

    test('c.find({}).fetch()', c.find({}).fetch());
    test('c.findOne({})', c.findOne({}));
    test('c.findOne({ a: noop })', c.findOne({ a: noop }));
    test('c.findOne({ b: noop })', c.findOne({ b: noop }));
    test('c.findOne({ c: noop })', c.findOne({ c: noop }));
    test(
      'c.findOne({ a: "abc", b: noop })',
      c.findOne({ a: "abc", b: noop }),
    );
    test(
      'c.findOne({ b: noop, a: "abc" })',
      c.findOne({ b: noop, a: "abc" }),
    );

    test('c.find({ a: noop })', c.find({ a: noop }).fetch());
    test('c.find({ b: noop })', c.find({ b: noop }).fetch());
    test('c.find({ c: noop })', c.find({ c: noop }).fetch());
    test(
      'c.find({ a: "abc", b: noop })',
      c.find({ a: "abc", b: noop }).fetch(),
    );
    test(
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
    check(c.find({}).fetch());
    check(c.findOne({}));
    check(c.findOne({ a: noop }));           // c: undefined
    check(c.findOne({ b: noop }));           // c: undefined
    check(c.findOne({ c: noop }));           // c: undefined
    check(c.findOne({ a: "abc", b: noop })); // c: undefined
    check(c.findOne({ b: noop, a: "abc" })); // c: undefined

    check(c.find({ a: noop }).fetch());           // c: []
    check(c.find({ b: noop }).fetch());           // c: []
    check(c.find({ c: noop }).fetch());           // c: []
    check(c.find({ a: "abc", b: noop }).fetch()); // c: []
    check(c.find({ b: noop, a: "abc" }).fetch()); // c: []
  }, 300);
}
