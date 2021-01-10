// 获取cookie
export function getCookie(name: string) {
    const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    const arr = document.cookie.match(reg)
    if (arr) { return (arr[2]) } else { return null }
}

// 设置cookie
export function setCookie(name: string, value: string | number, iDay: number = 365) {
    const oDate = new Date()
    oDate.setDate(oDate.getDate() + iDay)
    document.cookie = name + '=' + value + ';expires=' + oDate + ';path=/'
}

// 删除cookie
export function removeCookie(name: string) {
    setCookie(name, 1, -1)
}