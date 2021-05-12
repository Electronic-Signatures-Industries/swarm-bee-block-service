'use strict'

const map = require('it-map')
const errcode = require('err-code')

/**
 * @typedef {import('ipfs-repo')} IPFSRepo
 * @typedef {import('ipld-block')} Block
 * @typedef {import('cids')} CID
 */

/**
 * BlockService is a hybrid block datastore. It stores data in a local
 * datastore and may retrieve data from a remote Exchange.
 * It uses an internal `datastore.Datastore` instance to store values.
 */
class SwarmBeeBlockService {
  /**
   * Create a new BlockService
   *
   * @param {SwarmConnection} context
   */
  constructor(connection) {
    this._bee = connection
  }

  /**
   * Put a block to the underlying datastore.
   *
   * @param {Block} block
   * @param {object} [options] -  Options is an object with the following properties
   * @param {AbortSignal} [options.signal] - A signal that can be used to abort any long-lived operations that are started as a result of this operation
   * @returns {Promise<Block>}
   */
  put(block, options) {
    return this._bee.blocks.put(block, options)
  }

  /**
   * Put a multiple blocks to the underlying datastore.
   *
   * @param {AsyncIterable<Block> | Iterable<Block>} blocks
   * @param {object} [options] -  Options is an object with the following properties
   * @param {AbortSignal} [options.signal] - A signal that can be used to abort any long-lived operations that are started as a result of this operation
   * @returns {AsyncIterable<Block>}
   */
  putMany(blocks, options) {
    return this._bee.blocks.putMany(blocks, options)
  }

  /**
   * Get a block by cid.
   *
   * @param {CID} cid
   * @param {object} [options] -  Options is an object with the following properties
   * @param {AbortSignal} [options.signal] - A signal that can be used to abort any long-lived operations that are started as a result of this operation
   * @returns {Promise<Block>}
   */
  get(cid, options) {
    return this._bee.blocks.get(cid, options)
  }

  /**
   * Get multiple blocks back from an array of cids.
   *
   * @param {AsyncIterable<CID> | Iterable<CID>} cids
   * @param {object} [options] -  Options is an object with the following properties
   * @param {AbortSignal} [options.signal] - A signal that can be used to abort any long-lived operations that are started as a result of this operation
   * @returns {AsyncIterable<Block>}
   */
  getMany(cids, options) {
    if (!Array.isArray(cids)) {
      throw new Error('first arg must be an array of cids')
    }

    return map(cids, (cid) => this._bee.blocks.get(cid, options))
  }

  /**
   * Delete a block from the blockstore.
   *
   * @param {CID} cid
   * @param {object} [options] -  Options is an object with the following properties
   * @param {AbortSignal} [options.signal] - A signal that can be used to abort any long-lived operations that are started as a result of this operation
   */
  async delete(cid, options) {
    if (!(await this._bee.blocks.has(cid))) {
      throw errcode(
        new Error('blockstore: block not found'),
        'ERR_BLOCK_NOT_FOUND',
      )
    }

    return this._bee.blocks.delete(cid, options)
  }

  /**
   * Delete multiple blocks from the blockstore.
   *
   * @param {AsyncIterable<CID> | Iterable<CID>} cids
   * @param {object} [options] -  Options is an object with the following properties
   * @param {AbortSignal} [options.signal] - A signal that can be used to abort any long-lived operations that are started as a result of this operation
   */
  deleteMany(cids, options) {
    const repo = this._bee

    return this._bee.blocks.deleteMany(
      (async function* () {
        for await (const cid of cids) {
          if (!(await repo.blocks.has(cid))) {
            throw errcode(
              new Error('blockstore: block not found'),
              'ERR_BLOCK_NOT_FOUND',
            )
          }

          yield cid
        }
      })(),
      options,
    )
  }
}

module.exports = BlockService
