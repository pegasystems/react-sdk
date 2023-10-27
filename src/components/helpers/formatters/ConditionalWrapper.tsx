// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export default function ConditionalWrapper ({ condition, wrapper, childrenToWrap, key=null}: {condition:boolean, wrapper:Function, childrenToWrap:any, key?:any}) {
  return (
      condition ? wrapper(childrenToWrap) : childrenToWrap          
  )
}
