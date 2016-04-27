module.exports = function(grunt) {

  grunt.initConfig({
    git_changelog: {
      minimal: {
        options: {
          file: 'MyChangelog.md',
          app_name : 'Git changelog',
          logo : 'https://github.com/rafinskipg/git-changelog/raw/master/images/git-changelog-logo.png',
          intro : 'fas app is a product to provide financial assets service. :)'
        }
      },
      extended: {
        options: {
          repo_url: 'http://192.168.64.208/tianjin/fas-app.git',
          app_name : 'fas app extended',
          file : 'EXTENDEDCHANGELOG.md',
          grep_commits: '^fix|^feat|^docs|^refactor|^chore|BREAKING',
          debug: true,
          tag : false //False for commits since the beggining
        }
      },
      fromCertainTag: {
        options: {
          repo_url: 'http://192.168.64.208/tianjin/fas-app.git',
          app_name : 'fas app',
          file : 'tags/certainTag.md',
          tag : 'v0.0.1'
        }
      }
    }
  })
  grunt.loadNpmTasks('git-changelog');
};
