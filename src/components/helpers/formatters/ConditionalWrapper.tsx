export default function ConditionalWrapper ({ condition, wrapper, childrenToWrap}: {condition:boolean, wrapper:Function, childrenToWrap:any}) {
  return (
      condition ? wrapper(childrenToWrap) : childrenToWrap          
  )
}
