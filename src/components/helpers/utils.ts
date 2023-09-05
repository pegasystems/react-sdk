export class Utils {
  static scrollToTop(){
    const position = document.getElementById('#main-content')?.offsetTop || 0;
    document.body.scrollTop = position;
    document.documentElement.scrollTop = position;
  }
}

export default Utils;
