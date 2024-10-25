declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_API_KEY_OPENAI: string
  readonly VITE_API_KEY_MAPBOX: string
  readonly VITE_API_KEY_CESIUM: string
  readonly VITE_API_KEY_GOOGLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.svg';