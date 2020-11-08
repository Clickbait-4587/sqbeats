/*
var firebaseConfig = {
  apiKey: "AIzaSyBX4tfQZNUHnRKopID4RrQ-akdzysggV90",
  authDomain: "sketchi-4587.firebaseapp.com",
  databaseURL: "https://sketchi-4587.firebaseio.com",
  projectId: "sketchi-4587",
  storageBucket: "sketchi-4587.appspot.com",
  messagingSenderId: "728507359355",
  appId: "1:728507359355:web:5d2aa890d7f375176f02de",
  measurementId: "G-8EXGEF7MBT",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const store = firebase.firestore();
const storage = firebase.storage().ref();
auth.onAuthStateChanged((user) => {
  if (user) {
    $(".n-logged").addClass("hidden");
    $(".logged").removeClass("hidden");
  } else {
    $(".logged").addClass("hidden");
    $(".n-logged").removeClass("hidden");
  }
  const uploadForm = document.querySelector(".upload-form");
  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      document.reload = false;
      e.preventDefault();

      const file = document.querySelector("#track").files[0];
      const name = uploadForm["title"].value;
      const meta = {
        contentType: file.type,
      };
      storage
        .child(name)
        .put(file, meta)
        .then((snap) => snap.ref.getDownloadURL())
        .then((url) => {
          store
            .collection("Songs")
            .doc(
              `${user.displayName}-${uploadForm["artist"].value}-${uploadForm["title"].value}`
            )
            .set({
              title: uploadForm["title"].value,
              artist: uploadForm["artist"].value,
              facebook: uploadForm["facebook"].value,
              twitter: uploadForm["twitter"].value,
              soundcloud: uploadForm["soundcloud"].value,
              youtube: uploadForm["youtube"].value,
              year: uploadForm["year"].value,
              album: uploadForm["album"].value,
              collaborators: uploadForm["collaborators"].value,
              url: url,
            });
        })
        .then(() => {
          uploadForm.reset();
          console.log("Done!");
        });
    });
  }
});

let items = [];

class UI {
  static displaySongs(items) {
    if (items.length) {
      const html = items
        .map((item) => {
          return `
        <div class="track">
        <div class="track-logo">
          <img src="./images/OILHK60.jpg" alt="headphones logo" />
        
        <div class="player ">
          <audio src=${item.url}></audio>

          <div class="controls">
            <a
              
              class="z-depth-0 btn btn-small transparent"
            >
              <i
                
                class="play transparent fa black-text  fa-play"
                aria-hidden="true"
              ></i>
            </a>
          </div>
        </div>
          </div>

        <div class="desc">
          <p class=" title left">Artist: <span class="sdesc">${item.artist} |${item.title} (${item.year})</span><br>
          Collabos: <span class="sdesc">${item.collaborators}</span><br>
          Album: <span class="sdesc">${item.album}</span>
          <br>
          </p>
         
          </div>

        <ul class="handles right" >
        <li>
        <a href="#"  class="btn z-depth-0 transparent grey-text btn-small download-btn"><i class="fas grey-text text-darken-1 fa-download"></i></a>
          
        </li>
        <li>
        <a target="_blank" href="https://www.facebook.com/squashetonics"><i class="fab fa-facebook"></i></a>
    </li>
    <li>
      <a target="_blank" href=${item.twitter}><i class="fab fa-twitter"></i></a>
  </li>
  <li>
      <a target="_blank" href=${item.soundcloud}><i class="fab fa-soundcloud"></i></a>
  </li>
  <li>
      <a target="_blank" href=${item.youtube}><i class="fab fa-youtube"></i></a>
  </li>
        </ul>
        
      </div>
        `;
        })
        .join("");
      $(".tracks").html(html);
    } else {
      $(".tracks").html(
        "<p class='flow-text white-text'>No Songs to show...</p>"
      );
    }
  }

  static playPause() {
    let players = document.querySelectorAll(".play");
    players.forEach((player) => {
      player.addEventListener("click", (e) => {
        e.target.dow
        let audio =
          e.target.parentElement.parentElement.parentElement.childNodes[1];
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
  }

  static browseSongs() {
    $(".search-bar").keyup((e) => {
      let searchString = e.target.value;
      let filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchString.toLowerCase()) ||
          item.artist.toLowerCase().includes(searchString.toLowerCase())
      );

      this.displaySongs(filtered);
      this.playPause();
    });
  }

  static startApp() {
    items = sessionStorage.getItem("Songs")
      ? JSON.parse(sessionStorage.getItem("Songs"))
      : [];
    this.playPause();
    this.displaySongs(items);
  }
}
class Storage {
  saveToSessionStorage(items) {
    sessionStorage.setItem("Songs", JSON.stringify(items));
  }
}
$(document).ready(() => {
  $("li").addClass("white-text");
  $(".sidenav").sidenav({
    inDuration: 1000,
    outDuration: 1000,
  });
  $(".modal").modal({
    inDuration: 1000,
    outDuration: 1000,
  });
  //The profile page
  let splitedLocation = window.location.href.split("/");
  let page = splitedLocation[splitedLocation.length - 1];

  $(".username").html(`Username: <span class="sdesc">${page}</span>`);
  $(".user-brand").text(page);
  //Get data from firebase and save to sessionStorage
  let sto = new Storage();
  try {
    store
      .collection("Songs")
      .get()
      .then((snap) => {
        snap.docs.forEach((doc) => {
          items.push(doc.data());
        });
      })
      .then(() => {
        sto.saveToSessionStorage(items);
        //console.log(items);
      })
      .then(() => {
        UI.startApp();
      })
      .then(() => {
        
        UI.playPause();
      })
      .then(() => {
        //Disabling icons if no handles provided

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
  } catch (err) {
    console.log(err.message);
  }

  $(".controls").hover(
    (e) => {
      let img =
        e.target.parentElement.parentElement.parentElement.children[0]
          .children[0];

      $(img).css("opacity", "0.1");
      //$(".track-logo img").css("opacity", 0.2);
    },
    () => {
      $(".track-logo img").css("opacity", 1);
    }
  );
  //Download
  $('.download-btn').click((e)=>{
    console.log("e.target.parentElement")
  })

  //Browsing discover
  UI.browseSongs();
 //Display User songs
  store
    .collection("Songs")
    .get()
    .then((snap) => {
      let songs = [];
      snap.docs.forEach((doc) => {
        if (doc.id.split("-")[0] == page) {
          songs.push(doc.data());
        }
      });
      return songs;
    })
    .then((songs) => {
      songs.map((song) => {
        let something = `
        
        <li class="white-text"><a class="white-text" >${song.title}</a></li>
        
        `;
        $(".songs").append(something);
      });
    });
});
*/

$(document).ready(() => {
  const uploadForm = document.querySelector(".upload-form");

  /**
   * 
   *   if (uploadForm) {
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
        //console.log(e);]
        const perc = e.lengthComputable ? (e.loaded / e.total) * 100 : 0;

        fill.style.width = perc.toFixed(2) + "%";
        fillTxt.textContent = perc.toFixed(2) + "%";
      });

      xhr.setRequestHeader("Content-Type", "multipart/form-data");
      xhr.send(new FormData(uploadForm));
    });
  }

   */

  document.body.addEventListener("click", () => {
    $("div.error").fadeOut(1000);
  });
  $("li").addClass("white-text");
  $(".sidenav").sidenav({
    inDuration: 1000,
    outDuration: 1000,
  });
  $(".modal").modal({
    inDuration: 1000,
    outDuration: 1000,
  });
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
      console.log(res);
    },
    error: function (err) {
      let errorTxt = JSON.parse(err.responseText).message;
      $("h7.text-warning").text(errorTxt);
      $("div.error").fadeIn(1000);
    },
  });
});
