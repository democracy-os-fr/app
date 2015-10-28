import Store from '../store/store';
import request from '../request/request';

/**
 * Use findAll with to
 */

class CommentStore extends Store {
  name () {
    return 'comment';
  }

  /**
   * Get all replies
   *
   * @param {String} id
   * @return {Promise} promise
   * @api public
   */
  replies (id) {
    let promise = new Promise((resolve, reject) => {
      request
        .get(`${this.url(id)}/replies`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            resolve(item);
          });
        });
    });

    return promise;
  }

  /**
   * Find all the comments of the current user
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  findUserComments (...args) {
    let url = this.url('mine', ...args);

    if (this._fetches.get(url)) return this._fetches.get(url);

    let fetch = this._fetch(url);

    return fetch;
  }

  /**
   * Find all sidecomments corresponding to a topic
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  sideComments (...args) {
    let url = this.url('sidecomments', ...args);

    if (this._fetches.get(url)) return this._fetches.get(url);

    let fetch = this._fetch(url);

    return fetch;
  }

  comment (topicId, comment) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(this.url())
        .query({topicId: topicId})
        .send(comment)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            this.set(id, item);
            resolve(item);
          });
        });
    });

    return promise;
  }

  reply (id, reply) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/reply`)
        .send({reply: reply})
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            resolve(item);
          });
        });
    });

    return promise;
  }

  vote (id, voting) {
    return this._simplePostWrapper(id, voting);
  }

  flag (id, flagging) {
    return this._simplePostWrapper(id, flagging);
  }

  _simplePostWrapper (id, endpoint) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/${endpoint}`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);
          resolve(res);
        });
    });

    return promise;
  }

  edit (id, comment) {
    let promise = new Promise((resolve, reject) => {
      request
        .put(`${this.url(id)}`)
        .send({comment: comment})
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            this.set(id, item);
            resolve(item);
          });
        });
    });

    return promise;
  }

  editReply (commentId, replyId, reply) {
    let promise = new Promise((resolve, reject) => {
      request
        .put(`${this.url(commentId)}/reply/${replyId}`)
        .send({reply: reply})
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            resolve(item);
          });
        });
    });

    return promise;
  }

  destroyReply (commentId, replyId) {
    let promise = new Promise((resolve, reject) => {
      request
        .del(`${this.url(commentId)}/reply/${replyId}`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            resolve(item);
          });
        });
    });

    return promise;
  }
}

export default new CommentStore;
