import { database, app , apps, initializeApp, analytics} from "firebase";
import {EventEmitter} from "fbemitter";

export class FirebaseClient extends EventEmitter{

    private database: any

    constructor(){
        super();
    }

    public async initialize(){
        this.database = database().ref();
        analytics();
        this.database.on('child_added', this.readMessage);
    }

    public sendMessage(senderId: string, data:string) {
        var msg = this.database.push({ sender: senderId, message: data });
        msg.remove();
    }

    public readMessage = (data:any) => {
        this.emit("SINGAL", data);
    };
}