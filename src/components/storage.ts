export const STORAGE_VERSION = "v3";

export function checkStorageVersion() {
  const current = localStorage.getItem("storageVersion");

  if (!current || current !== STORAGE_VERSION) {
    localStorage.clear();
    localStorage.setItem("storageVersion", STORAGE_VERSION);
  }
}
