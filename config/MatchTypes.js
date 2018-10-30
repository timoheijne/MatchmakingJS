const MatchTypes = {
    "Default": {
        Teams: 2,
        TeamSizes: {
            1: 6,
            2: 6
        },
        Options: {
            ELO: false,
            MAX_ELO_DIFF: 100,
        }
    }
};

/*
 * Options include:
 * - ELO: (bool) (default = false) should this consider the players ELO rank
 * - MAX_ELO_DIFF: (number) (default = 100) indicated the max ELO it may differ between the match's average
 * - IS_PRIVATE: (bool) (default = true) can anyone join
 * - CAN_PARTY_JOIN: (bool) (default = true) if true parties can join
 * - PARTY_TYPES: (array:string) (default = any) the types of parties allowed to join (if there is room for the party of course)
 * - CAN_INCREASE_ELO: (bool) (default = true) if it takes too long it will up the elo diff
 * - INCREASE_ELO_AMT: (number) (default: 100)
 * - INCREASE_ELO_TIME: (number) (default: 300) the seconds between each elo increase
 * - INCREASE_MAX: (number) (the number of times it may increase the elo)
 * - INCREASE_MAX_DIFF: (number) (the max diff it may actually take) (this one is authoritairian even if increase_max allows for more increments this one is the actual cap)
 */

module.exports = MatchTypes;