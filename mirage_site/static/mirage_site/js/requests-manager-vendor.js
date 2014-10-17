RequestsManager.vendorInit = function(original) {
    Events.subscribe('vendorInfoLoaded', this.loadContracts.bind(RequestsManager));
    Events.subscribe('contractsChanged', this.refreshContracts.bind(RequestsManager));
    original.bind(RequestsManager).call();
};

RequestsManager.originalInit = RequestsManager.init;

RequestsManager.init = function() {
    RequestsManager.vendorInit(RequestsManager.originalInit);
};

RequestsManager.load = function() {
    /* get vendor info from api */
 
    var url = "/api/vendor/" + URLManager.getDUNS() + "/";

    var listType = 'naics';
    if (URLManager.getParameterByName('showall')) {
        listType = 'all';
    }
    
    $.getJSON(url, function(data){
        Events.publish('dataLoaded', data);
        Events.publish('vendorInfoLoaded', listType);
    });
};

RequestsManager.loadContracts = function(listType) {
    var listType = typeof listType !== 'undefined' ? listType : 'naics';
    var url = "/api/contracts/";
    var params = {
        'duns': URLManager.getDUNS()
    };

    naics = URLManager.getParameterByName('naics-code');
    
    if (naics && naics != 'all'){ 
        params['naics'] = naics; 
    }

    if (listType == 'all') {
        params['naics'] = '';
    }

    $.getJSON(url, params, function(data){
        Events.publish('contractDataLoaded', data, listType);
    });

};

//no idea why, but if I integrate the updated_naics parameter into the above function it becomes an infinite loop -- KBD
RequestsManager.refreshContracts = function(data) {
    var url = "/api/contracts/";

    var params = {
        'duns': URLManager.getDUNS()
    };
    
    if (data['naics'] && data['naics'] != 'all'){ 
        params['naics'] = data['naics']; 
    }

    if (data['direction']) { params['direction'] = data['direction'] }
    if (data['sort']) { 
        params['sort'] = data['sort'] 
        if (!data['direction']) {
            params['direction'] = 'desc'
        }
    }

    $.getJSON(url, params, function(resp_data){
        Events.publish('contractDataLoaded', resp_data, data['listType']);
    });
};
