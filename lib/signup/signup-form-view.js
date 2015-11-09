import t from 't-component';
import o from 'component-dom';
import title from '../title/title.js';
import FormView from '../form-view/form-view.js';
import template from './signup-form.jade';

import countries from '../data-country/data.js';

export default class SignupForm extends FormView {

  /**
   * Proposal Comments view
   *
   * @return {SignupForm} `SignupForm` instance.
   * @api public
   */

  constructor (reference) {
    super(template, { reference: reference });
  }

  switchOn () {
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
          o('#country.error ~ span.error').remove();
          o('#country.error').removeClass('error');
          o('#th-country.error').removeClass('error');
        } else {
          if(!data){
            jQuery('#country').val("");
          }
        }
    }).data('bloodhound',bloodhound);

    jQuery('#country').on('error',function(){
      console.log('ERROR !!!');
    });

    this.on('success', this.bound('showSuccess'));

  }

  /**
   * Show success message
   */

  showSuccess () {
    let form = this.find('#signup-form');
    let success = this.find('#signup-message');
    let welcomeMessage = this.find('#signup-message h1');
    let firstName = this.get('firstName');
    let lastName = this.get('lastName');
    let email = this.get('email');
    let fullname = firstName + ' ' + lastName;
    let message = t('signup.welcome', { name: fullname });

    analytics.track('signup', {
      email,
      firstName,
      lastName
    });

    title(t('signup.complete'));
    welcomeMessage.html(message);
    form.addClass('hide');
    success.removeClass('hide');
  }
}
