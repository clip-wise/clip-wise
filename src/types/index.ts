export interface Theme {
  mode: 'light' | 'dark';
}

export interface StorageData {
  theme: Theme;
  settings: {
    notifications: boolean;
    autoSave: boolean;
  };
}