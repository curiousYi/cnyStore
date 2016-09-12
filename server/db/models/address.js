'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

//Uses 
module.exports = db.define('address', {
    // Country (always require, 2 character ISO code)
    country: {
        type: Sequelize.STRING(2),
        allowNull: false
    },
    // First Name
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Last Name
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Company
    organisation_name: {
        type: Sequelize.STRING
    },
    // State / Province / Region
    administrative_area: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // County / District (Unused)
    sub_administrative_area: {
        type: Sequelize.STRING
    },
    // City / Town
    locality: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Dependent Locality (unused)
    dependent_locality: {
        type: Sequelize.STRING
    },
    // Zip Code / Postal Code
    postal_code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Street Address
    thoroughfare: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Apartment, Suite, Box number, etc.
    premise: {
        type: Sequelize.STRING
    },
    // Sub premise (unused)
    sub_premise: {
        type: Sequelize.STRING
    }

}, {
    getterMethods: {
        name_line: function() {
            return this.first_name + ' ' + this.last_name;
        }
    },
    instanceMethods: {
        print: function() {
            return {full_name: this.full_name, street_address: this.thoroughfare, unit: this.premise, city: this.locality, state: this.administrative_area, zip_code: this.postal_code, country: this.country};
        }
    }
});
