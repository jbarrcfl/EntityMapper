/*! Randomized data for hospital information */
var data_lists = data_lists || {categories : new Array()}

// Main Data Name
data_lists.categories.push({name:'Hospital',prefix:"data_hospital"});

// Data Categories
data_lists.data_hospital_dropdown = new Array();
data_lists.data_hospital_dropdown.push({name:"Departments",option:"data_hospital_departments"});
data_lists.data_hospital_dropdown.push({name:"Categories",option:"data_hospital_categories"});

// Data by category
data_lists.data_hospital_departments = ["Department 1","Department 2","Department 3"];
data_lists.data_hospital_categories = ["Category 1","Category 2","Category 3"];
