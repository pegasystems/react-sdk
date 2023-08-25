import { v4 as uuid } from "uuid";

const COOKIE_PEGAODXDI = 'pegaodxdi';
const HASH = 'Pn5AYySRgIZP9MYbh27Ow';
const date400daysLater = () => new Date(new Date().getTime() + (8.64e+7 * 400)).toUTCString();

export const setCookie = (cname: string): void => {
    // requirements for future cookies unknown, hence the check
    if (cname === COOKIE_PEGAODXDI) {
        const cookieValue = `${cname}#${uuid()}#${new Date().getTime()}_${HASH}`;
        document.cookie = `${cname}=${cookieValue};expires=${date400daysLater()};path=/`;
    }
};

export const getCookie = (cname: string) => {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.startsWith(' ')) {
            c = c.substring(1);
        }
        if (c.startsWith(name)) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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

export const checkCookie = (cname: string) => getCookie(cname);

export const getDeviceId = () => {
    if (checkCookie(COOKIE_PEGAODXDI)) {
        updateCookieAttribute(COOKIE_PEGAODXDI, 'expires', date400daysLater())
    } else {
        setCookie(COOKIE_PEGAODXDI)
    }
    return getCookie(COOKIE_PEGAODXDI);
};


