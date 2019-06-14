import './Controls.css'


/**
 * @name handleFail
 * @param err - error thrown by any function
 * @description Helper function to handle errors
 */
let handleFail = function(err){
    console.log("Error : ", err);
};

export default function controlInit(arg) {

    // Declare buttons and js references
    let mic=false,cam=false;
    let micBtn = document.querySelector('#mute-audio'),
        camBtn = document.querySelector('#mute-video'),
        leaveBtn = document.querySelector('#leave-call');

    // Initialize buttons and js references
    micBtn.className='flex-item';
    camBtn.className='flex-item';
    leaveBtn.className='flex-item';
    mic = true;
    cam = true;

    micBtn.onclick=()=>{
        console.log('mic toggled');
        mic = !mic;
        (mic)?arg.localStream.unmuteAudio():arg.localStream.muteAudio();
        micBtn.childNodes[0].innerHTML=`mic${(mic)?'':'_off'}`
    };
    camBtn.onclick=()=>{
        console.log('cam toggled');
        cam = !cam;
        (cam)?arg.localStream.unmuteVideo():arg.localStream.muteVideo();
        camBtn.childNodes[0].innerHTML=`videocam${(cam)?'':'_off'}`
    };

    leaveBtn.onclick=()=>{
        arg.client.unpublish(arg.localStream,handleFail);
        arg.localStream.close();
        arg.client.leave();
        let main = document.querySelector('main');
        main.innerHTML=`<h1 style="text-align: center;">Call ended successfully!</h1>`
    };

    console.log(arg);
}