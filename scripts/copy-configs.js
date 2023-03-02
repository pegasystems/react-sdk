const fs = require('fs');
const fg = require('fast-glob');
const path = require('path');

const fsp = fs.promises;
const LOG_PRELUDE = "copy-config-ext:";
const COMPONENTS_ROOT_SOURCE = "src/components";
const COMPONENTS_CUSTOM_DIR = "custom";
const COMPONENTS_OVERRIDE_DIR = "override";
const COMPONENTS_ROOT_TARGET = "distAuthoring/components";
const CONFIG_NAME = "config.json";
const CONFIG_EXT_NAME = "config-ext.json";

// copy-configs.js
//  Only useful for SDKs running against Infinity 8.7.* or newer
//  This script is run to gather any local
//  component config.json (for custom components)
//  or config-ext.json (for alternate design system extensions to OOTB components)
//  and copy them to COMPONENTS_ROOT_TARGET so they can be served up as
//  static content by the component-config-server. During app authoring,
//  Infinity will access these config files as needed via the component-config-server


function processConfigExtFiles() {
  // 1. Delete existing COMPONENTS_ROOT dir so we start fresh
  fsp.rm(COMPONENTS_ROOT_TARGET, {recursive:true}).then(
    function() {
      console.log(`${LOG_PRELUDE} deleted ${COMPONENTS_ROOT_TARGET}`);
      // 2. Create fresh COMPONENTS_ROOT dir
      createCompsRoot();
    }
    ).catch(function(error) {
      console.log(`${LOG_PRELUDE} error deleting ${COMPONENTS_ROOT_TARGET}: ${error.message}`);
    }
  )
}

function createCompsRoot() {
  fsp.mkdir(COMPONENTS_ROOT_TARGET, {recursive: true}).then(
    function() {
      console.log(`${LOG_PRELUDE} created ${COMPONENTS_ROOT_TARGET} `);
      // 3. Gather/process config.json and config-ext.json files
      gatherConfigFiles()
      gatherConfigExtFiles();
    }
  ).catch( function(error) {
    console.log(`${LOG_PRELUDE} error creating ${COMPONENTS_ROOT_TARGET}: ${error.message}`);
  });
}


function gatherConfigFiles() {
  // Need to get config.json files from 2 places: custom components and override components
  //  Don't want config.json from custom-constellation since they will have name collisions
  //  with the custom component's config.json

  // const COMPONENTS_CUSTOM_DIR = "custom";
  // const COMPONENTS_OVERRIDE_DIR = "override";

  // Look for an process any Custom component configs
  const jsFilesCustom = fg.sync(`${COMPONENTS_ROOT_SOURCE}/${COMPONENTS_CUSTOM_DIR}/**/${CONFIG_NAME}`);

  jsFilesCustom.forEach( file => {
    // console.log(`${LOG_PRELUDE} found file: ${file}`);
    copyConfigRelatedFile(file);
  });

  // Look for an process any override component configs
  const jsFilesOverride = fg.sync(`${COMPONENTS_ROOT_SOURCE}/${COMPONENTS_OVERRIDE_DIR}/**/${CONFIG_NAME}`);

  jsFilesOverride.forEach( file => {
    // console.log(`${LOG_PRELUDE} found file: ${file}`);
    copyConfigRelatedFile(file);
  });

}


function gatherConfigExtFiles() {
  const jsFiles = fg.sync(`${COMPONENTS_ROOT_SOURCE}/**/${CONFIG_EXT_NAME}`);

  jsFiles.forEach( file => {
    // console.log(`${LOG_PRELUDE} found file: ${file}`);
    copyConfigRelatedFile(file);
  })
}

function createDirectory(dir) {
  fsp.mkdir(dir).then(
    function() {
      console.log(`${LOG_PRELUDE} created ${dir} `);
    }
  ).catch( function(error) {
    console.log(`${LOG_PRELUDE} error creating ${dir}: ${error.message}`);
  });
}

function copyConfigRelatedFile(srcFile) {
  // console.log(`${LOG_PRELUDE} start copy of ${srcFile}`);
  const fileInfo = path.parse(srcFile);
  const pathParts = fileInfo["dir"].split('/');
  // get the name of the component directory (which is the last entry in the pathParts array)
  const componentDirName = pathParts[pathParts.length - 1];
  const targetDir = `${COMPONENTS_ROOT_TARGET}/${componentDirName}`;
  // See if we need to create the directory
  const bTargetDirExists = fs.existsSync(targetDir);

  // If necessary, create the directory synchronously
  if (!bTargetDirExists) {
    const msg = fs.mkdirSync(targetDir);
    if (msg) {
      console.log(`${LOG_PRELUDE} error creating ${targetDir}: ${message}`);
    }
    const foo = 0;
  }
  // At this point, the targetDir should exist so copy the file to it

    // get the file name (base) and append to target
    const fileBasename = fileInfo.base;
    const dest = `${targetDir}/${fileBasename}`;

    fsp.copyFile(srcFile, dest, fs.constants.COPYFILE_EXCL).then(
      function() {
        console.log(`${LOG_PRELUDE} copied to ${dest}`);
      }
    ).catch(
      function(error) {
        console.log(`${LOG_PRELUDE} error copying file: ${error.message} `);

      }
    );
}


// First delete and create an empty COMPONENTS_ROOT
//  Then proceed with looking for config-ext.js files
//  and copying to appropriate path

processConfigExtFiles();
