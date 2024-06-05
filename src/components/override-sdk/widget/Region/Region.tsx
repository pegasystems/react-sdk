import { PropsWithChildren } from 'react';

// Region does NOT have getPConnect. So, no need to extend from PConnProps
interface RegionProps {
  // If any, enter additional props that only exist on this component
}

export default function Region(props: PropsWithChildren<RegionProps>) {
  const { children } = props;

  return (
    <>
      {/* <div>Region</div> */}
      {children}
    </>
  );
}
