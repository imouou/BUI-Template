cordova.define("cordova-plugin-video-editor.VideoEditor", function(require, exports, module) {
//
//  VideoEditor.js
//
//  Created by Josh Bavari on 01-14-2014
//  Modified by Ross Martin on 01-29-15
//

var exec = require('cordova/exec');
var pluginName = 'VideoEditor';

function VideoEditor() {}

VideoEditor.prototype.transcodeVideo = function(success, error, options) {
  var self = this;
  var win = function(result) {
    if (typeof result.progress !== 'undefined') {
      if (typeof options.progress === 'function') {
        options.progress(result.progress);
      }
    } else {
      success(result);
    }
  };
  exec(win, error, pluginName, 'transcodeVideo', [options]);
};

VideoEditor.prototype.trim = function(success, error, options) {
  var self = this;
  var win = function(result) {
    if (typeof result.progress !== 'undefined') {
      if (typeof options.progress === 'function') {
        options.progress(result.progress);
      }
    } else {
      success(result);
    }
  };
  exec(win, error, pluginName, 'trim', [options]);
};

VideoEditor.prototype.createThumbnail = function(success, error, options) {
  exec(success, error, pluginName, 'createThumbnail', [options]);
};

VideoEditor.prototype.getVideoInfo = function(success, error, options) {
  exec(success, error, pluginName, 'getVideoInfo', [options]);
};

VideoEditor.prototype.execFFMPEG = function(success, error, options) {
  var msg = 'execFFMPEG has been removed as of v1.1.0';
  console.log(msg);
  error(msg);
};

VideoEditor.prototype.execFFPROBE = function(success, error, options) {
  var msg = 'ffprobe has been removed as of v1.0.9';
  console.log(msg);
  error(msg);
};

module.exports = new VideoEditor();

});
