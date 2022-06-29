// 此文件封装三个方法，专门用来操作token
const key = 'geek-ithema'

export const setToken = (token) => { localStorage.setItem(key, token) }
export const getToken = () => localStorage.getItem(key)
export const removeToken = () => { localStorage.removeItem(key) }
