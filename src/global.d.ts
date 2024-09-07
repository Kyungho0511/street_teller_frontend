declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_API_KEY_OPENAI: string
  readonly VITE_API_KEY_MAPBOX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}