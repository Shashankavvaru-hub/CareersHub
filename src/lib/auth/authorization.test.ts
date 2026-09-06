import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireCompanyRole } from './authorization';
import * as currentUser from './current-user';

const mockLimit = vi.fn();
const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

vi.mock('./current-user', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('../../db', () => ({
  db: {
    select: () => mockSelect(),
  },
}));

describe('Authorization logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws Forbidden if user has no membership', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(currentUser, 'getCurrentUser').mockResolvedValue({ id: 'user-1' } as any);
    mockLimit.mockResolvedValue([]);
    
    await expect(requireCompanyRole('comp-1', ['admin']))
      .rejects.toThrow('Forbidden: Not a member of this company');
  });

  it('throws Forbidden if role is insufficient', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(currentUser, 'getCurrentUser').mockResolvedValue({ id: 'user-1' } as any);
    mockLimit.mockResolvedValue([{ role: 'editor' }]);
    
    await expect(requireCompanyRole('comp-1', ['admin', 'owner']))
      .rejects.toThrow('Forbidden: Insufficient role permissions');
  });

  it('returns membership if role is authorized', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(currentUser, 'getCurrentUser').mockResolvedValue({ id: 'user-1' } as any);
    mockLimit.mockResolvedValue([{ role: 'admin' }]);
    
    const membership = await requireCompanyRole('comp-1', ['admin', 'owner']);
    expect(membership.role).toBe('admin');
  });
});
