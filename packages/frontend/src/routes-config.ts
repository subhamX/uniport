

// just after registration is complete we shall route to this
export const ADMIN_PRIMARY_DASHBOARD = '/a/dash';
// when we don't know if we should push to /a/ or /s/
export const BRIGE_DASHBOARD = '/dash';


export const CREATE_NEW_CAMPAIGN = '/a/camp/new';


export const MANAGE_CAMP = (campaign_id: string) => `/a/camp/${campaign_id}/manage`;

