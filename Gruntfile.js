module.exports = function(grunt) {
	grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			concat: {
				dist: {
					src: [
						'jsautoload/*/*/*.js'
					],
					dest: 'js/build/<%= pkg.name %>.js'
				}
			 },
			
			uglify: {
				options: {
					// the banner is inserted at the top of the output
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
					mangle: false
				  },
			  dist: {
				files: {
				  'js/build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			  }
			}

		});

	// 3. Where we tell Gruut we plan to use this plug-in.
	 grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', ['concat', 'uglify']);

};

