import {useEffect} from 'react';

/**
 * A helper hook for adding 'Error:' as a prefix to the page title, to align with GDS Expectations
 * Takes one arguement - errorProperty, the property or state value that represents the presence of an error
 * which is referenced in the dependency array and also used as a conditional within the effect
 * function.
 * If errorProperty resolves as true, the document title will be prefixed with 'Error:'
 * If the errorProperty resolves as false, the document title will have 'Error:' prefix removed.
*/

export default function useAddErrorToPageTitle(errorProperty) {
  const errorPrefix = "Error: ";
  useEffect(() => {
    if(errorProperty){
      if(!document.title.startsWith(errorPrefix))
      document.title = `${errorPrefix}${document.title}`;
    } else {
      document.title = document.title.replace(errorPrefix,"");
    }
  }, [errorProperty])
}
