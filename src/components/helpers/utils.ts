import {SdkComponentMap} from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

export class Utils {
  static scrollToTop(){
    const position = document.getElementById('#main-content')?.offsetTop || 0;
    document.body.scrollTop = position;
    document.documentElement.scrollTop = position;
  }
}

export default Utils;
