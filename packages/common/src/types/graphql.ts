export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum AccessRoleEnum {
  Admin = 'ADMIN',
  Student = 'STUDENT'
}

export type AddStudentProfileDefinitionsInput = {
  attribute_type: Scalars['String'];
  is_array: Scalars['Boolean'];
  label: Scalars['String'];
  options: Array<InputMaybe<Scalars['String']>>;
  required: Scalars['Boolean'];
  requires_proof: Scalars['Boolean'];
};

export type Campaign = {
  __typename?: 'Campaign';
  campaign_id: Scalars['ID'];
  campaign_name: Scalars['String'];
};

export type CampaignDetails = {
  __typename?: 'CampaignDetails';
  campaign_id: Scalars['ID'];
  campaign_name: Scalars['String'];
  rules: Array<Maybe<FilteringRule>>;
};

export type CompareValue = {
  modifier: Scalars['String'];
  modifier_operator: Scalars['String'];
  value: Scalars['String'];
};

export type FilteringConditionInput = {
  compare_value: CompareValue;
  key: Scalars['String'];
  lego_type: Scalars['String'];
  operator: Scalars['String'];
};

export type FilteringRule = {
  __typename?: 'FilteringRule';
  attribute_id: Scalars['String'];
  multi_select_threshold: Array<Maybe<Scalars['String']>>;
  operator: Scalars['String'];
  prefix_multiplier: Scalars['Int'];
  threshold_value: Scalars['Int'];
};

export type InviteNewUsersToOrgInput = {
  access_role: AccessRoleEnum;
  campaign_id?: InputMaybe<Scalars['String']>;
  user_emails: Array<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addStudentProfileDefinitions: Scalars['Boolean'];
  createANewCampaign: Campaign;
  inviteNewUsersToOrg: Scalars['Boolean'];
  loginExistingUser: User;
  registerAdmin: User;
  registerWithValidInvite: User;
};


export type MutationAddStudentProfileDefinitionsArgs = {
  payload: Array<AddStudentProfileDefinitionsInput>;
};


export type MutationCreateANewCampaignArgs = {
  campaign_name: Scalars['String'];
};


export type MutationInviteNewUsersToOrgArgs = {
  payload?: InputMaybe<InviteNewUsersToOrgInput>;
};


export type MutationLoginExistingUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterAdminArgs = {
  payload: RegisterAdminInput;
};


export type MutationRegisterWithValidInviteArgs = {
  payload?: InputMaybe<RegisterWithValidInviteInput>;
};

export type NavItem = {
  __typename?: 'NavItem';
  label: Scalars['String'];
  relative_url: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  checkAuthStatus: Scalars['String'];
  getCampaignDetailsById: CampaignDetails;
  getMyCampaigns: Array<Maybe<Campaign>>;
  getNavItems: Array<Maybe<NavItem>>;
  getStudentBasicDataByQuery: Array<Maybe<StudentProfile>>;
  getStudentProfileDefinitions: Array<Maybe<StudentProfileDefinition>>;
  getUserDetails?: Maybe<User>;
};


export type QueryGetCampaignDetailsByIdArgs = {
  campaign_id: Scalars['String'];
};


export type QueryGetStudentBasicDataByQueryArgs = {
  conditions: Array<InputMaybe<FilteringConditionInput>>;
};

export type RegisterAdminInput = {
  email_address: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  org_name: Scalars['String'];
  password: Scalars['String'];
};

export type RegisterWithValidInviteInput = {
  email_address: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  password: Scalars['String'];
};

export type StudentProfile = {
  __typename?: 'StudentProfile';
  email_address: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  org_id: Scalars['ID'];
  user_id: Scalars['ID'];
};

export type StudentProfileDefinition = {
  __typename?: 'StudentProfileDefinition';
  attribute_id: Scalars['ID'];
  attribute_type: Scalars['String'];
  is_array: Scalars['Boolean'];
  is_blocked: Scalars['Boolean'];
  label: Scalars['String'];
  options: Array<Maybe<Scalars['String']>>;
  org_id: Scalars['String'];
  required: Scalars['Boolean'];
  requires_proof: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  access_role: Scalars['String'];
  email_address: Scalars['String'];
  first_name: Scalars['String'];
  has_student_profile: Scalars['Boolean'];
  last_name: Scalars['String'];
  org_id: Scalars['String'];
  user_id: Scalars['ID'];
};
