function getCurrentTabUrl(callback) {
    'use strict';
    var queryInfo = {
            active: true,
            currentWindow: true
        };
    
    chrome.tabs.query(queryInfo, function (tabs) {
        var tab = tabs[0],
            tabUrl = tab.url;
        callback(tabUrl);
    });
}

function getPropertyDetails(parameters, callback) {
    'use strict';
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/property/search/',
        data: parameters,
        success: function (d) {
            callback(d);
        },
        error: function () {
            console.log("error");
        }
    });
}


function getPropertyDetailsByZpid(zpid, callback) {
    'use strict';
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/property/' + zpid,
        success: function (d) {
            callback(d);
        },
        error: function () {
            console.log("error");
        }
    });
}

function getPropertyDetailsByAddressString(addressString, callback) {
    'use strict';
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/property/search/' + addressString,
        success: function (d) {
            callback(d);
        },
        error: function () {
            console.log("error");
        }
    });
}

function populateInputFields(data) {
    var propertyDetail = JSON.parse(data);
        document.getElementById("address").value = propertyDetail.address;
        document.getElementById("city").value = propertyDetail.city;
        document.getElementById("state").value = propertyDetail.state; 
        document.getElementById("rent").value = propertyDetail.rent;
        document.getElementById("price").value = propertyDetail.zestimate;   
}

$(document).ready(function () {
    'use strict';
    getCurrentTabUrl(function (url) {
        if (url && url.indexOf('_zpid') >= 0) {
            var zpidEndIndex = url.lastIndexOf('_zpid'),
            truncatedUrl = url.substr(0, zpidEndIndex),
            zpidStartIndex = truncatedUrl.lastIndexOf('/') + 1,
            zpid = truncatedUrl.substr(zpidStartIndex, zpidEndIndex);
        
        getPropertyDetailsByZpid(zpid, function (data) {
            var propertyDetail = JSON.parse(data);
            populateInputFields(data);
        });            
        } 
//        else if (url.indexOf('homes/for_sale/' >= 0)) {
//            var addressDelimiter = 'homes/for_sale/',
//                addressSection = url.substring(url.lastIndexOf(addressDelimiter) + addressDelimiter.length)
//            
//            getPropertyDetailsByAddressString(addressSection, function (data) {
//            var propertyDetail = JSON.parse(data);
//                populateInputFields(data);
//        }); 
//        }                    
        else {
            var addressDelimiter1 = 'homes/',
                addressSection1 = url.substring(url.lastIndexOf(addressDelimiter1) + addressDelimiter1.length)
            
            getPropertyDetailsByAddressString(addressSection1, function (data) {
            var propertyDetail = JSON.parse(data);
                populateInputFields(data);
        }); 
        }                                                
    });            
    
    $('#submit').click(function () {                
        var address = document.getElementById("address").value,
            city = document.getElementById("city").value,
            state = document.getElementById("state").value,
            rent = parseFloat(document.getElementById("rent").value.replace(/[^0-9.-]+/g, '')),
            price = parseFloat(document.getElementById("price").value.replace(/[^0-9.-]+/g, ''));
        getPropertyDetails({'address': address, 
                        'city': city,
                        'state': state,
                        'rent': rent,    
                        'price': price}, function (data) {
            document.getElementById('inputDiv').style.display = "none";
            var houseDetail = JSON.parse(data);
            $("#mortgage").val(houseDetail.mortgage);
            $('#taxes').val(houseDetail.tax);
            $('#insurance').val(houseDetail.insurance);
            $('#wearAndTear').val(houseDetail.wearTear);
            $('#management').val(houseDetail.management);            
            $('#cashFlow').val(houseDetail.cashFlow);             
            $('#rentEstimate').val(houseDetail.rent);
            $('#estimatedReturn').val(houseDetail.estimatedReturn);
            
            if (houseDetail.cashFlow.startsWith('-')) {
                document.getElementById("cashFlow").style.color = "#ff0000";
            } else {
                document.getElementById("cashFlow").style.color = "#00994c";
            }
            if (houseDetail.estimatedReturn.startsWith('-')) {
                document.getElementById("estimatedReturn").style.color = "#ff0000";
            } else {
                document.getElementById("estimatedReturn").style.color = "#00994c";
            }
            document.getElementById('outputDiv').style.display = "block";
            
        });
        
    });
    
});
        