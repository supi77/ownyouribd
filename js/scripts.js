$(function(){
    // check if mobile
    var isMob = $('.main-content > .container').outerWidth(true) < 768 ? true : false;
    // graceful fallback for non-CSS3 browsers
    if(!checkAnimationSupport()){
        $('.aeroplane').css({'left': '42%'});
        $('.cloud1').css({'left': '31%'});
        $('.cloud2, #balloon1, #balloon2, #balloon3, #sun').hide();
    }
    // clear sun animations for every new cycle
    $('#sun').on('animationend MSAnimationend oanimationend webkitAnimationEnd', function(e){
        $('#sun').removeClass('move-sun').removeClass('move-sun-slower');
    });
    // animate plane and balloons
    $('#balloon1, #balloon2, #balloon3')
        .on('animationend MSAnimationend oanimationend webkitAnimationEnd', function(){
            var id = $(this).attr('id');
            $(this).removeClass('move-'+id);
            id = (id == "balloon3") ? "balloon1" : (id == "balloon2") ? "balloon3" : "balloon2";
            setTimeout(function(){
                $('#plane').one('animationend MSAnimationend oanimationend webkitAnimationEnd', function(){
                    $(this).removeClass('move-plane');
                    setTimeout(function(){
                        $('#'+id).addClass('move-'+id);
                    }, 0);
                });
                $('#plane').addClass('move-plane');
            }, 0); //animations are only drawn on the next process tick
        });
    //set height of background
    setBgHeight();
    $(window).on('resize', setBgHeight);
    // prepare modal
    var currentUrl = "", newWin = false;
    $('.modal-footer button.btn-warning').click(function(){
        if(currentUrl != "#"){
            newWin ? window.open(currentUrl, '_blank') : window.location.href = currentUrl;
            newWin = false;
        }
        $('#promptModal').modal('hide');
    });
    // get countries list
    $.get("xml/countries.xml", function(data){
        var countryArr = $(data).find('country');
        countryArr.each(function(i){
            $('.dropdown-menu').append('<li><a href="'+$(countryArr[i]).attr('url')+
                '" class="'+$(countryArr[i]).attr('popup')+'">'+countryArr[i].innerHTML+'</a></li>')
        });
        $('.dropdown-menu li a, a.new-win').click(function(e){
            e.preventDefault();
            currentUrl = $(this).attr('href');
            if($(this).hasClass("new-win")) newWin = true;
            $(this).hasClass("no-popup") ? window.open(currentUrl, '_blank') : $('#promptModal').modal();
        });
    });
    // utility function to check animation support in browser
    function checkAnimationSupport(){
        var animation = false, animationstring = 'animation',
            keyframeprefix = '', domPrefixes = 'Webkit Moz O ms Khtml'.split(' '), pfx  = '',
            elm = document.createElement('div');

        elm.style.animationName !== undefined ? animation = true : '';

        if( animation === false ) {
            for( var i = 0; i < domPrefixes.length; i++ ) {
                if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                    pfx = domPrefixes[ i ];
                    animationstring = pfx + 'Animation';
                    keyframeprefix = '-' + pfx.toLowerCase() + '-';
                    animation = true;
                    break;
                }
            }
        }
        return animation;
    }
    // utility function to set bg height
    function setBgHeight(){
        !isMob ? ($(window).height() > $('.main-content > .container').height() ?
            $('.main-content').height($(window).height()) :
            $('.main-content').height($('.main-content > .container').height())) : '';
    }
    // tree animation
    var secondTime = false;
    $('.tree').each(function(i){
        loopFactory($(this).children(), i)();
    });
    // factory function for tree animation
    function loopFactory(elem, elemPos){
        var next = 1, current = 0, interval = 8000, interval2 = 4000, fadeTime = 6000, imgNum = elem.length;

        return function treeLooper(){
            elem.eq(current).delay(interval)
                .fadeOut(fadeTime, function(){ if(!isMob) bgChanger(elemPos, current); })
                .end().eq(next).delay(interval2).hide().fadeIn(fadeTime, treeLooper);

            (next < imgNum-1) ? next++ : next = 0;
            (current < imgNum-1) ? current++ : current = 0;
        }
    }
    // utility function to change sky and grass colors
    function bgChanger(elemPos, curr){
        if(elemPos == 0){
            switch(curr){
                case 1:
                case 2:
                    $('.sky').animate({backgroundColor:'#cdeafe'}, 6000);
                    $('.grass').animate({backgroundColor:'#4f6c53'}, 6000);
                    break;
                case 4:
                    $('.sky').animate({backgroundColor:'#b2cfdd'}, 6000);
                    $('.grass').animate({backgroundColor:'#eef2f2'}, 6000);
                    break;
                case 6:
                    if(secondTime) {
                        $('#sun').addClass('move-sun-slower');
                        secondTime = false;
                    }
                    else secondTime = true;
                    $('.sky').animate({backgroundColor:'#91DEF4'}, 6000);
                    $('.grass').animate({backgroundColor:'#77C16C'}, 6000);

                    break;
                default:
                    break;
            }
        }
    }
});
