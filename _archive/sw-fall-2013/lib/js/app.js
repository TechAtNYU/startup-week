$(".splash .title, .name").lettering();
var c = "";
$(".splash .title span").each(function() {
	$(this).append("<em>"+$(this).text()+"</em>");
});

if ($("body").width() < 640) {
	$(".splash .title span:nth-child(6)").after("<br> -");
}

(function($){
	var subway = {
		'config' : {
			eighth: "#2850AD",
			seventh: "#EE352E",
			sixth: "#FF6319",
			broadway: "#FCCC0A",
			lexington: "#00933C",
			flushing: "#B933AD",
			canarsie : "#A7A9AC",
			crosstown: "#6CBE45",
			nassau: "#996633"
		},
		'init' : function() {
			$( ".subway:contains('L')" ).css( "background", subway.config.canarsie );
			$( ".subway:contains('A')" ).css( "background", subway.config.eighth );
			$( ".subway:contains('C')" ).css( "background", subway.config.eighth );
			$( ".subway:contains('E')" ).css( "background", subway.config.eighth );
			$( ".subway:contains('1')" ).css( "background", subway.config.seventh );
			$( ".subway:contains('2')" ).css( "background", subway.config.seventh );
			$( ".subway:contains('3')" ).css( "background", subway.config.seventh );
			$( ".subway:contains('4')" ).css( "background", subway.config.lexington );
			$( ".subway:contains('5')" ).css( "background", subway.config.lexington );
			$( ".subway:contains('6')" ).css( "background", subway.config.lexington );
			$( ".subway:contains('B')" ).css( "background", subway.config.sixth );
			$( ".subway:contains('D')" ).css( "background", subway.config.sixth );
			$( ".subway:contains('F')" ).css( "background", subway.config.sixth );
			$( ".subway:contains('M')" ).css( "background", subway.config.sixth );
			$( ".subway:contains('N')" ).css( "background", subway.config.broadway ).css("color", "black");
			$( ".subway:contains('Q')" ).css( "background", subway.config.broadway ).css("color", "black");
			$( ".subway:contains('R')" ).css( "background", subway.config.broadway ).css("color", "black");
			$( ".subway:contains('7')" ).css( "background", subway.config.flushing );
			$( ".subway:contains('G')" ).css( "background", subway.config.crosstown );
			$( ".subway:contains('J')" ).css( "background", subway.config.nassau );
			$( ".subway:contains('Z')" ).css( "background", subway.config.nassau );
		},
	
		
	}
	$(document).ready(function() {
		subway.init();
	});
}(jQuery));