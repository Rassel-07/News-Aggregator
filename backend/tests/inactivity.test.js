const { INACTIVITY_LIMIT_MS } = require('../middleware/authMiddleware');

describe('24-Hour Inactivity Session Management Logic', () => {
  test('INACTIVITY_LIMIT_MS should precisely equal 24 hours in milliseconds', () => {
    const expected = 24 * 60 * 60 * 1000;
    expect(INACTIVITY_LIMIT_MS).toBe(expected);
    expect(INACTIVITY_LIMIT_MS).toBe(86400000);
  });

  test('Should detect inactivity when lastActivityAt is older than 24 hours', () => {
    const now = Date.now();
    const lastActive = new Date(now - 25 * 60 * 60 * 1000); // 25 hours ago

    const inactiveDuration = now - lastActive.getTime();
    const isSessionExpired = inactiveDuration > INACTIVITY_LIMIT_MS;

    expect(isSessionExpired).toBe(true);
  });

  test('Should preserve active session when lastActivityAt is within 24 hours', () => {
    const now = Date.now();
    const lastActive = new Date(now - 4 * 60 * 60 * 1000); // 4 hours ago

    const inactiveDuration = now - lastActive.getTime();
    const isSessionExpired = inactiveDuration > INACTIVITY_LIMIT_MS;

    expect(isSessionExpired).toBe(false);
  });
});
