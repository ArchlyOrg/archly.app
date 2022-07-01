// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract archly {

    // public address
    address public owner;
    uint256 private counter;

    constructor() {
        counter = 0;
        owner = msg.sender;
     }

    // defines the rental info
    struct siteInfo {
        string name;
        string location;
        string lat;
        string lng;
        string description;
        string imgUrl;
        string wikiUrl;
        uint256 id;
        address owner;
    }

    // the event emitted when we create a new rental
    event siteCreated (
        string name,
        string location,
        string lat,
        string lng,
        string description,
        string imgUrl,
        string wikiUrl,
        uint256 id,
        address owner
    );

    // the event emitted when a user 'likes' a site
    event userReaction (
        uint256 id,
        address user
    );

    // map & store rentalIds
    mapping(uint256 => siteInfo) sites;
    uint256[] public siteIds;


    // function to add new rental property
    function addSite(
        string memory name,
        string memory location,
        string memory lat,
        string memory lng,
        string memory description,
        string memory imgUrl,
        string memory wikiUrl
    ) public {
        // make sure the user using this function is the site creator/contract user
        require(msg.sender == owner, "Only owner of smart contract can put up sites");
        // increments the sites in the store
        siteInfo storage newSite = sites[counter];
        newSite.name = name;
        newSite.location = location;
        newSite.lat = lat;
        newSite.lng = lng;
        newSite.description = description;
        newSite.imgUrl = imgUrl;
        newSite.wikiUrl = wikiUrl;
        newSite.id = counter;
        newSite.owner = owner;
        siteIds.push(counter);
        // emit the event
        emit siteCreated(
                name,
                location,
                lat,
                lng,
                description,
                imgUrl,
                wikiUrl,
                counter,
                owner);
        // update the counter
        counter++;
    }

    // private function (only accessible internally by the contract) to check the sites
    // function checkSites(uint256 id, string[] memory newSites) private view returns (bool){

    //     for (uint i = 0; i < newSites.length; i++) {
    //         for (uint j = 0; j < sites.length; j++) {
    //             // compare bookings dates with new bookings using hashed strings to prevent double bookings
    //             if (keccak256(abi.encodePacked(sites[id])) == keccak256(abi.encodePacked(newSites[i]))) {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }

    // // public, payable function (used by users) to add a users booked dates
    // function addDatesBooked(uint256 id, string[] memory newBookings) public payable {

    //     require(id < counter, "No such Rental"); // check id is less than counter to ensure rental exists
    //     require(checkBookings(id, newBookings), "Already Booked For Requested Date");
    //     require(msg.value == (rentals[id].pricePerDay * 1 ether * newBookings.length) , "Please submit the asking price in order to complete the purchase");

    //     // loop through new bookings and push dates to the rentals datesBooked array
    //     for (uint i = 0; i < newBookings.length; i++) {
    //         rentals[id].datesBooked.push(newBookings[i]);
    //     }

    //     // send the owner the msg (payment, etc)
    //     payable(owner).transfer(msg.value);
    //     // emit the booking on-chain so Moralis can pick it up and we can display bookings to the UI
    //     emit newDatesBooked(newBookings, id, msg.sender, rentals[id].city,  rentals[id].imgUrl);

    // }

    // use rental id to find & return info on a rental
    function getSite(uint256 id) public view returns (string memory, string memory, address, string memory){
        require(id < counter, "No such Site");

        siteInfo storage s = sites[id];
        return (s.name, s.location, s.owner, s.description);
    }
}
