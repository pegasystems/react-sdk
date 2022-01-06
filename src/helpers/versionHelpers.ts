/**
 * versionHelpers.ts
 *
 * Container helper functions that can identify which version of
 * PCore/PConnect is being run
 */

declare const PCore;

export const sdkVersion = "8.7";

export function compareSdkPCoreVersions() {

  const theConstellationVersion = PCore.getPCoreVersion();

  if (theConstellationVersion.includes(sdkVersion)) {
    // eslint-disable-next-line no-console
    console.log(`sdkVersion: ${sdkVersion} matches PCore version: ${PCore.getPCoreVersion()}`);
  } else {
    // eslint-disable-next-line no-console
    console.error(`sdkVersion: ${sdkVersion} does NOT match PCore version: ${PCore.getPCoreVersion()}`);
  }

}
