// |reftest| skip-if(!this.hasOwnProperty('AsyncIterator'))

let x = {a: () => true};

async function* gen() {
  yield x.a();
  yield x.a();
}

gen().reduce(() => {}, 0).then(
  () => assertEq(true, false, 'expected error'),
  err => assertEq(err instanceof Error, true),
);

x.a = () => {
  throw Error();
};

if (typeof reportCompare === 'function')
  reportCompare(0, 0);
