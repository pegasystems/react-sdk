export const setCookie = (cname: string, cvalue: string, exdays: number): void => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
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

export const checkCookie = (cname: string) => getCookie(cname);
