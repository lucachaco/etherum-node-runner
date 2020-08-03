pragma solidity >=0.5.7;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';


contract DET is ERC721Metadata('DividentEventToken', 'DET'), ERC721Enumerable, Ownable {
    using Address for address;
    using SafeMath for uint256;

    // address token ID list
    mapping(uint256 => uint256) internal tokenIndices;
    uint256[] internal tokenIds;
    mapping(uint256 => DividendInfo) internal tokenDetails;
    address _deployerAccount;

    constructor() public {
        _deployerAccount = msg.sender;
    }

    // FET contract address
    //IFET private _fungibleEventToken;

    struct DividendInfo {
        bytes32 dividendEventCode; //identifies the dividend event
        bytes32 opaqueInvestorID; //opaque identifier for the investor
        /*string hashOfCOR;
        bytes32 securitySymbol;
        uint256 amount; //number of shares
        uint256 dividendPerShare;
        uint256 withholdingTax; //withholding tax amount
        bytes32 country; //country of investor
        bytes32 treaty; //treaty category
        bytes32 recordDate;
        address responsibleEntityAddress; //Financial Entity that created DET
        string privateData; //encrypted investor data
        bytes32 dateOfPurchase;
        bytes32 dateOfSale;
        bytes1 liableToTax;
        bytes1 subjectToTax;
        bytes1 beneficialOwner;
        bytes1 permanentEstablishment;
        bytes1 securitiesPartOfBorrowing;
        bytes32 trackingID;
        uint256 levelCount;
        uint256 previousTokenId;*/
    }


    /**
     * @dev Function to mint ERC721 DET for address to
     * By burning equvilant amount of OCT amount
     * @param to address of the DET minter
     * @param tokenId ID of the new DET token
     * @param contractAddress contractAddress of FET token
     */
    function mint(
        address to,
        uint256 tokenId,
        /*bytes32[9] calldata tokenByteValues,*/
        /*uint256[4] calldata tokenNumbers,*/
        address contractAddress,
        address responsibleEntityAddress
    ) public {
        // uint256 total = getFetBalance(to, contractAddress);
        // require(tokenNumbers[1] <= total, 'Current address not enough balance!');

        tokenIds.push(tokenId);

        // Make the number always larger than 0
        // Index is stored to be 1 bigger than actual index
        tokenIndices[tokenId] = tokenIds.length;
        DividendInfo memory dividendInfo;
        /*dividendInfo.opaqueInvestorID = tokenByteValues[0];
        dividendInfo.country = tokenByteValues[1];
        dividendInfo.treaty = tokenByteValues[2];
        dividendInfo.securitySymbol = tokenByteValues[3];
        dividendInfo.recordDate = tokenByteValues[4];
        dividendInfo.dividendEventCode = tokenByteValues[5];
        dividendInfo.dateOfPurchase = tokenByteValues[6];
        dividendInfo.dateOfSale = tokenByteValues[7];
        dividendInfo.trackingID = tokenByteValues[8];*/
/*        dividendInfo.liableToTax = tokenQuestionsValues[0];
        dividendInfo.subjectToTax = tokenQuestionsValues[1];
        dividendInfo.beneficialOwner = tokenQuestionsValues[2];
        dividendInfo.permanentEstablishment = tokenQuestionsValues[3];
        dividendInfo.securitiesPartOfBorrowing = tokenQuestionsValues[4];*/
        //dividendInfo.hashOfCOR = hashOfCOR;
        /*dividendInfo.dividendPerShare = tokenNumbers[0];
        dividendInfo.amount = tokenNumbers[1];
        dividendInfo.withholdingTax = tokenNumbers[2];
        dividendInfo.levelCount = tokenNumbers[3];*/
        //dividendInfo.previousTokenId = 0;
        //dividendInfo.responsibleEntityAddress = responsibleEntityAddress;
        //tokenDetails[tokenId] = dividendInfo;
        // Create the fungible token with the contract address
        // IFET _fungibleEventToken = IFET(contractAddress);
        // _fungibleEventToken.burn(to, tokenNumbers[1]);
        super._mint(to, tokenId);
    }







}
