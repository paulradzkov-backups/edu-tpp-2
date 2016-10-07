/* 
*/
$(document).ready(function() {
	/* slider на главной странице */
  	$('#slides').fluidSlider({
		capture:'slides', 	//same as id
		delay:300,			//animation
		duration:4000,		//time to show each slide
		pagination:true
	});
	
	/* labels над input */
	/* форма авторизации:  */
	var jslabels = $(".jslabels input.jsfield");
	$(jslabels).each(function() {
		if($(this).val() !== '') { /* если инпуты не пустые */
			$(this).prev("label").css('visibility','hidden'); /* прячем лэйблы */
		}	
		$(this).focus(function() {
			$(this).prev("label").css('visibility','hidden');
		});
		$(this).blur(function() {
			if($(this).val() === '') {
				$(this).prev("label").css('visibility','visible');				
			}
		});
	});


	/* Local scroll */
	$('#allpage').localScroll({offset:-50});
	
	/* Darkbox */
	$( 'a[rel=darkbox]' ).darkbox();
	
	/* expanding «more» link */
	$('.js-more').toggle()						//свернуть при загрузке
		.after('<p class="js-more-less"><a href="#js-more-less" class="js-more">Показать еще</a></p>') //добавить ссылку для разворачивания контента
		.next('p').find('a').click(function() { 	//найти ссылку и повесить на нее функцию
			if($(this).hasClass('js-more')) { 		// если надо развернуть
				$(this).toggleClass('js-more js-less').text('Свернуть');
			} else {								// если надо свернуть
				$(this).toggleClass('js-more js-less').text('Показать еще');
			}
			$(this).parent('p').prev('.js-more').slideToggle();
		});
	
	/* collapsing area */
	$('.js-expandable').next('.js-expand-area').toggle().end() 	//свернуть блок
	.addClass('expand')
	.click(function () {
		$(this).toggleClass('expand collapse').next('.js-expand-area').slideToggle('slow');
	});
	/* collapsing area */
	
	/* add class current to links */
	var currURL = location.href;
	var arrURL = $("ul.services a, ul.mainmenu a");
   
    $.each(arrURL, function(i) {
        var str = arrURL[i].href;
		if (!currURL.localeCompare(str)) {
				 arrURL[i].href = "#";
				 $(arrURL[i]).parent().addClass("current");
		   }
    });	

	/* end links */
});

$(window).load(function() {
	rollContent(); //запустить скроллер когда все загрузится
});

var logos = $('#logoscroller .logos');
var lmain;
var lsecond;
var roller;
var rollwidth;


function stopRoll() { //пока не используется
	clearInterval(roller);
}

function roll() {
	var mOffset = parseFloat(lmain.css("left"));
	var sOffset = parseFloat(lsecond.css("left"));
	lmain.css({left:(1 + mOffset) + "px"});
	lsecond.css({left:(1 + sOffset) + "px"});
	if (mOffset >= rollwidth) {
		lmain.css({left: "-" + rollwidth + "px"});
	}

	if (sOffset >= rollwidth) {
		lsecond.css({left: "-" + rollwidth + "px"});
	}
}

function rollContent() {
	rollwidth = logos.width();
	logos.addClass('part1').css({left:0})
	.clone().insertAfter(logos).removeClass('part1').addClass('part2').css({left: rollwidth});
	lmain = $('#logoscroller .part1');
	lsecond = $('#logoscroller .part2');
	roller = setInterval('roll()', 40);	
}












