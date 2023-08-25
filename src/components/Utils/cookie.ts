import { v4 as uuid } from "uuid";

const COOKIE_PEGAODXDI = 'pegaodxdi';
const HASH = 'Pn5AYySRgIZP9MYbh27Ow';
const date400daysLater = () => new Date(new Date().getTime() + (8.64e+7 * 400)).toUTCString();

export const setCookie = (cname: string) => {
    // requirements for future cookies unknown, hence the switch statement
    switch (cname) {
        case COOKIE_PEGAODXDI:
            const cookieValue = `${cname}#${uuid()}#${new Date().getTime()}_${HASH}`;
            document.cookie = `${cname}=${cookieValue};expires=${date400daysLater()};path=/`;
        default:
            return null;
    };
};

export const updateCookieValue = (cname: string, value: string = '') => {
    if (getCookie(cname)) {
        document.cookie = `${cname}=${value};expires=${date400daysLater()};path=/`;
    };
};

export const updateCookieAttribute = (cname: string, atrName: string, atrVal: string) => {
    if (getCookie(cname)) {
        document.cookie = `${cname}=${getCookie(cname)};${atrName}=${atrVal};path=/`;
    };
};

export const getCookie = (cname: string) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

export const checkCookie = (cname: string) => getCookie(cname);

export const getDeviceId = () => {
    checkCookie(COOKIE_PEGAODXDI)
        ? updateCookieAttribute(COOKIE_PEGAODXDI, 'expires', date400daysLater())
        : setCookie(COOKIE_PEGAODXDI)
    return getCookie(COOKIE_PEGAODXDI);
};


