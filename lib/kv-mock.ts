// Mock de Vercel KV para desarrollo local
// En producción, usa el KV real de Vercel

const storage = new Map<string, any>();

export const kvMock = {
  async get<T>(key: string): Promise<T | null> {
    console.log(`[KV Mock] GET ${key}`);
    const value = storage.get(key);
    return value !== undefined ? (value as T) : null;
  },

  async set(key: string, value: any): Promise<void> {
    console.log(`[KV Mock] SET ${key}`, value);
    storage.set(key, value);
  },

  async delete(key: string): Promise<void> {
    console.log(`[KV Mock] DELETE ${key}`);
    storage.delete(key);
  },

  // Método para limpiar el storage (útil para testing)
  clear() {
    console.log('[KV Mock] CLEAR all data');
    storage.clear();
  },
};
