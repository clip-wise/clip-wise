// import { useState, useEffect, useCallback } from 'react';

// export function useStorage<T>(key: string, initialValue: T) {
//   const [value, setValue] = useState<T>(initialValue);

//   useEffect(() => {
//     const getStorageData = async () => {
//       if (chrome.storage && chrome.storage.local) {
//         const result = await chrome.storage.local.get([key]);
//         setValue(result[key] ?? initialValue);
//       }
//     };

//     getStorageData();

//     const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
//       if (changes[key]) {
//         setValue(changes[key].newValue);
//       }
//     };

//     if (chrome.storage && chrome.storage.local) {
//       chrome.storage.local.onChanged.addListener(listener);
//     }

//     return () => {
//       if (chrome.storage && chrome.storage.local) {
//         chrome.storage.local.onChanged.removeListener(listener);
//       }
//     };
//   }, [key, initialValue]);

//   const setStorage = useCallback((newValue: T) => {
//     if (chrome.storage && chrome.storage.local) {
//       chrome.storage.local.set({ [key]: newValue });
//     }
//     setValue(newValue);
//   }, [key]);

//   return [value, setStorage] as const;
// }
