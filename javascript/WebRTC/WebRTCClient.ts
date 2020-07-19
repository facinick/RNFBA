import { FirebaseClient } from '../Firebase/FirebaseClient';
import { EventEmitter } from "fbemitter";

export class WebRTCClient extends EventEmitter {

    private localPeerConnection!:RTCPeerConnection;
    private remotePeerConnection!:RTCPeerConnection;
    private firebaseClient!:FirebaseClient;
    private localId:string = String(Math.floor(Math.random() * 1000000000));

    private servers = {
        'iceServers': [
            {urls: 'stun:stun.services.mozilla.com'}, 
            {urls: 'stun:stun.l.google.com:19302'},
            {urls: 'stun:stun2.l.google.com:19302'},
            {urls: 'stun:stun3.l.google.com:19302'},
            // {urls: 'turn:numb.viagenie.ca','credential': 'Tiylaieomaat1337#','username': 'facinick@mail.com'},     
        ]};

    constructor(){
        super();  
    }

    public async initialize(){
        this.firebaseClient = new FirebaseClient();
        await this.firebaseClient.initialize();
        this.firebaseClient.initialize();
        this.firebaseClient.addListener("SINGAL", this.handleSignallingMessage);
        
        // 1 create local peer connection
        this.localPeerConnection = new window.RTCPeerConnection(this.servers);
        this.localPeerConnection.addEventListener('icecandidate', this.handleIceCandidate);
        this.localPeerConnection.addEventListener('iceconnectionstatechange', this.handleIceCandidateChange);
        this.localPeerConnection.addEventListener('addstream', this.handleRemoteStream);
    }

    public addTrack = (localTrack:any, localStream:any) => {
        this.localPeerConnection.addTrack(localTrack, localStream);
    }

    private handleRemoteStream = (event:any) => {
        this.emit("ADD_REMOTE_STREAM", event.stream);
    }

    public join = () => {
        // 2 create offer.
        this.localPeerConnection.createOffer()

        // 3 attach offer to local peer connection's description.
        .then(offer => this.localPeerConnection.setLocalDescription(offer) )

        // 4 send offer in local description to firebase server so remote can pull it.
        .then(() => this.firebaseClient.sendMessage(this.localId, JSON.stringify({'sdp': this.localPeerConnection.localDescription})));
    }

    public end = () => {
        this.firebaseClient.sendMessage(this.localId, JSON.stringify({'admin': "goodbye"}));
        this.localPeerConnection.close();
        this.emit("goodbye");
    }

    private handleIceCandidate = (event:any) => {
        console.dir("ICE MESSAGE RECEIVED -------- >>");
        console.dir(event);
        // 1+ as soon as ice candidates are available, start sending them to server so remote can take it
        event.candidate?this.firebaseClient.sendMessage(this.localId, JSON.stringify({'ice': event.candidate})):console.log("No candidate in ICE message") ;
    }

    private handleIceCandidateChange(){
        console.dir(`ice candidates changed`);
    }

    private handleSignallingMessage = (data:any) => {
        var message = JSON.parse(data.val().message);
        var sender = data.val().sender;

        // avoid reading messages sent by local
        if (sender !== this.localId) {
            if (message.ice !== undefined){
                // 5. save remote ice data into local peer connection to talk to remote.
                this.localPeerConnection.addIceCandidate(new RTCIceCandidate(message.ice));
            }
            else if (message.sdp && message.sdp.type === "offer"){
                // 5. save remote desc in local peer connection
                this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp))
                // 6. create answer
                .then(() => this.localPeerConnection.createAnswer())
                // 7. add answer to local description
                .then(answer => this.localPeerConnection.setLocalDescription(answer))
                // 8. send local description
                .then(() => this.firebaseClient.sendMessage(this.localId, JSON.stringify({'sdp': this.localPeerConnection.localDescription})));
            }
            else if (message.sdp && message.sdp.type === "answer"){
                // 8. got remote description, set it in our local peer connection.
                this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
            }
            else if (message.admin === "goodbye"){
                this.emit("goodbye")
                alert("goodbye");
            }
            else{
                console.dir(`unhandled signal`);
                console.dir(data);
            }
        }
    }

}