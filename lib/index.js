////////////////////////////////////////////////////////////////////////////
//
// Copyright 2016 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

const utils = require('@ibilux/realm-node/lib/utils.cjs');
const { resolve } = require('path');

function bindings() {
  const paths = [
    // prebuild
    'realm.node',
    'prebuilt/realm.node',
    // prebuild install
    'build/Release/realm.node',
    // node-gyp's linked version in the "build" dir
    'node_modules/realm/build/realm.node',
    // node-waf and gyp_addon (a.k.a node-gyp)
    'node_modules/realm/build/Debug/realm.node',
    'node_modules/realm/build/Release/realm.node',
    // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
    'node_modules/realm/lib/binding/nodePreGyp/realm.node'
  ];

  for (let i = 0; i < paths.length; i++) {
    try {
      return require(resolve(process.cwd(), paths[i]));
    } catch (e) {
      if (
        e.code !== 'MODULE_NOT_FOUND' &&
        e.code !== 'QUALIFIED_PATH_RESOLUTION_FAILED' &&
        !/not find/i.test(e.message)
      ) {
        throw e;
      }
    }
  }

  throw new Error('Could not locate the bindings file.');
}

function getRealmConstructor(environment) {
  switch (environment) {
    case 'node.js':
    case 'electron':
      return bindings().Realm;
    case 'jscore':
      return global.Realm;
    default:
      throw new Error('Unexpected execution environment (' + environment + ')');
  }
}

const environment = utils.getEnvironment();
const realmConstructor = getRealmConstructor(environment);

require('@ibilux/realm-node/lib/extensions.cjs')(realmConstructor, environment);

const versions = utils.getVersions();
realmConstructor.App._setVersions(versions);

module.exports = realmConstructor;
