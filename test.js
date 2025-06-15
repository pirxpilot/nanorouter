const tape = require('tape');
const nanorouter = require('./');
function noop() {}

tape('router', t => {
  t.test('.on() throws type errors for invalid parameters', t => {
    t.plan(2);
    const r = nanorouter();
    t.throws(r.on.bind(r, 123), /string/, 'route must be a string');
    t.throws(r.on.bind(r, '/', 123), /function/, 'handler must be a function');
  });

  t.test('.emit() throws if if no route is found', t => {
    t.plan(2);
    const r = nanorouter();
    t.throws(r.emit.bind(r, '/'), /route '\/' did not match/);
    t.throws(r.emit.bind(r, '/test'), /route '\/test' did not match/);
  });

  t.test('.emit() should match a path', t => {
    t.plan(2);
    const r = nanorouter();
    r.on('/foo', () => {
      t.pass('called');
    });
    r.on('/foo/bar', () => {
      t.pass('called');
    });
    r.emit('/foo');
    r.emit('/foo/bar');
  });

  t.test('.emit() should fallback to a default path', t => {
    t.plan(2);
    const r1 = nanorouter();
    const r2 = nanorouter({ default: '/custom-error' });
    r1.on('/404', () => {
      t.pass('default called');
    });
    r2.on('/custom-error', () => {
      t.pass('custom error called');
    });
    r1.emit('/nope');
    r2.emit('/custom-error');
  });

  t.test('.emit() should match partials', t => {
    t.plan(2);
    const r = nanorouter();
    r.on('/:foo/:bar', param => {
      t.equal(param.foo, 'baz', 'first param matched');
      t.equal(param.bar, 'qux', 'second param matched');
    });
    r.emit('/baz/qux');
  });

  t.test('.emit() should match a hash', t => {
    t.plan(1);
    const r = nanorouter();
    r.on('#test', () => {
      t.pass('called');
    });
    r.emit('#test');
  });

  t.test('.match() should match a path with utf-8 characters', t => {
    t.plan(1);
    const r = nanorouter();
    r.on('/foobær', () => {
      t.fail('accidentally called');
    });
    t.ok(r.match(encodeURI('/foobær')));
  });

  t.test('.match() should match a path', t => {
    t.plan(2);
    const r = nanorouter();
    r.on('/foo', () => {
      t.fail('accidentally called');
    });
    r.on('/foo/bar', () => {
      t.fail('accidentally called');
    });
    t.ok(r.match('/foo'));
    t.ok(r.match('/foo/bar'));
  });

  t.test('.match() returns a an object with a handler', t => {
    t.plan(1);
    const r = nanorouter();
    r.on('/:foo/:bar', () => {
      t.pass('called');
    });
    r.match('/baz/qux').cb();
  });

  t.test('.match() should match partials', t => {
    t.plan(3);
    const r = nanorouter();
    r.on('/:foo/:bar', noop);
    const matched = r.match('/baz/qux');
    t.equal(matched.params.foo, 'baz');
    t.equal(matched.params.bar, 'qux');
    t.equal(Object.keys(matched.params).length, 2);
  });

  t.test('.match() returns a an object with a route property', t => {
    t.plan(1);
    const r = nanorouter();
    r.on('/:foo/:bar', noop);
    t.equal(r.match('/baz/qux').route, ':foo/:bar');
  });
});
