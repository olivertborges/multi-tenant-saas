import { create } from 'zustand';

interface Tenant {
  id: string;
  slug: string;
  name: string;
  config: {
    theme?: {
      primary?: string;
      logo?: string;
    };
  };
}

interface TenantState {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  setTenant: (tenant) => set({ tenant }),
}));
