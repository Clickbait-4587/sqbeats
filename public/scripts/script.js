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
        </div>

        <div class="player">
          <audio src=${item.url}></audio>

          <div class="controls">
            <a
              
              class="z-depth-0 btn btn-small transparent"
            >
              <i
                
                class="play fa black-text  fa-play"
                aria-hidden="true"
              ></i>
            </a>
          </div>
        </div>
        <div class="desc">
          <p class=" title left">Artist: <span class="sdesc">${item.artist} |${item.title} (${item.year})</span><br>
          Collabos: <span class="sdesc">${item.collaborators}</span><br>
          Album: <span class="sdesc">${item.album}</span>
          <br>
          </p>
          <a class="btn z-depth-0 transparent grey-text btn-small download-btn"><i class="fas fa-download"></i></a>
          
          </div>

        <ul class="handles right" >
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
  //Start App

  //Browsing discover
  UI.browseSongs();

  ///Sign up

  const signupForm = document.querySelector(".su-form");
  document.body.addEventListener("click", () => {
    $(".text-warning").fadeOut(1000);
    $(".fa-exclamation-triangle").fadeOut(1000);
  });
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const password = signupForm["password"].value;
      const email = signupForm["email"].value;
      const username = signupForm["username"].value;
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          auth.onAuthStateChanged((user) => {
            user.updateProfile({
              displayName: username,
            });

            store.collection("Users").doc(user.uid).set({
              username: username,
            });
          });
        })
        .then(() => {
          //window.location.href = "/";
          signupForm.reset();
        })
        .catch((err) => {
          $(".error").removeClass("hidden");
          $(".text-warning").text(err.message);
          $(".text-warning").hide();
          $(".fa-exclamation-triangle").fadeIn(1000);
          $(".text-warning").fadeIn(1000);
        });
    });
  }
  //Signin

  const signinForm = document.querySelector(".si-form");
  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const password = signinForm["password"].value;
      const email = signinForm["email"].value;
      auth.signInWithEmailAndPassword(email, password).then((cred) => {
        signinForm.reset();
        window.location.href = "/";
      });
    });
  }

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
