import { Comparer, Condition, ConditionProperty, FieldType, Option } from "sheet-matchy";
import { contracts_arr } from "../models/enums/contract_type";
import { gendres_arr } from "../models/enums/gender";
import { roles_arr } from "../models/enums/role";

export const email_regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
export const date_regex = "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
export const cnss_number_regex = "^\s*$|^[0-9]{8}-[0-9]{2}$"
export const phone_number_regex = "^[0-9]{8}$"

export const back_base_url = "http://127.0.0.1:8000/"

export const matchy_options = [
// new Option(display_value, value, mandatory, type, conditions);
// new Condition(property, value, comparer, custom_fail_message);
    new Option("First name", "first_name", true, FieldType.string),
    new Option("Last name", "last_name", true, FieldType.string),
    new Option("Email", "email", true, FieldType.string, [
        new Condition(ConditionProperty.regex, email_regex, Comparer.e,"Invalid email")
    ]),
    new Option("Number", "number", true, FieldType.integer, [
        new Condition(ConditionProperty.value, 0, Comparer.gte, "number should be a positive integer")
    ]),
    new Option("Birth date", "birth_date", true, FieldType.string, [
        new Condition(ConditionProperty.regex, date_regex, Comparer.e,"Birth date should be in the format: yyy-mm-dd")
    ]),
    new Option("Address", "address", false, FieldType.string),
    new Option("Cnss number", "cnss_number", false, FieldType.string, [
        new Condition(ConditionProperty.regex, cnss_number_regex, Comparer.e,"Cnss number should be empty or in the format 8 digits-2 digits eg 12345678-12")
    ]),
    new Option("Contract type", "contract_type", true, FieldType.string, [
        new Condition(ConditionProperty.value, contracts_arr, Comparer.in,`Contract type should be in ${contracts_arr.join(', ')}`)
    ]),
    new Option("Gender", "gender", true, FieldType.string, [
        new Condition(ConditionProperty.value, gendres_arr, Comparer.in,`Gender should be in ${gendres_arr.join(', ')}`)
    ]),
    new Option("Phone", "phone_number", true, FieldType.integer, [
        new Condition(ConditionProperty.regex, phone_number_regex, Comparer.e,"Phone should be 8 digits")
    ]),
    new Option("Roles", "roles", true, FieldType.string, [
        new Condition(ConditionProperty.value, roles_arr, Comparer.in,`Role should be in ${roles_arr.join(', ')}, only one role should be provided`)
    ]),
];
