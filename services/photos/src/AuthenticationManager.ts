import util = require('./Utils');
export = {

  // Returns true if our service is configured to Authenticate participant using eventbrite
  GetParticipantProfileByOAuth: function () : boolean {
    if (util.ValueExists(process.env.LOGIN_WITH_SERVICE_URI) && util.ValueExists(process.env.APP_DOMAIN_NAME)) {
      return true;
    }
    else {
      return false;
    }

  },

  // Returns OAuth url passed to the login_with service, this includes the success and failure callbacks
  GetExternalAuthenticationUrl: function (eventName: string) : String {
    if (util.ValueExists(process.env.LOGIN_WITH_SERVICE_URI) && util.ValueExists(process.env.APP_DOMAIN_NAME)) {
      return process.env.LOGIN_WITH_SERVICE_URI + "/eventbrite?success=" + process.env.APP_DOMAIN_NAME + "/success/" + eventName + "&failure=" + process.env.APP_DOMAIN_NAME + "/failure";
    }
    else return '';
  },

  GetPostAuthenticationSuccessRedirectionUrl: function (profileCookie?:string, eventName?: string) : string {

    if (util.ValueExists(process.env.APP_DOMAIN_NAME)) {
      var participantId = util.GetProfileIdFromProfileCookie(profileCookie);
      var eventParamName = util.GetEventIdUrlParamName();
      var participantParamName = util.GetParticipantIdUrlParamName();
      return process.env.APP_DOMAIN_NAME + "/?" + eventParamName + "=" + eventName + "&" + participantParamName + "=" + participantId;
    }
    else
      return "";

  },

  GetPostAuthenticationFailureRedirectionUrl: function (profileCookie? :string , eventName? : string) : string {

    return process.env.APP_DOMAIN_NAME;

  },

  GetNextAction: function (profileCookie: string, externalAuthentication:string, eventIdParameterValue: string, participantIdParameterValue:string)  {

    var response = undefined;

    if (!profileCookie && externalAuthentication && eventIdParameterValue) {
      response = { actionType: util.ActionType.REDIRECT_OAUTH, redirectUrl: this.GetExternalAuthenticationUrl(eventIdParameterValue)};
    }
    else if (eventIdParameterValue && participantIdParameterValue && (profileCookie || !externalAuthentication)) {

      response = { actionType: util.ActionType.RENDER_DEFAULT_FILE};

    }
    else if (eventIdParameterValue && !participantIdParameterValue && profileCookie && externalAuthentication) {

      response = { actionType: util.ActionType.REDIRECT_SUCCESS, redirectUrl: process.env.APP_DOMAIN_NAME + "/success/" + eventIdParameterValue};

    }
    else {
      response = { actionType: util.ActionType.SHOW_BAD_REQUEST_MESSAGE};

    }



    return response;



  }




}


