export class Utils {
  static scrollToTop() {
    const position = document.getElementById('#main-content')?.offsetTop || 0;
    document.body.scrollTop = position;
    document.documentElement.scrollTop = position;
  }
}

export const GBdate = (date) => {
  const d = String(date).split("-");
  return d.length > 1 ? `${d[2]}/${d[1]}/${d[0]}` : date;
}


export default Utils;
