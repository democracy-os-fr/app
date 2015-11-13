import dom from 'component-dom';
import inserted from 'inserted';
import removed from 'removed';
import mixin from '../utils/mixin';
import { domRender } from '../render/render';

/**
 * Base View Class
 * With basic functionality for templating.
 */

class Base {
  constructor (options = {}) {
    this.options = options;
    this.render();
  }

  /**
   * Create `this.el` using `options.template`
   */

  render () {
    this.el = domRender(this.options.template, this.options.locals);
    inserted(this.el, this._oninsert.bind(this));
  }

  /**
   * Execute `this.switchOn` when
   * `this.el` is inserted
   */

  _oninsert () {
    if (this.switchOn && 'function' === typeof this.switchOn) {
      this.switchOn();
    }
    removed(this.el, this._onremove.bind(this));
  }

  /**
   * Execute `this.switchOff` when
   * `this.el` is removed
   */

  _onremove () {
    if (this.switchOff && 'function' === typeof this.switchOff) {
      this.switchOff();
    }
    inserted(this.el, this._oninsert.bind(this));
  }
}

export const mixins = {
  appendable: {
    constructor () {
      if (this.options.container) this.appendTo(this.options.container);
    },

    appendTo (el) {
      el.appendChild(this.el);
      return this;
    }
  },

  emptyable: {
    empty () {
      dom(this.el).empty();
      return this;
    }
  },

  removeable: {
    remove () {
      dom(this.el).remove();
      return this;
    }
  },

  withEvents: {
    bind (...args) {
      dom(this.el).on(...args);
    },

    unbind (...args) {
      dom(this.el).off(...args);
    }
  }
};

/**
 * View Mixin, allows to compose a complex view.
 *
 * E.g.:

import view from '../view/mixin';

class Sidebar extends view('appendable', 'emptyable') {
  // Own implementation
}

**/

export default function view(...names) {
  return mixin(Base, ...names.map(name => mixins[name]));
}
