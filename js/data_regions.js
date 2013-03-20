/*! Randomized data for hospital information */
var data_lists = data_lists || {categories : new Array()}

// Main Data Name
data_lists.categories.push({name:'Regions',prefix:"data_regions"});

// Data Categories
data_lists.data_regions_dropdown = new Array();
data_lists.data_regions_dropdown.push({name:"Default",option:"data_regions_default"});

// Data by category
data_lists.data_regions_default = ["Northeast","Southeast","Midwest","South","West","East"];
