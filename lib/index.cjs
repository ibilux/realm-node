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

const utils = require('realm-node/lib/utils.cjs');

function getRealmConstructor(environment) {
  switch (environment) {
    case 'node.js':
    case 'electron':
      /* try {
        try {
          return require("bar/realm.node").Realm;
        } catch (e) {
          console.log('realm require:', e);
        }
        try {
          return require.resolve("bar/realm.node").Realm;
        } catch (e) {
          console.log('realm resolve:', e);
        }
        try {
          return require("realm-node/lib/bindings.cjs")("realm.node").Realm;
        } catch (e) {
          console.log('realm bindings:', e);
        }
        try {
          const module = require("module");
          const req = module.createRequire(process.cwd());
          return req("bar/realm.node").Realm;
        } catch (e) {
          console.log('realm create require:', e);
        }
      } catch (e) {
        console.log('realm constructor:', e);
      } */
      /* const os = require('os');
      const path = require('path');
      const module = { exports: {} };
      process.dlopen(module, "/run/media/hq/pro/dev/svelte/iSTORE/build/realm.node", os.constants.dlopen.RTLD_NOW); */
      /* const module = require("module");
      const req = module.createRequire(process.cwd());
      return req("/run/media/hq/pro/dev/svelte/iSTORE/build/realm.node").Realm; */
      //return require.resolve("build/Release/realm.node").Realm;
      return require('build/Release/realm.node').Realm;
    case 'jscore':
      return global.Realm;
    default:
      throw new Error('Unexpected execution environment (' + environment + ')');
  }
}

const environment = utils.getEnvironment();
const realmConstructor = getRealmConstructor(environment);

require('realm-node/lib/extensions.cjs')(realmConstructor, environment);

const versions = utils.getVersions();
realmConstructor.App._setVersions(versions);

module.exports = realmConstructor;
