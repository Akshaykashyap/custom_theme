/*
** Script js.
*/

(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.it_for_change_theme_custom = {
    attach: function (context, settings) {
     console.log('Hello this is used for testing purpose');
    
    }
  };
})(jQuery, Drupal, drupalSettings);