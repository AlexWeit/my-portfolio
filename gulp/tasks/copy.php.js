'use strict';

module.exports = function() {
  $.gulp.task('copy:php', function() {
    return $.gulp.src('./source/php/**/*.*', { since: $.gulp.lastRun('copy:php') })
      .pipe($.gulp.dest($.config.root + '/assets/php'));
  });
};
