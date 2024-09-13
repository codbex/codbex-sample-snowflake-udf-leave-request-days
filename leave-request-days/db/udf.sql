USE ROLE CONTAINER_USER_ROLE;
USE DATABASE CONTAINER_HOL_DB;
 
CREATE OR REPLACE FUNCTION calculate_leave_request_days (countryIsoCode string, fromDate date, toDate date)
  RETURNS integer
  SERVICE=codbex_kronos
  ENDPOINT='app-endpoint'
  AS '/public/ts/leave-request-days/api/leave-request-days-service.ts';

SELECT FROM_DATE, TO_DATE, calculate_leave_request_days(COUNTRY_ISO_CODE, FROM_DATE, TO_DATE) as leave_days FROM LEAVE_REQUESTS;
