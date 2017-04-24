import test from 'tape';

// Component to test


// Testear que ...
test('-------- Component: Example', (assert) => {
    const message = 'Message when error';
    const expected = false;

    const component = MyComponent();

    const actual = component.test();

    assert.equal(actual, expected, message);

    assert.end();
});
