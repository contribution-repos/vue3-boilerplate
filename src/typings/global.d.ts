interface IGlobalConfig {
  test: number
}

declare interface Window {
  GLOBAL_CONFIG: IGlobalConfig
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
