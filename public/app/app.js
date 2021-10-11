var _db;
var albums;

function loadAlbums(genre = '*') {
    var collection = _db
    .collection("Albums");

    if (genre != '*') {
        collection = collection.where('genre', '==', genre);
    }

    collection.get()
    .then(function(querySnapshot){
        albums = [];

        querySnapshot.forEach((doc) => {
            albums.push(doc.data());
        });
        
        $('#albums').html('');

        albums.forEach((album, index) => {
            $('#albums').append(`
                <div class="album">
                    <img src="${album.photo}" alt="${album.name} album art" />
                    <div class="album-info">
                        <h1>${album.name}</h1>
                        <h3>${album.artist}</h3>
                        <p>${album.genre}</p>
                    </div>
                </div>
            `);
        })
    });
}

function initFirebase(){
    firebase
    .auth()
    .signInAnonymously()
    .then(() => {
        _db = firebase.firestore();

        loadAlbums();
  })
  .catch((error) => {
      console.error(error);
    var errorCode = error.code;
    var errorMessage = error.message;
    _db = [];
  });
}

function initListeners() {
    $('#genre-select').change(function() {
        loadAlbums($(this).val())
    });
}

$(document).ready(function () {
    try {
        let app = firebase.app();
        initFirebase();
        initListeners();
    } catch (e) {
        console.error(e);
    }
});