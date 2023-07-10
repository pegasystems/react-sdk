import type PConnect from '@pega/pcore-pconnect-typedefs/types/pconn';

// This gives us a place to have each component extend its props (from BaseProps)
//  such that every component will be expected to have a getPConnect() function
//  that returns a PConnect object. (new/better way of doing .propTypes).
//  This BaseProps can be extended to include other props that we know are in every component
export interface BaseProps {
	getPConnect: () => typeof PConnect;
}
