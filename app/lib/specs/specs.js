(function(){
	if (FaveBooks.tests_enabled) {
		Ti.include('/jasmine-2.0.0/jasmine.js');
		Ti.include('/jasmine-titanium.js');

		// Include all the test files
		Ti.include('/specs/main_spec.js');

		jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
		jasmine.getEnv().execute();
	}
})();