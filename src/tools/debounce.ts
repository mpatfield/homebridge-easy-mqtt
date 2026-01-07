const TIMEOUTS = new Map<string, NodeJS.Timeout>();

const DEFAULT_TIMEOUT = 250;

export function debounce(key: string, task: () => (void), timeout: number = DEFAULT_TIMEOUT) {

  clearTimeout(TIMEOUTS.get(key));

  TIMEOUTS.delete(key);

  TIMEOUTS.set(key, setTimeout(() => {
    TIMEOUTS.delete(key);
    task();
  }, timeout));
}