/**
 * versionHelpers.ts
 *
 * Container helper functions that can identify which version of
 * PCore/PConnect is being run
 */

declare const PCore;

export const sdkVersion = "8.6";

export function is86(): boolean {
  let bRet = false;
  const theVer = PCore.getPCoreVersion();

  if (theVer.includes("1.0") || theVer.includes("8.6")) {
    bRet = true;
  }

  return bRet;
}


export function is87(): boolean {
  let bRet = false;
  const theVer = PCore.getPCoreVersion();

  if (theVer.includes("8.7")) {
    bRet = true;
  }

  return bRet;
}

export function compareSdkPCoreVersions() {
  if (is86() && (sdkVersion.includes("8.6"))) {
    // eslint-disable-next-line no-console
    console.log(`sdkVersion: ${sdkVersion} matches PCore version: ${PCore.getPCoreVersion()}`);
  } else {
    // eslint-disable-next-line no-console
    console.error(`sdkVersion: ${sdkVersion} does NOT match PCore version: ${PCore.getPCoreVersion()}`);
  }
}
