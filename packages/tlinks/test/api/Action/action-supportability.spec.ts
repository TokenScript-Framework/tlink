import { describe, expect, test } from 'bun:test';
import { isVersionSupported } from '../../../src';

describe('isVersionSupported', () => {
  test('returns true when action version is less than client version', () => {
    expect(
      isVersionSupported({
        actionVersion: '2.1.0',
        supportedActionVersion: '2.2.0',
      }),
    ).toBe(true);
    expect(
      isVersionSupported({
        actionVersion: '2.2.0',
        supportedActionVersion: '2.3.0',
      }),
    ).toBe(true);
    expect(
      isVersionSupported({
        actionVersion: '1.0.0',
        supportedActionVersion: '2.2.0',
      }),
    ).toBe(true);
  });

  test('returns true when action version is equal to client version', () => {
    expect(
      isVersionSupported({
        actionVersion: '2.2.0',
        supportedActionVersion: '2.2.0',
      }),
    ).toBe(true);
  });

  test('returns false when action version is greater than client version', () => {
    expect(
      isVersionSupported({
        actionVersion: '2.3.0',
        supportedActionVersion: '2.2.0',
      }),
    ).toBe(false);
    expect(
      isVersionSupported({
        actionVersion: '3.0.0',
        supportedActionVersion: '2.2.0',
      }),
    ).toBe(false);
  });

  test('returns true ignoring patch version', () => {
    expect(
      isVersionSupported({
        actionVersion: '2.2.1',
        supportedActionVersion: '2.2.2',
      }),
    ).toBe(true);
    expect(
      isVersionSupported({
        actionVersion: '2.2.1',
        supportedActionVersion: '2.2.1',
      }),
    ).toBe(true);
    expect(
      isVersionSupported({
        actionVersion: '2.2.2',
        supportedActionVersion: '2.2.1',
      }),
    ).toBe(true);
    expect(
      isVersionSupported({
        actionVersion: '2.2.2',
        supportedActionVersion: '2.2',
      }),
    ).toBe(true);
  });

  test('returns false when action version is an incompatible string', () => {
    expect(
      isVersionSupported({
        actionVersion: 'invalidVersion',
        supportedActionVersion: '2.2.0',
      }),
    ).toBe(false);
    expect(
      isVersionSupported({
        actionVersion: '2.2.0',
        supportedActionVersion: 'invalidVersion',
      }),
    ).toBe(false);
  });

  test('returns false when acceptActionVersion is an incompatible string', () => {
    expect(
      isVersionSupported({
        actionVersion: '2.2.0',
        supportedActionVersion: 'invalid.version',
      }),
    ).toBe(false);
  });

  test('returns false when both versions are incompatible strings', () => {
    expect(
      isVersionSupported({
        actionVersion: 'invalid.version',
        supportedActionVersion: 'invalid.version',
      }),
    ).toBe(false);
  });
});
