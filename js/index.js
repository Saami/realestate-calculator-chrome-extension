//global values
var zpid = '';
var response = {};
var streetviewUrl = '';

//util methods
function formatParams(params){
  return "?" + Object
        .keys(params)
        .map(function(key){
          return key+"="+encodeURIComponent(params[key])
        })
        .join("&")
}


//listeners
function setCollapsableListeners(){
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
//        hideAllCollapsables();
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";            
        } else {          
          content.style.display = "block";
        }
      });
    }    
}

function hideAllCollapsables(){
    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
        var content = coll[i].nextElementSibling;
        content.style.display = "none";      
    }  
}


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


function getPropertyDetailsByZpid(zpid, parameters, callback) {
    var xhttp = new XMLHttpRequest();
//    var url = 'http://www.iuqiddis07.com/property/' + zpid + formatParams(parameters);
    var url = 'http://localhost:8080/property/' +  zpid + formatParams(parameters);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText)
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}


function getPropertyDetailsByAddressString(addressString, callback) {
    var xhttp = new XMLHttpRequest();
//    var url = 'http://www.iuqiddis07.com/property/search/' + addressString;
    var url = 'http://localhost:8080/property/search/' + addressString;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText)
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}


function populateInputFields(propertyDetail) {
    response = propertyDetail;
    zpid = propertyDetail.zpid;
    document.getElementById("address").value = propertyDetail.address;
    document.getElementById("city").value = propertyDetail.city;
    document.getElementById("state").value = propertyDetail.state; 
    document.getElementById("rent").value = propertyDetail.rent;
    document.getElementById("price").value = propertyDetail.listPrice > 0 ? propertyDetail.listPrice : propertyDetail.zestimate;   
    document.getElementById("downPayment").value = propertyDetail.downPayment;   
    document.getElementById("mortgage").value = propertyDetail.mortgage;   
    document.getElementById("taxes").value = propertyDetail.tax;   
    document.getElementById("taxRate").value = propertyDetail.taxRate;   
    document.getElementById("insurance").value = propertyDetail.insurance;   
    document.getElementById("wearAndTear").value = propertyDetail.wearTear;   
    document.getElementById("management").value = propertyDetail.management;   
    document.getElementById("cashFlow").value = propertyDetail.cashFlow;   
    document.getElementById("estimatedReturn").value = propertyDetail.estimatedReturn;   
    document.getElementById("cashToClose").value = propertyDetail.cashToClose;   
    
    //populate streetview  iframe
     streetviewUrl = 'https://www.google.com/maps/embed/v1/streetview?key=AIzaSyBg7tAf_4zkMLwlLXqtRB-dNi080T86VMQ&location=' + propertyDetail.lat + ', ' + propertyDetail.long
    document.getElementById("streetViewIframe").src = streetviewUrl;
    
    if (propertyDetail.cashFlow.startsWith('-')) {
                document.getElementById("cashFlow").style.color = "#ff0000";
            } else {
                document.getElementById("cashFlow").style.color = "#00994c";
            }
            if (propertyDetail.estimatedReturn.startsWith('-')) {
                document.getElementById("estimatedReturn").style.color = "#ff0000";
            } else {
                document.getElementById("estimatedReturn").style.color = "#00994c";
            }    
}

$(document).ready(function () {
    'use strict';
    setCollapsableListeners()
    getCurrentTabUrl(function (url) {
        if (url && url.indexOf('_zpid') >= 0) {
            var zpidEndIndex = url.lastIndexOf('_zpid'),
            truncatedUrl = url.substr(0, zpidEndIndex),
            zpidStartIndex = truncatedUrl.lastIndexOf('/') + 1,
            zpid = truncatedUrl.substr(zpidStartIndex, zpidEndIndex);
        
        getPropertyDetailsByZpid(zpid, {}, function (data) {
            var propertyDetail = JSON.parse(data);
            populateInputFields(propertyDetail);
        });            
        }                    
        else {
            var addressDelimiter1 = 'homes/',
                addressSection1 = url.substring(url.lastIndexOf(addressDelimiter1) + addressDelimiter1.length)
            
            getPropertyDetailsByAddressString(addressSection1, function (data) {
            var propertyDetail = JSON.parse(data);
                populateInputFields(propertyDetail);
        }); 
        }                                                
    });            
    
    $('#refresh').click(function () {                
        var address = document.getElementById("address").value,
            city = document.getElementById("city").value,
            state = document.getElementById("state").value,
            rent = parseFloat(document.getElementById("rent").value.replace(/[^0-9.-]+/g, '')),
            price = parseFloat(document.getElementById("price").value.replace(/[^0-9.-]+/g, '')),
            hoa = parseFloat(document.getElementById("hoa").value.replace(/[^0-9.-]+/g, '')),
            downPercent = parseFloat(document.getElementById("downPercent").value.replace(/[^0-9.-]+/g, '')),
            taxRate = parseFloat(document.getElementById("taxRate").value.replace(/[^0-9.-]+/g, '')),
            wTPercent = parseFloat(document.getElementById("wearAndTearPercent").value.replace(/[^0-9.-]+/g, '')),
            iR = parseFloat(document.getElementById("interestRate").value.replace(/[^0-9.-]+/g, '')),
            closingCosts = parseFloat(document.getElementById("closingCosts").value.replace(/[^0-9.-]+/g, '')),
            insurance = parseFloat(document.getElementById("insurance").value.replace(/[^0-9.-]+/g, '')),
            pMPercent = parseFloat(document.getElementById("managementRate").value.replace(/[^0-9.-]+/g, ''))
            
        getPropertyDetailsByZpid(zpid, {'address': address, 
                        'city': city,
                        'state': state,
                        'rent': rent,    
                        'price': price,
                        'hoa': hoa,
                        'downPercent': downPercent,                
                        'taxRate': taxRate,
                        'wTPercent': wTPercent,
                        'iR': iR,
                        'closingCosts': closingCosts,
                        'insurance' : insurance,
                        'pMPercent': pMPercent}, function (data) {
            var houseDetail = JSON.parse(data);
            populateInputFields(houseDetail);
            
        });
        
    });
    
});
        