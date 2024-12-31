interface TelegramWebApp {
  initData: string

  onEvent(event: string, callback: Function): void
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp
  }
}
