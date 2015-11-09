import debug from 'debug';
import t from 't-component';
import user from '../user/user.js';
import FormView from '../form-view/form-view';
import template from './template.jade';
import config from '../config/config';

import countries from '../data-country/data.js';

let log = debug('democracyos:settings-profile');

export default class ProfileForm extends FormView {

  /**
   * Creates a profile edit view
   */

  constructor () {
    super(template);
  }

  /**
   * Turn on event bindings
   */

  switchOn () {
    this.on('success', this.bound('onsuccess'));
    this.locales = this.find('select#locale')[0];

    config.availableLocales.forEach((locale) => {
      var option = document.createElement('option');
      option.value = locale;
      option.innerHTML = t(`settings.locale.${locale}`);
      this.locales.appendChild(option);
    });

    this.locales.value = user.locale || config.locale;
    var selected = this.find(`option[value="${this.locales.value}"]`);
    selected.attr('selected', true);

    var bloodhound = new Bloodhound({
      identify: function(obj){
        return obj.name ;
      },
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      // url points to a json file that contains an array of country names, see
      // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
      // prefetch: 'https://raw.githubusercontent.com/umpirsky/country-list/master/country/cldr/en/country.json'
      local : countries
    });

    // passing in `null` for the `options` arguments will result in the default
    // options being used

    // http://stackoverflow.com/questions/21895025/use-different-value-from-json-data-instead-of-displaykey-using-typeahead

    jQuery('#th-country').typeahead({
      classNames: {
        menu: 'panel panel-default',
        suggestion: 'panel-body',
        cursor: 'bg-primary'
      }
    },
    {
      // Datasets
      name: 'countries',
      source: bloodhound,
      display: 'name'
    }).on('typeahead:select', function(event, data){
        console.log('select : ' + data.code);
        //jQuery('#country').val(data.code);
    }).on('typeahead:change', function(event, data){
        console.log('change :');
        var result = jQuery('#th-country').data('bloodhound').get(data) ;
        console.debug(result) ;
        if(result.length){
          jQuery(this).typeahead('val', result[0].name);
          jQuery('#country').val(result[0].code);
        } else {
          if(!data){
            jQuery('#country').val("");
          }
        }
    }).data('bloodhound',bloodhound);

  }

  /**
   * Turn off event bindings
   */

  switchOff () {
    this.off();
  }

  /**
   * Handle `error` event with
   * logging and display
   *
   * @param {String} error
   * @api private
   */

  onsuccess () {
    log('Profile updated');
    user.load('me');

    user.once('loaded', () => {
      this.find('img').attr('src', user.profilePicture());
      this.messages([t('settings.successfuly-updated')], 'success');

      if (user.locale && user.locale !== config.locale) {
        setTimeout(function(){
          window.location.reload();
        }, 10);
      }
    });
  }

  /**
   * Sanitizes form input data. This function has side effect on parameter data.
   * @param  {Object} data
   */

  postserialize (data) {
    data.firstName = data.firstName.trim().replace(/\s+/g, ' ');
    data.lastName = data.lastName.trim().replace(/\s+/g, ' ');
  }
}
