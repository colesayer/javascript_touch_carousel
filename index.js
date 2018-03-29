window.slider = {};

slider.sliderPanelSelector = '.slider-panel'
slider.sliderPaginationSelector = '.slider-pagination'
slider.sliderBack = '#previous'
slider.sliderNext = '#next'
slider.timing = 3000
slider.sensitivity = 30
slider.activeSlide = 0
slider.slideCount = 0

slider.init = function( selector ) {
  slider.sliderEl = document.querySelector( selector );
  slider.slideCount = slider.sliderEl.querySelectorAll( slider.sliderPanelSelector ).length;

  for( let i = 0; i < slider.slideCount; i++ ) {

    let pageSelector = document.querySelector( slider.sliderPaginationSelector )
    let activeStatus = i === slider.activeSlide ? "is-active" : '';
    let link = document.createElement("a")
    link.setAttribute('data-index', i)
    link.setAttribute('class', activeStatus)
    if(i === 0){
      link.style.color = "black"
    }

    link.onclick = function(){
      clearInterval(animation)
      let linkIndex = link.getAttribute('data-index')
      slider.goTo(linkIndex)
    }

    pageSelector.append(link)
  }

  const sliderNextButton = document.querySelector( slider.sliderNext )
  sliderNextButton.onclick = function(){
    clearInterval(animation)
    slider.goForward()
  }

  const sliderBackButton = document.querySelector( slider.sliderBack )
  sliderBackButton.onclick = function(){
    clearInterval(animation)
    slider.goBack()
  }

  const sliderManager = new Hammer.Manager( slider.sliderEl );
  sliderManager.add( new Hammer.Pan({ threshold: 0, pointers: 0 }) );
  sliderManager.on( 'pan', function( e ) {
    clearInterval(animation)

    let percentage = 100 / slider.slideCount * e.deltaX / window.innerWidth;

    let percentageCalculated = percentage - 100 / slider.slideCount * slider.activeSlide;

    slider.sliderEl.style.transform = 'translateX( ' + percentageCalculated + '% )';

    if( e.isFinal ) {
      if( e.velocityX > 1 ) {
        slider.goTo( slider.activeSlide - 1 );
      } else if( e.velocityX < -1 ) {
        slider.goTo( slider.activeSlide + 1 )
      } else {
        if( percentage <= -( slider.sensitivity / slider.slideCount ) )
          slider.goTo( slider.activeSlide + 1 );
        else if( percentage >= ( slider.sensitivity / slider.slideCount ) )
          slider.goTo( slider.activeSlide - 1 );
        else
          slider.goTo( slider.activeSlide );
      }
    }
  });

  const animation = setInterval(function(){
      slider.goForward()
      }, slider.timing)
};

slider.goTo = function( number ) {

  if( number < 0 )
    slider.activeSlide = 0;
  else if( number > slider.slideCount - 1 )
    slider.activeSlide = slider.slideCount - 1
  else
    slider.activeSlide = number;

 slider.sliderEl.classList.add( 'is-animating' );
 let percentage = -( 100 / slider.slideCount ) * slider.activeSlide;
 slider.sliderEl.style.transform = 'translateX( ' + percentage + '% )';
 clearTimeout( slider.timer );
 slider.timer = setTimeout( function() {
   slider.sliderEl.classList.remove( 'is-animating' );
 }, 400 );

 let pagination = document.querySelectorAll( slider.sliderPaginationSelector + ' > *' );

 for( let n = 0; n < pagination.length; n++ ) {

   if(n === parseInt(slider.activeSlide)){
     pagination[n].className = "is-active"
     pagination[n].style.color = "black"
   } else {
     pagination[n].className = ""
     pagination[n].style.color = "#A9A9A9"
   }

 }
};

slider.goForward = function(){
  if(slider.activeSlide === slider.slideCount - 1){
    slider.goTo(0)
  } else {
    slider.goTo(slider.activeSlide + 1)
  }
}

slider.goBack = function(){
  if(slider.activeSlide === 0){
    slider.goTo(slider.slideCount - 1)
  } else {
    slider.goTo(slider.activeSlide - 1)
  }
}


slider.init( '#slider' );
