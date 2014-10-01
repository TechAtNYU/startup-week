(function($) {
	var sw = {
		'init' : function() {
			sw.setup();
			//sw.triangles();
		},
		'setup' : function() {
			$(".startup__mask h1").fitText(0.4);
			console.log("<3 <3 <3 <3");
			console.log("<3 u");
			console.log("--tech@NYU");
		},
		'triangles' : function() {
			var paper = Raphael(0,0,2000,500);
			
			console.log("hello")
			paper.circle(0,0,100);
		}
	}
	
	sw.init();
}(jQuery));