import { describe, it, expect } from 'vitest';
import { moduleName } from './index';

describe('Tenant Module', () => {
  it('should export the correct module name', () => {
    expect(moduleName).toBe('tenant');
  });
});
