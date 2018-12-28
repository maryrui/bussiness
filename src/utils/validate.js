
//合法的手机号

export function validatePhone(phone){
    return !(/^1[0-9]{10}$/.test(phone));
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
    return /^http[s]?:\/\/.*/.test(s)
}
