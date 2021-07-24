const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const speed = document.querySelector('.player-speed');


// Play & Pause ----------------------------------- //
function showPlayIcon() { // when video ends this function will be used in the event listener to change the  pause icon  back to play icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play')
}

function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause')
    } else {
        video.pause();
        showPlayIcon();
    }
}

// on video end show th play button icon
video.addEventListener('ended', showPlayIcon);

// Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60); // anything that is above 60 seconds will be returned as remainder here. using let as seconds may need another zero being added if less than one digit.
    seconds = seconds > 9 ? seconds : `0${seconds}`; // if seconds has two digits then return seconds or add 0 to seconds 
    return `${minutes}:${seconds}`;
}

// Update Progress bar as the video plays and updates the time and the progress bar
function updateProgress() {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${displayTime(video.currentTime)} /`;
    duration.textContent = `${displayTime(video.duration)}`
}

// Click to seek within the video
function setProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration; // will assign new time using newTime % from line above  mulitplied by duration of video.
}

// Volume Controls --------------------------- //

let lastVolume = 1; // to be used later to mute and unmute

//Volume bar
function changeVolume(e) {
    let volume = e.offsetX / volumeRange.offsetWidth;
    //Rounding volume up and down
    if (volume < 0.1) {
        volume = 0;
    }
    if (volume >0.9) {
        volume = 1;
    }
    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;
    // console.log(volume);
    // change icon depending on volume
    volumeIcon.className = ''; //volume icon will have no css right now, we will add back icon based on volume icon :
    if (volume > 0.7) {
        volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (volume < 0.7 && volume > 0) {
        volumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (volume === 0) {
        volumeIcon.classList.add('fas', 'fa-volume-off');
    }
    lastVolume = volume;
}

// Mute/unmute
function toggleMute() {
    volumeIcon.className = ''; // resets the css styling so that we can re add them as per icon we use for mute
    if (video.volume) { // if there is a video volume, in this case it more than zero = same as volume on
        lastVolume  = video.volume; // assign video volume to variable
        video.volume = 0; // and now mute volume by assigning volume of video the figure 0
        volumeBar.style.width = 0; // update the styling of the volume bar
        volumeIcon.classList.add('fas', 'fa-volume-mute');
        volumeIcon.setAttribute('title', 'Unmute');
    } else { // if it was muted
        video.volume = lastVolume; // otherwise, if there is no volume(mute) and you unmute then use lastVolume figure figure for video volume.
        volumeBar.style.width = `${lastVolume * 100}%`; // update the style for the volume bar 
        if (lastVolume > 0.7) {
            volumeIcon.classList.add('fas', 'fa-volume-up');
        } else if (lastVolume < 0.7 && lastVolume > 0) {
            volumeIcon.classList.add('fas', 'fa-volume-down');
        } else if (lastVolume === 0) {
            volumeIcon.classList.add('fas', 'fa-volume-off');
        }
        // volumeIcon.classList.add('fas', 'fa-volume-up');
        volumeIcon.setAttribute('title', 'Mute');     
    }
}


// Change Playback Speed -------------------- //

function changeSpeed() {
    video.playbackRate = speed.value; 
    // console.log('video playback rate', video.playbackRate);
    // console.log('selected value', speed.value);
}


// Fullscreen ------------------------------- //
//below code for function openFullscreen and closeFullscreen was taken from https://www.w3schools.com/howto/howto_js_fullscreen.asp and modified 

/* View in fullscreen */
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
    // these lines are added to prevent video to stick to the top of the page, although on my browser it worked fine
    video.classList.add('video-fullscreen');
  }
  
  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
    // these lines are added to prevent video to stick to the top of the page, although on my browser it worked fine
    video.classList.remove('video-fullscreen');
  }

  let fullscreen = false;
  // toggle full screen
  function toggleFullscreen() {
      !fullscreen ? openFullscreen(player) : closeFullscreen();    
      fullscreen = !fullscreen; // this is what enables to toggle back from fullscreen to the normal size.
    }

// Event listeners

playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress); // these methods are taken from https://www.w3schools.com/tags/ref_av_dom.asp
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);