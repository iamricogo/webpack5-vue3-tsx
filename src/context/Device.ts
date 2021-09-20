import { ScreenState } from '@/const'

export class Device {
  public version!: string
  public webkit!: boolean
  public notchScreen!: boolean
  public phone = {
    iphonex: false,
    iphonexr: false,
    iphonexsmax: false
  }
  public browser = {
    chrome: false,
    safari: false,
    firefox: false,
    ie: false,
    edge: false,
    opera: false,
    qq: false,
    '360': false
  }

  public mobile = {
    device: false,
    ios: false,
    andriod: false,
    tablet: false
  }

  constructor() {
    this.mobile = this.initMobileData()
    this.version = this.getVersion()
    this.webkit = this.iosWKWebView()
    this.notchScreen = this.isNotchScreen()
    this.browser = this.initBrowserData()
  }

  private initMobileData() {
    const ua = navigator.userAgent
    const andriod = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1
    const ios = !!/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const tablet =
      /(?:iPad|PlayBook)/.test(ua) ||
      (andriod && !/(?:Mobile)/.test(ua)) ||
      (/(?:Firefox)/.test(ua) && /(?:Tablet)/.test(ua))
    const device = andriod || ios || tablet

    return {
      ios: ios,
      andriod: andriod,
      tablet: tablet,
      device: device
    }
  }

  private getVersion() {
    const verData = navigator.userAgent
      .toLocaleLowerCase()
      .match(/os [\d._]*/gi)
    const version = (verData + '')
      .replace(/[^0-9|_.]/gi, '')
      .replace(/_/gi, '.')
    return version
  }

  private iosWKWebView() {
    return this.mobile.ios && navigator.userAgent.indexOf('Safari') == -1
  }

  private isNotchScreen(): boolean {
    const ios = this.mobile.ios,
      width = screen.width,
      height = screen.height
    this.phone.iphonex =
      ios && width == 375 && height == 812 && devicePixelRatio == 3 //iphoneX and iphoneXs
    this.phone.iphonexr =
      ios && width == 414 && height == 896 && devicePixelRatio == 2
    this.phone.iphonexsmax =
      ios && width == 414 && height == 896 && devicePixelRatio == 3
    return this.phone.iphonex || this.phone.iphonexr || this.phone.iphonexsmax
  }

  private initBrowserData() {
    const ua = navigator.userAgent
    const brower = {
      chrome: ua.indexOf('Chrome') > -1 && ua.indexOf('Safari') > -1,
      safari:
        ua.indexOf('Safari') > -1 &&
        ua.indexOf('Chrome') == -1 &&
        typeof window.external == 'undefined',
      firefox: ua.indexOf('Firefox') > -1,
      ie: !!window.ActiveXObject || 'ActiveXObject' in window,
      edge: ua.indexOf('Edge') > -1,
      opera: ua.indexOf('Opera') > -1,
      qq: ua.indexOf('qqbrowse') > -1,
      360: ((option: string, value: string) => {
        // eslint-disable-next-line
        const mimeTypes = navigator.mimeTypes as any
        for (const mt in mimeTypes) {
          if (mimeTypes[mt][option] == value) {
            return true
          }
        }
        return false
      })('type', 'application/vnd.chromium.remoting-viewer')
    }
    return brower
  }

  /**
   * 操作系统信息，后端收集
   */
  public get osName(): string {
    let osName = 'Unknow',
      version = '',
      // eslint-disable-next-line
      uaResult: any[] | null = []
    const userAgent = navigator.userAgent,
      appVersion = navigator.appVersion,
      platform = navigator.platform
    if (this.mobile.andriod) {
      uaResult =
        /android (\d+(?:\.\d+)+)/i.exec(userAgent) ||
        /android (\d+(?:\.\d+)+)/i.exec(platform)
      version = uaResult ? uaResult[1] : ''
    }
    if (this.mobile.ios) {
      uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(userAgent)
      version = uaResult ? uaResult[2] : ''
    }

    if (this.getWinOSName()) {
      osName = this.getWinOSName()
    } else if (this.mobile.ios) {
      osName = 'iOS_' + version
    } else if (appVersion.indexOf('Mac') !== -1) {
      osName = 'OS X_'
    } else if (
      appVersion.indexOf('X11') !== -1 &&
      appVersion.indexOf('Linux') === -1
    ) {
      osName = 'OS X'
    } else if (this.mobile.andriod) {
      osName = 'Android_' + version
    } else if (appVersion.indexOf('Linux') !== -1) {
      osName = 'Linux'
    }

    return osName
  }

  private getWinOSName() {
    const isWinPlatform =
      navigator.appVersion.indexOf('Win') != -1 &&
      /Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(navigator.userAgent) &&
      RegExp['$1'] == 'NT'

    if (isWinPlatform) {
      switch (RegExp['$2']) {
        case '5.1':
          return 'WindowsXP'
        case '6.0':
          return 'WindowsVista'
        case '6.1':
          return 'Windows7'
        case '6.2':
          return 'Windows8'
        case '10.0':
          return 'Windows10'
        default:
          return 'NT'
      }
    }
    return ''
  }

  public get screenState(): ScreenState {
    let screenState = ScreenState.WEB
    if (!this.mobile.device) {
      if (window.innerWidth > 1100) screenState = ScreenState.WEB
      else {
        if (window.innerWidth / window.innerHeight < 0.73)
          screenState = ScreenState.PORTRAIT
        else screenState = ScreenState.LANDSCAPE
      }
    } else {
      if (window.orientation == 90 || window.orientation == -90)
        screenState = ScreenState.LANDSCAPE
      else screenState = ScreenState.PORTRAIT
    }

    /// lower than ios9 hack
    if (this.mobile.ios && parseInt(this.version.split('.')[0]) < 9) {
      const winWidth = document.documentElement.clientWidth
      const winHeight = document.documentElement.clientHeight
      if (winWidth > winHeight) screenState = ScreenState.LANDSCAPE
      else screenState = ScreenState.PORTRAIT
    }

    /// tablet forever landscape
    if (this.mobile.tablet) screenState = ScreenState.LANDSCAPE

    return screenState
  }
}
