# swarm-bee-block-service
Swarm Bee IPLD compatible block service

Forked from `ipfs-block-service`

WIP Work in progress

### Usage

Planned features

- Bee IPLD client wrapper
- Swarm Bee IPLD block service

```javascript
const Ipld = require('ipld')
const bee = require('bee-ipld-client') 
const SwarmBeeBlockService = require('swarm-bee-block-service')

const initIpld = async (ipfsRepoPath) => {
  const repo = new Bee()
  await repo.open()
  const blockService = new SwarmBeeBlockService(repo)
  return new Ipld({blockService: blockService})
}

initIpld('/tmp/ipfsrepo2')
  .then((ipld) => {
    // Do something with the `ipld`, e.g. `ipld.get(…)`
  })
  .catch((error) => {
    console.error(error)
  })

  ```

### Maintainer
Rogelio Morrell / Industrias de Firmas Electronicas SA 2021