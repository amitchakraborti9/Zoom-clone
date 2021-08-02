const socket = io('/');

const videoGrid = document.getElementById('video-grid');
var peer = new Peer(undefined, {
    // path: '/peerjs',
    // host: '/',
    // port: '3030'
});


let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true;

let userName = '';
let firstKeyDown = false;
$('.modal').modal('show');
$('html').keydown((e) => {
    userName = $('#initName').val();
    if (!firstKeyDown && e.which == 13 && userName.length != 0) {
        $('.modal').modal('hide');
        socket.emit('message', `<i>${userName} has joined!</i>`);
        $('#initName').val('');
        firstKeyDown = true;
    }
});

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        setTimeout(() => {
            // user joined
            connectToNewUser(userId, stream)
        }, 3000)
    })

    let text = $('#chat-message');
    $('html').keydown((e) => {
        if (firstKeyDown && e.which == 13 && text.val().length != 0) {
            socket.emit('message', `<b>${userName}</b>` + `<br/>` + text.val());
            console.log(userName);
            text.val('');
        }
    });

    socket.on('createMessage', message => {
        // console.log(message);
        $('ul').append(`<li class="message">${message}</li>`)
        scrollToBottom()
    })

})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})




const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}

const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i>
    <span>
        Unmute
    </span>`;
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i>
    <span>
        Mute
    </span>`;
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        setStopVideo();
    }
}

const setStopVideo = () => {
    const html = `<i class="fas fa-video"></i>
    <span>Stop Video</span>`;
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`;
    document.querySelector('.main__video_button').innerHTML = html;
}
