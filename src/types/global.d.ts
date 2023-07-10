// global.d.ts - Establishes a PCore global using the type info declared in @pega/pcore-connect-typedefs
// imports the default exported type (called PCore in the file) as the named type "PCoreType" (to avoid confusion)
import PCoreType from '@pega/pcore-pconnect-typedefs/types/pcore';

// declare that the running app can expect there to be a PCore constant that is of type PCoreType
declare global { const PCore: typeof PCoreType }

// tells TypeScript to export as a "module" - special syntax that's not well documented
export { };
