/**
 * versionHelpers.ts
 *
 * Container helper functions that can identify which version of
 * PCore/PConnect is being run
 */

declare const PCore;

export const sdkVersion = "8.7";

export function compareSdkPCoreVersions() {

  // const theConstellationVersion = PCore.getPCoreVersion();

  // eslint-disable-next-line no-console
  console.warn(`Using Constellation version ${PCore.getPCoreVersion()}. Ensure this is the same version as your Infinity server.`);

}
