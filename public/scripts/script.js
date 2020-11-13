

$(document).ready(() => {
//Upload progress bar
const uploadForm = document.querySelector(".upload-form");

  if (uploadForm) {
    const inpFile = document.querySelector("#track");
    const fill = document.querySelector(".progress-fill");
    const fillTxt = fill.querySelector(".bar-text");

    uploadForm.addEventListener("submit", (e1) => {
      const xhr = new XMLHttpRequest();
      try {
        xhr.open("POST", "/upr/uploads"), 3000;
      } catch (err) {
        console.log(err.message);
      }

      xhr.upload.addEventListener("progress", (e) => {
        const perc = e.lengthComputable ? (e.loaded / e.total) * 100 : 0;

        fill.style.width = perc.toFixed(2) + "%";
        fillTxt.textContent = perc.toFixed(2) + "%";
      });

      xhr.setRequestHeader("Content-Type", "multipart/form-data");
      xhr.send(new FormData(uploadForm));
    });
  }

 
  document.body.addEventListener("click", () => {
    $("div.error").fadeOut(1000);
  });
  $("li").addClass("white-text");
  $(".sidenav").sidenav({
    inDuration: 1000,
    outDuration: 1000,
  });
  $('.collapsible').collapsible()
  $('.track').hover((e)=>{
$(e.target).find('.timebar-cont').css({
  visibility: "visible",
  top: '60%',
})
  }) 
  document.querySelectorAll('.track').forEach(track=>{
    track.addEventListener('mouseleave', (e)=>{
      $(e.target).find('.timebar-cont').css({
        visibility: "hidden",
        top: '100%',
      })
    })
  })
 
  $(".dropdown-trigger").dropdown({
    inDuration: 1000,
    outDuration: 1000,
  });
  $(".modal").modal({
    inDuration: 1000,
    outDuration: 1000,
  });

const suForm = document.querySelector(".su-form");
$(".su-form").submit((e) => {
  e.preventDefault();
  var jqxhr = $.ajax({
    data: {
      username: e.target["username"].value,
      email: e.target["email"].value,
      password: e.target["password"].value,
    },
    type: "POST",
    url: "signup",
    success: function (res) {
      window.location.href = "/";
    },
    error: function (err) {
      let errorTxt = JSON.parse(err.responseText).message;
      $("h7.text-warning").text(errorTxt);
      $("div.error").fadeIn(1000);
    },
  });
});

// Play audio
let players = document.querySelectorAll(".play");
players.forEach((player) => {
  player.addEventListener("click", (e) => {
    let audio =
      e.target.parentElement.parentElement.parentElement.childNodes[1];
          
    $(audio).parents('.track').find('.r-t').css("right", 0)
    $(audio).parents('.track').find('.r-t').css("left", '100%')

    if (e.target.classList.contains("fa-play")) {
      $(e.target).removeClass("fa-play");
      $(e.target).addClass("fa-pause");
      audio.play();
      
    } else {
      $(e.target).addClass("fa-play");
      $(e.target).removeClass("fa-pause");
      audio.pause();
    }
  });
});

//Audio progress
let audios = document.querySelectorAll("audio");
audios.forEach((audio) => {
  audio.addEventListener("timeupdate", (e) => {
    let timer = $(e.target).parents('.track').find('.timer')
    let rt = $(e.target).parents('.track').find('.r-t')
          let icon =  $(e.target.parentElement).find('.play')

    if (e.target.paused){
     icon.addClass('fa-play')
     icon.removeClass('fa-pause')
    }
    else{
icon.removeClass('fa-play')
     icon.addClass('fa-pause')
    }
    console.log()

  $(timer).css(
    "width",
    Math.floor((audio.currentTime / audio.duration) * 100) + "%"
  );
  })
});

$(".timebar .r-t").draggable({
  axis: "x",
  containment: ".timebar",
  appendTo: ".timer",
});

$(".timebar .r-t").draggable({

  drag: function (event, ui) { 
    var xPos =
    (100 * parseFloat($(this).css("left"))) /
      parseFloat($(this).parents('.timebar').css("width")) +
    "%";
    
    let audio = $(this).parents('.track').find('audio')
    audio[0].pause()

 let cTime = parseFloat(xPos)* audio[0].duration / 100
      $(audio[0]).addClass("fa-play");
      $(audio[0]).removeClass("fa-pause");
 
    
 audio[0].currentTime = cTime
$(event.target.parentElement).css('width', xPos)

 event.target.parentElement.parentElement.addEventListener('mouseup', e=>{
  audio[0].play()
    $(audio[0]).removeClass("fa-play");
       $(audio[0]).addClass("fa-pause");
  $(this).css("right", 0)
  $(this).css("left", '100%')
  
 })
 
  }


})

// Handle icons
let icons = document.querySelectorAll("ul.handles li a");
if (icons) {
  icons.forEach((icon) => {
    let hrefList = icon.href.split("/");
    if (
      hrefList[hrefList.length - 1] === "" ||
      hrefList[hrefList.length - 1] === "undefined" ||
      hrefList[hrefList.length - 1] === "discover"
    ) {
      $(icon).addClass("grey-text");
    } else {
      $(icon).removeClass("grey-text");
    }
  });
}


});