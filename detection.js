var streaming     = false,
      video       = document.querySelector('#video'),
      canvas      = document.querySelector('#canvas'),
      startbutton = document.querySelector('#startbutton'),
      continuous  = document.querySelector('#startmanybutton'),
      width       = 320,
      height      = 0,
      beaconId    = 1;

navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

navigator.getMedia(
  {
    video: true,
    audio: false
  },
  function(stream) {
    if (navigator.mozGetUserMedia) {
      video.mozSrcObject = stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(stream);
    }
    video.play();
  },
  function(err) {
    console.log("An error occured! " + err);
  }
);

video.addEventListener('canplay', function(ev){
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth/width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    streaming = true;
  }
}, false);

function takepicture() {
  canvas.getContext('2d').drawImage(video, 0, 0, width, height);
  // dataURL = canvas.toDataURL('image/jpeg');
  // var data = canvas.toDataURL('image/jpeg');
  // var photo = document.querySelector('#image');
  // photo.setAttribute('src', data);
  $('#canvas').faceDetection({
    complete: function (faces) {
        if(faces[0]) {
          dataURL = canvas.toDataURL('image/jpeg');
          $.ajax({
            type: "POST",
            url: "http://battle.curtish.me/detect64?beaconId="+beaconId,
            data: {
               imgBase64: dataURL
            }
          }).done(function(o) {
            console.log('saved');
            // If you want the file to be visible in the browser
            // - please modify the callback in javascript. All you
            // need is to return the url to the file, you just saved
            // and than put the image in your browser.
          });
        }
    }
  });
}

function startdetection(){
    takepicture();
    setTimeout(startdetection, 1000);

}
