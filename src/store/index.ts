import { useMemo, useSyncExternalStore } from 'react'
import { LocalStore } from './LocalStore'
import type { PersistedState } from '../seed/seed'

// เลือก impl ผ่าน env เดียว (ตอนนี้มีแต่ local — เปิดทาง ApiStore ไว้)
// const MODE = import.meta.env.VITE_STORE ?? 'local'
let _store: LocalStore | null = null

export function getStore(): LocalStore {
  if (!_store) _store = new LocalStore()
  return _store
}

/**
 * useLive — อ่านข้อมูลแบบ reactive (sync, ไม่ flicker)
 * re-run selector เมื่อ store bump version (รวมข้ามแท็บผ่าน storage event)
 */
export function useLive<T>(
  selector: (state: PersistedState) => T,
  deps: unknown[] = [],
): T {
  const store = getStore()
  const version = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.getVersion(),
    () => store.getVersion(),
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => selector(store.snapshot()), [version, ...deps])
}

export { LocalStore }
