class Authenticated { 
    constructor(session_id, ip, uid) {
        this.session_id = session_id;
        this.remoteAddress = ip;
        this.uid = uid || 0;
    }
}

module.exports = Authenticated;