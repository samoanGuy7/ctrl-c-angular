export const environment = {
    production: false,
    issuer: "https://smile-dev.iehp.org/smartauth-fhir",
    clientId: 'my-web-app',
    scopes: "fhirUser launch/patient offline_access openid patient/*.read patient/*.write patient/ExplanationOfBenefit.read patient/Encounter.read patient/Observation.read patient/Condition.read patient/MedicationRequest.read patient/Procedure.read patient/DocumentReference.read patient/AllergyIntolerance.read",
    redirectUri: window.location.origin + "/patient-data",
    fhirEndpointUri: "https://smile-dev.iehp.org/fhir-request"
  };
  