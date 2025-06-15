import test from 'node:test';
import nanorouter from './index.js';

function noop() {}

test('router', async t => {
  await t.test('.on() throws type errors for invalid parameters', t => {
    t.plan(2);
    const r = nanorouter();
    t.assert.throws(r.on.bind(r, 123), /string/, 'route must be a string');
    t.assert.throws(r.on.bind(r, '/', 123), /function/, 'handler must be a function');
  });

  await t.test('.emit() throws if if no route is found', t => {
    t.plan(2);
    const r = nanorouter();
    t.assert.throws(r.emit.bind(r, '/'), /route '\/' did not match/);
    t.assert.throws(r.emit.bind(r, '/test'), /route '\/test' did not match/);
  });

  await t.test('.emit() should match a path', t => {
    t.plan(2);
    const r = nanorouter();
    r.on('/foo', () => {
      t.assert.ok('called');
    });
    r.on('/foo/bar', () => {
      t.assert.ok('called');
    });
    r.emit('/foo');
    r.emit('/foo/bar');
  });

  await t.test('.emit() should fallback to a default path', t => {
    t.plan(2);
    const r1 = nanorouter();
    const r2 = nanorouter({ default: '/custom-error' });
    r1.on('/404', () => {
      t.assert.ok('default called');
    });
    r2.on('/custom-error', () => {
      t.assert.ok('custom error called');
    });
    r1.emit('/nope');
    r2.emit('/custom-error');
  });

  await t.test('.emit() should match partials', t => {
    t.plan(2);
    const r = nanorouter();
    r.on('/:foo/:bar', param => {
      t.assert.equal(param.foo, 'baz', 'first param matched');
      t.assert.equal(param.bar, 'qux', 'second param matched');
    });
    r.emit('/baz/qux');
  });

  await t.test('.emit() should match a hash', t => {
    t.plan(1);
    const r = nanorouter();
    r.on('#test', () => {
      t.assert.ok('called');
    });
    r.emit('#test');
  });

  await t.test('.match() should match a path with utf-8 characters', t => {
    t.plan(1);
    const r = nanorouter();
    r.on('/foobær', () => {
      t.assert.fail('accidentally called');
    });
    t.assert.ok(r.match(encodeURI('/foobær')));
  });

  await t.test('.match() should match a path', t => {
    t.plan(2);
    const r = nanorouter();
    r.on('/foo', () => {
      t.assert.fail('accidentally called');
    });
    r.on('/foo/bar', () => {
      t.assert.fail('accidentally called');
    });
    t.assert.ok(r.match('/foo'));
    t.assert.ok(r.match('/foo/bar'));
  });

  await t.test('.match() returns a an object with a handler', t => {
    t.plan(1);
    const r = nanorouter();
    r.on('/:foo/:bar', () => {
      t.assert.ok('called');
    });
    r.match('/baz/qux').cb();
  });

  await t.test('.match() should match partials', t => {
    t.plan(3);
    const r = nanorouter();
    r.on('/:foo/:bar', noop);
    const matched = r.match('/baz/qux');
    t.assert.equal(matched.params.foo, 'baz');
    t.assert.equal(matched.params.bar, 'qux');
    t.assert.equal(Object.keys(matched.params).length, 2);
  });

  await t.test('.match() returns a an object with a route property', t => {
    t.plan(1);
    const r = nanorouter();
    r.on('/:foo/:bar', noop);
    t.assert.equal(r.match('/baz/qux').route, ':foo/:bar');
  });
});
