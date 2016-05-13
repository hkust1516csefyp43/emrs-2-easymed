/**
 * Created by Louis on 13/5/2016.
 */
var mysql = require('mysql');
var lodash = require('lodash');
var rs = require('randomstring');
var moment = require('moment');

//mysql://b3069f25516260:f05255f5@us-cdbr-iron-east-03.cleardb.net/heroku_a85e074e957fabb?reconnect=true
function testMySQLConnection(host, username, password, database, callback) {
  var connection = mysql.createConnection({
    host     : host,
    user     : username,
    password : password,
    database : database
  });
  //
  // connection.connect();
  // //
  // // connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  // //   if (err) throw err;
  // //
  // //   console.log('The solution is: ', rows[0].solution);
  // // });
  //
  // connection.end();
  callback("failed");
}

function getMySQLConnection(host, user, password, database, callback) {
  var connection = mysql.createConnection({
    host     : host,
    user     : user,
    password : password,
    database : database
  });

  connection.connect();

  callback(null, connection);
}

function transformToPatient(emrsPatient, easymedClinic, easymedUser) {
  var patient_id = rs.generate(16);
  var clinic_id = easymedClinic.clinic_id;
  var user_id = easymedUser.user_id;
  var address = emrsPatient.Address;
  //TODO parse DOB ('2015-05-01') to birth_year, birth_month and birth_date
  var create_timestamp = moment();
  var first_name = emrsPatient.FirstName;
  var middle_name = emrsPatient.MiddleName;
  var last_name = emrsPatient.LastName;
  
}

function transformToVisit(emrsVisit, easymedPatient) {
  var visit_id = rs.generate(16);
  var patient_id = easymedPatient.patient_id;
  var tag = emrsVisit.TagNumber;
  var create_timestamp = moment();
  //TODO next_station
  var output = {};
  output[visit_id] = visit_id;
  output[patient_id] = patient_id;
  output[tag] = tag;
  output[create_timestamp] = create_timestamp;
  return output;
}

function transformToTriage(emrsTriage, easymedVisit, easymedUser) {
  var triage_id = rs.generate(16);
  var remark = "Automatically transfer from EMRS."
  var temperature = emrsTriage.Temperature;
  if (emrsTriage.TemperatureScale == 'F') {
    temperature = ((temperature - 32) / 1.8);
  }
  var visit_id = easymedVisit.visit_id;
  var systolic = emrsTriage.SBP;
  var diastolic = emrsTriage.DBP;
  var respiratory_rate = emrsTriage.RR;
  var heart_rate = emrsTriage.PR;
  var spo2 = emrsTriage.Spo2;
  var weight = emrsTriage.Weight;
  var height = emrsTriage.Height;
  var user_id = easymedUser.user_id;
  //TODO emrsTriage.LDT
}

function transformToConsultation() {

}

function transformToKeywords() {

}

function transformToUsers(emrsUser, easymedRole) {
  var user_id = rs.generate(16);
  var first_name = emrsUser.Name;
  //TODO password '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' is '1234' (just sha256)
  var salt = rs.generate(32);
  var role_id = easymedRole.role_id;
}

function transformToRelatedData() {

}

function transformToDocuments() {

}