class Party {
    constructor(partyId) {
        this.party_id = partyId;
        this.party_members = [];
    }

    GetLeader() {
        return this.party_members[0];
    }

    AddMember(member) {
        this.party_members.push(member);
    }

    RemoveMember(member) {
        let i = this.party_members.indexOf(member);
        this.party_members.splice(i, 1);
    }

    HasMember(session_id) {
        let m  = this.GetMember(session_id);
        return (m) ? true : false;
    }

    GetMember(session_id) {
        return this.party_members.find(m => m.id == session_id);
    }
}

module.exports = Party;