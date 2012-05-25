var c_width = 850;
		var c_height = 315;
		var rows;
		var columns;
		var stage;
		var urls;
		var KineticImages = new Array();
		var offset = 3;
		var ajax = true;
		var draggingShape;
		var layer;
		var startingOffset;
		var complexText;
		var hasmessage = true;
		var layer1;
		
		$(document).ready(function(){
			

			$('body').live('imagesLoaded', function(){
				layer = new Kinetic.Layer();
				for(var i=0;i<columns*rows;i++){		
					placeTile(i,0,0);
				}
				layer.setZIndex(1);
				
			
			});
			$("#init").click(function(){
				rows = $("#rows").val();
				columns = $("#columns").val();
				init();	
				$("#loader").html('Loading Data... <img src="images/loader.gif" />');
				if(ajax){
					$.getJSON("dataLoader.php?lender="+$('#username').val(), function(json) {
						$("#loader").html('Loading Images....<img src="images/loader.gif" />');
						urls = json;
						populateImages();
					});
				}
				else{
					urls = ["images\/7093dc8958f00d4f2d7c5f98e0d727bb\/1094500.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/1086156.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/1034796.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/1002197.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/994948.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/988523.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/927971.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/927690.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/902726.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/872546.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/867045.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/858893.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/847612.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/804749.jpg","images\/7093dc8958f00d4f2d7c5f98e0d727bb\/800832.jpg"];
					populateImages();
				}				
				$("#main").fadeIn();
				
				$("#inittools").fadeOut();
				
				
				});			
			$('#clickme').click(function(){
				layer1 = new Kinetic.Layer();

				if($("#message").val() != ''){
					var messageText = new Kinetic.Text({
						  x: 0,
						  y: c_height/2,
						  fill: "#000",
						  text: $("#message").val(),
						  fontSize: 40,
						  fontFamily: "Calibri",
						  textFill: "#FFF",
						  padding: 15,
						  align: "left",
						  alpha: 0.8,
						  verticalAlign: "middle",
						  fontStyle: "italic",
						  textStroke: "#FFFFFF",
						  textStrokeWidth: 2,
						  centerOffset: {x:0,y:0},
						});
						layer1.add(messageText);
					}	
				// add the shapes to the layer
				if($("#title").val() != ''){
					var titleText = new Kinetic.Text({
					  x: 0,
					  y: c_height/2 - 48,
					  fill: "#000",
					  text: $("#title").val(),
					  fontSize: 20,
					  fontFamily: "Calibri",
					  textFill: "#FFF",
					  padding: 5,
					  align: "left",
					  alpha: 0.8,
					  verticalAlign: "middle",
					  fontStyle: "italic",
					  textStroke: "#FFFFFF",
					  textStrokeWidth: 2,
					  centerOffset: {x:0,y:0},
					});
					layer1.add(titleText);
				}
				stage.add(layer1);
				
				stage.toDataURL(function(dataUrl) {
					window.open(dataUrl);
					stage.remove(layer1);
				});
				
			});
			
			$('.undefine').mouseover(function(){draggingShape = undefined; startingOffset = undefined;});
		});
		
		function populateImages(){
			var i;
			for( i = 0; i < urls.length; i++){
				loadTile(i);
			}  
		}
		
		
		
		function loadTile(i){
			var imageObj = new Image();
			var KineticImage = undefined;
			imageObj.src = urls[i]; 
			imageObj.onload = function() {
				KineticImage = new Kinetic.Image({
							image: imageObj,
							width: imageObj.width,
							height: imageObj.height,
							listen : true,
							zIndex: 1,
							alpha: 1,
							
				});
				KineticImage.__id = i;
				KineticImage.__scale = 1;
				KineticImage.__x = 0;
				KineticImage.__y  = 0;
				KineticImage.on("mouseover", function(){
           			document.body.style.cursor = "pointer";
            	});
            	KineticImage.on("mouseout", function(){
                	document.body.style.cursor = "default";
					//draggingShape = undefined;
                	//startingOffset = undefined;
                	
           		});
           		KineticImage.on("mousedown", function(){
                	//placeTile(i,-10,-20);
                	draggingShape = this;
                	startingOffset = stage.getMousePosition();

           		});
           		KineticImage.on("mouseup", function(){
                	//placeTile(i,-10,-20);
                	draggingShape = undefined;
                	startingOffset = undefined;
           		});
           		KineticImage.on("mousemove", function(evt){
           			if(draggingShape != undefined){
						var offset = stage.getMousePosition();
						if(offset.x-startingOffset.x != 0 && offset.y-startingOffset.y != 0){
							placeTile(draggingShape.__id,offset.x-startingOffset.x,offset.y-startingOffset.y);
						}
                	}
                });
                
                KineticImage.on("dblclick", function(evt){
           			if(this.__scale == 2){
           				this.__scale = 0.5;
           			}else{
           				this.__scale = this.__scale * 2;
           			}
           			this.getLayer().draw();
                });
                
                
                
				KineticImages[i] = KineticImage;
		
				//$("#loader").animate({width:(KineticImages.length/urls.length)*100+'%' },50);
				if(KineticImages.length == urls.length) {
					$("#loader").html('All Images loaded ...');
					$('body').trigger('imagesLoaded');
				}
			} 
		}
 			
 		function init(){
			stage = new Kinetic.Stage({
			  container: "mycanvas",
			  width: c_width,
			  height: c_height,
			});
			stage.on("mouseout", function(evt){
				evt.cancelBubble = true;
            	draggingShape = undefined;
	            startingOffset = undefined;
        	},false);
			// Init layer
			var layer = new Kinetic.Layer();
			// add a background color to rect..
			var bgrect = new Kinetic.Rect({
				width: c_width,
				height:c_height,
				fill: "#E7EBF2"}); 
			layer.add(bgrect);
			stage.add(layer);
		}
		function placeTile(i,left,top){
			var KineticImage = KineticImages[i];
			var c_column = i % columns;
			var c_row = parseInt(i/columns);
			var c_x = c_column * (c_width/columns);
			var c_y = c_row * (c_height/rows);
			KineticImage.setDrawFunc(function(){
				context = this.getContext();
				 var innerColor = "rgba(0,0,0,1)";
				context.beginPath();
				context.rect(c_x, c_y,c_width/columns, c_height/rows);
				context.clip();				
				context.drawImage(KineticImage.getImage(),c_x+left+(left-this.__x), c_y+top+(top-this.__y),KineticImage.getImage().width * this.__scale , KineticImage.getImage().height * this.__scale);
				this.__x = left;
           		this.__y = top;
           		
			});
			
			layer.add(KineticImage);
			stage.add(layer);
		}
		