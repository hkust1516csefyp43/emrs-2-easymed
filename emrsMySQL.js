/**
 * Created by Louis on 13/5/2016.
 */
var mysql = require('mysql');
var lodash = require('lodash');
var rs = require('randomstring');
var moment = require('moment');

const id_length = 16;

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

// function getMySQLConnection(host, user, password, database, callback) {
//   var connection = mysql.createConnection({
//     host     : host,
//     user     : user,
//     password : password,
//     database : database
//   });
//
//   connection.connect();
//
//   callback(null, connection);
// }

/**
 * gives you an object of every data that you will need
 * @param host
 * @param user
 * @param password
 * @param database
 * @param callback(err, result)
 */
function getEverythingFromEmrs(host, user, password, database, callback) {
  var connection = mysql.createConnection({
    host     : host,
    user     : username,
    password : password,
    database : database
  });
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      callback(err, null);
    } else {
      console.log('connected as id ' + connection.threadId);
      var emrsFemalerecordArray = null;
      var emrsInventoryArray = null;
      var emrsKeywordArray = null;
      var emrsMedicineArray = null;
      var emrsPatientArray = null;
      var emrsPatienthistoryArray = null;
      var emrsPatientvisitArray = null;
      var emrsPrescriptionArray = null;
      var emrsSlumArray = null;
      var emrsTriagerecord = null;
      var emrsUserArray = null;
      connection.query('SELECT * FROM femalerecord', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsFemalerecordArray = rows;
        }
      });
      connection.query('SELECT * FROM inventory', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsInventoryArray = rows;
        }
      });
      connection.query('SELECT * FROM keyword', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsKeywordArray = rows;
        }
      });
      connection.query('SELECT * FROM medicine', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsMedicineArray = rows;
        }
      });
      connection.query('SELECT * FROM patient', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsPatientArray = rows;
        }
      });
      connection.query('SELECT * FROM patienthistory', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsPatienthistoryArray = rows;
        }
      });
      connection.query('SELECT * FROM patientvisit', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsPatientvisitArray = rows;
        }
      });
      connection.query('SELECT * FROM prescription', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsPrescriptionArray = rows;
        }
      });
      connection.query('SELECT * FROM slum', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsSlumArray = rows;
        }
      });
      connection.query('SELECT * FROM triagerecord', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsTriagerecord = rows;
        }
      });
      connection.query('SELECT * FROM user', function (err, rows, fields) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          emrsUserArray = rows;
        }
      });
      var output = {};
      output[femalerecord] = emrsFemalerecordArray;
      output[inventory] = emrsInventoryArray;
      output[keyword] = emrsKeywordArray;
      output[medicine] = emrsMedicineArray;
      output[patient] = emrsPatientArray;
      output[patienthistory] = emrsPatienthistoryArray;
      output[patientvisit] = emrsPatientvisitArray;
      output[prescription] = emrsPrescriptionArray;
      output[slum] = emrsSlumArray;
      output[triagerecord] = emrsTriagerecord;
      output[user] = emrsUserArray;
      callback(null, output);
    }
  });
}

function transformToPatient(emrsPatient, easymedClinic, easymedUser) {
  var patient_id = rs.generate(id_length);
  var clinic_id = easymedClinic.clinic_id;
  var user_id = easymedUser.user_id;
  var address = emrsPatient.Address;
  //TODO parse DOB ('2015-05-01') to birth_year, birth_month and birth_date
  var create_timestamp = moment();
  var first_name = emrsPatient.FirstName;
  var middle_name = emrsPatient.MiddleName;
  var last_name = emrsPatient.LastName;
  var output = {};
  return output;
}

function transformToVisit(emrsVisit, easymedPatient) {
  var visit_id = rs.generate(id_length);
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
  var triage_id = rs.generate(id_length);
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

  var output = {};
  return output;
}

function transformToConsultation(emrsFemaleRecord) {
  var consultation_id = rs.generate(id_length);
  
  var output = {};
  return output;
}

/**
 * TODO whoever call this function in loops needs to remove duplicate themselves
 * @param emrsKeyword
 * @returns a Easymed Keyword object
 */
function transformToKeywords(emrsKeyword) {
  var keyword_id = rs.generate(id_length);
  var keyword = emrsKeyword.Word;
  var type = emrsKeyword.Type;
  var allergen = false;
  var chief_complain = false;
  var diagnosis = false;
  var general = false;
  var medication_route = false;
  if (type == 'General') {
    general = true;
  } else if (type == 'CC') {
    chief_complain = true;
  } else if (type == 'Family') {
    diagnosis = true;
  } else if (type == 'Allergy') {
    allergen = true;
  } else if (type == 'Diagnosis') {
    diagnosis = true;
  } else if (type == 'Route') {
    medication_route = true;
  }

  //TODO Type == Drug >> medication table

  var output = {};
  output[keyword_id] = keyword_id;
  output[keyword] = keyword;
  output[general] = general;
  output[chief_complain] = chief_complain;
  output[allergen] = allergen;
  output[diagnosis] = diagnosis;
  output[medication_route] = medication_route;
  return output;
}

function transformToUsers(emrsUser, easymedRole) {
  var user_id = rs.generate(id_length);
  var first_name = emrsUser.Name;
  //TODO password '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' is '1234' (just sha256)
  var salt = rs.generate(32);
  var role_id = easymedRole.role_id;
  var output = {};
  return output;
}

function transformToRelatedData() {
  var output = {};
  return output;
}

function transformToDocuments() {
  var output = {};
  return output;
}

function transformToPrescription(emrsPrescription, easymedConsultation) {
  var prescription_id = rs.generate(id_length);
  var consultation_id = easymedConsultation.consultation_id;
}

function transformToPharmacy() {

}