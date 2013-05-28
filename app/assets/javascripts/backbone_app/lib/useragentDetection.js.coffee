class App.Lib.useragentDetection

	constructor:->
		bw = new App.Views.useragentDetectionView({browser: $.browser})
		$("#wrapper").append(bw.render().el)