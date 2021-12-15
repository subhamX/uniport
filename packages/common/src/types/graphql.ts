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
  ArrayScalar: any;
  FieldValueScalar: any;
};

export enum AccessRoleEnum {
  Admin = 'ADMIN',
  Student = 'STUDENT'
}

export type AddStudentProfileDefinitionInput = {
  block_name: Scalars['String'];
  field_defs: Array<FieldSchemaInput>;
  is_array: Scalars['Boolean'];
  is_freezed: Scalars['Boolean'];
  is_required: Scalars['Boolean'];
  position?: InputMaybe<Scalars['Int']>;
  requires_proof: Scalars['Boolean'];
};

export type AddStudentsToCampaignInput = {
  _id: Scalars['String'];
  student_emails: Array<Scalars['String']>;
};

export type BaseCompany = {
  __typename?: 'BaseCompany';
  logo_url: Scalars['String'];
  name: Scalars['String'];
};

export type BlockData = {
  __typename?: 'BlockData';
  _id: Scalars['ID'];
  block_def_id: Scalars['String'];
  field_data: Array<FieldData>;
  verification_info?: Maybe<VerificationInfo>;
};

export type Campaign = {
  __typename?: 'Campaign';
  _id: Scalars['ID'];
  campaign_name: Scalars['String'];
};

export type CampaignDetails = {
  __typename?: 'CampaignDetails';
  _id: Scalars['ID'];
  campaign_name: Scalars['String'];
  number_of_job_profiles: Scalars['Int'];
  number_of_offers: Scalars['Int'];
  number_of_placed_students: Scalars['Int'];
  number_of_students: Scalars['Int'];
  rules: Array<Maybe<FilteringRule>>;
};

export type Company = {
  __typename?: 'Company';
  _id: Scalars['String'];
  logo_url: Scalars['String'];
  name: Scalars['String'];
  org_id: Scalars['String'];
};

export type FieldData = {
  __typename?: 'FieldData';
  _id: Scalars['ID'];
  value: Scalars['FieldValueScalar'];
};

export type FieldSchema = {
  __typename?: 'FieldSchema';
  _id: Scalars['ID'];
  field_name: Scalars['String'];
  multi_type: Scalars['Int'];
  options: Scalars['ArrayScalar'];
  position: Scalars['Int'];
  required: Scalars['Boolean'];
  type: FieldsTypeEnum;
};

export type FieldSchemaInput = {
  field_name: Scalars['String'];
  multi_type: Scalars['Int'];
  options: Scalars['ArrayScalar'];
  position: Scalars['Int'];
  required: Scalars['Boolean'];
  type: FieldsTypeEnum;
};

export enum FieldsTypeEnum {
  Date = 'date',
  Email = 'email',
  Float = 'float',
  Integer = 'integer',
  Markdown = 'markdown',
  Text = 'text'
}

export type FilteringCondition = {
  __typename?: 'FilteringCondition';
  block_def_id: Scalars['String'];
  compare_value?: Maybe<Scalars['FieldValueScalar']>;
  field_id: Scalars['String'];
  operator: SupportedFilteringOperator;
};

export type FilteringConditionGroup = {
  conditions: Array<FilteringConditionInput>;
};

export type FilteringConditionInput = {
  block_def_id: Scalars['String'];
  compare_value?: InputMaybe<Scalars['FieldValueScalar']>;
  field_id: Scalars['String'];
  operator: SupportedFilteringOperator;
};

export type FilteringRule = {
  __typename?: 'FilteringRule';
  attribute_id: Scalars['String'];
  multi_select_threshold: Array<Maybe<Scalars['String']>>;
  operator: Scalars['String'];
  prefix_multiplier: Scalars['Int'];
  threshold_value: Scalars['Int'];
};

export type GetStudentProfileByQueryInput = {
  filter_groups: Array<FilteringConditionGroup>;
  offset: Scalars['Int'];
  page_size: Scalars['Int'];
};

export type InviteNewUsersToOrgInput = {
  access_role: AccessRoleEnum;
  user_emails: Array<Scalars['String']>;
};

export type JobProfile = {
  __typename?: 'JobProfile';
  _id: Scalars['String'];
  additional_questions: Array<FieldSchema>;
  array_blocks_config: Array<JobProfileArrayBlocksConfig>;
  camp_id: Scalars['String'];
  company: Company;
  created_at: Scalars['String'];
  creator_name: Scalars['String'];
  creator_uid: Scalars['String'];
  current_stage: Scalars['Int'];
  deadline: Scalars['String'];
  description: Scalars['String'];
  is_complete: Scalars['Boolean'];
  is_published: Scalars['Boolean'];
  org_id: Scalars['String'];
  rule_groups: Array<JobProfileRuleGroup>;
  stipend_high: Scalars['Int'];
  stipend_low: Scalars['Int'];
  title: Scalars['String'];
};

export type JobProfileAdvancedDetailsInput = {
  additional_questions?: InputMaybe<Array<FieldSchemaInput>>;
  array_blocks_config?: InputMaybe<Array<JobProfileArrayBlocksConfigInput>>;
  job_profile_id: Scalars['String'];
  rule_groups?: InputMaybe<Array<FilteringConditionGroup>>;
};

export type JobProfileArrayBlocksConfig = {
  __typename?: 'JobProfileArrayBlocksConfig';
  _id: Scalars['String'];
  help_text: Scalars['String'];
  max_blocks: Scalars['Int'];
  min_blocks: Scalars['Int'];
};

export type JobProfileArrayBlocksConfigInput = {
  _id: Scalars['String'];
  help_text: Scalars['String'];
  max_blocks: Scalars['Int'];
  min_blocks: Scalars['Int'];
};

export type JobProfileBasicDetailsInput = {
  description: Scalars['String'];
  job_profile_id: Scalars['String'];
  stipend_high: Scalars['Int'];
  stipend_low: Scalars['Int'];
  title: Scalars['String'];
};

export type JobProfileRuleGroup = {
  __typename?: 'JobProfileRuleGroup';
  _id: Scalars['String'];
  conditions: Array<FilteringCondition>;
};

export type MutateCompanyToOrgInput = {
  _id?: InputMaybe<Scalars['String']>;
  logo_url?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type MutateStudentProfileBlockDataInput = {
  _id?: InputMaybe<Scalars['String']>;
  block_def_id: Scalars['String'];
  fields: Array<MutateStudentProfileFieldInput>;
  user_id: Scalars['String'];
};

export type MutateStudentProfileFieldInput = {
  _id: Scalars['ID'];
  value: Scalars['FieldValueScalar'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addStudentProfileDefinition: StudentProfileDefinition;
  addStudentsToCampaign: Scalars['Boolean'];
  createANewCampaign: Campaign;
  createNewJobProfile: JobProfile;
  inviteNewUsersToOrg: Scalars['Boolean'];
  loginExistingUser: User;
  mutateCompanyToOrg: Company;
  mutateStudentProfileBlockData: BlockData;
  publishJobProfile: Scalars['Boolean'];
  registerAdmin: User;
  registerWithValidInvite: User;
  updateDeadlineOfJobProfile: Scalars['Boolean'];
  updateJobProfileAdvancedDetails: JobProfile;
  updateJobProfileBasicDetails: JobProfile;
  updateStudentProfileDefinition: StudentProfileDefinition;
};


export type MutationAddStudentProfileDefinitionArgs = {
  payload: AddStudentProfileDefinitionInput;
};


export type MutationAddStudentsToCampaignArgs = {
  payload: AddStudentsToCampaignInput;
};


export type MutationCreateANewCampaignArgs = {
  campaign_name: Scalars['String'];
};


export type MutationCreateNewJobProfileArgs = {
  payload: NewJobProfileInput;
};


export type MutationInviteNewUsersToOrgArgs = {
  payload: InviteNewUsersToOrgInput;
};


export type MutationLoginExistingUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationMutateCompanyToOrgArgs = {
  companyDetails: MutateCompanyToOrgInput;
};


export type MutationMutateStudentProfileBlockDataArgs = {
  payload: MutateStudentProfileBlockDataInput;
};


export type MutationPublishJobProfileArgs = {
  _id: Scalars['String'];
};


export type MutationRegisterAdminArgs = {
  payload: RegisterAdminInput;
};


export type MutationRegisterWithValidInviteArgs = {
  payload?: InputMaybe<RegisterWithValidInviteInput>;
};


export type MutationUpdateDeadlineOfJobProfileArgs = {
  _id: Scalars['String'];
  new_deadline: Scalars['String'];
};


export type MutationUpdateJobProfileAdvancedDetailsArgs = {
  payload: JobProfileAdvancedDetailsInput;
};


export type MutationUpdateJobProfileBasicDetailsArgs = {
  payload: JobProfileBasicDetailsInput;
};


export type MutationUpdateStudentProfileDefinitionArgs = {
  payload: UpdateStudentProfileDefinitionInput;
};

export type NewJobProfileInput = {
  camp_id: Scalars['String'];
  company_id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  checkAuthStatus: Scalars['String'];
  getAllJobProfiles: Array<JobProfile>;
  getCampaignDetailsById: CampaignDetails;
  getCompaniesInOrg: Array<Company>;
  getJobProfileById: JobProfile;
  getMyCampaigns: Array<Maybe<Campaign>>;
  getStudentProfileById: StudentProfile;
  getStudentProfileByQuery: Array<Maybe<StudentProfile>>;
  getStudentProfileDefinitions: Array<Maybe<StudentProfileDefinition>>;
  getUserDetails?: Maybe<User>;
  queryBaseCompanies: Array<BaseCompany>;
};


export type QueryGetAllJobProfilesArgs = {
  offset: Scalars['Int'];
  pageSize: Scalars['Int'];
};


export type QueryGetCampaignDetailsByIdArgs = {
  _id: Scalars['String'];
};


export type QueryGetCompaniesInOrgArgs = {
  offset: Scalars['Int'];
  pageSize: Scalars['Int'];
};


export type QueryGetJobProfileByIdArgs = {
  _id: Scalars['String'];
};


export type QueryGetStudentProfileByIdArgs = {
  _id: Scalars['String'];
};


export type QueryGetStudentProfileByQueryArgs = {
  payload?: InputMaybe<GetStudentProfileByQueryInput>;
};


export type QueryQueryBaseCompaniesArgs = {
  query: Scalars['String'];
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
  unique_token: Scalars['String'];
};

export type StudentProfile = {
  __typename?: 'StudentProfile';
  _id: Scalars['ID'];
  blocks_data: Array<Maybe<BlockData>>;
  campaigns: Array<Maybe<Campaign>>;
  email_address: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  matched_groups?: Maybe<Array<Scalars['String']>>;
  /** @deprecated Don't need this data at client */
  org_id: Scalars['ID'];
};

export type StudentProfileDefinition = {
  __typename?: 'StudentProfileDefinition';
  _id: Scalars['ID'];
  block_name: Scalars['String'];
  field_defs: Array<FieldSchema>;
  is_array: Scalars['Boolean'];
  is_freezed: Scalars['String'];
  is_required: Scalars['Boolean'];
  /** @deprecated We don't need this info to pass to client! */
  org_id: Scalars['String'];
  position: Scalars['Int'];
  requires_proof: Scalars['Boolean'];
};

export enum SupportedFilteringOperator {
  Contains = 'CONTAINS',
  ContainsAllOf = 'CONTAINS_ALL_OF',
  ContainsAnyOf = 'CONTAINS_ANY_OF',
  ContainsNoneOf = 'CONTAINS_NONE_OF',
  DateIsAfter = 'DATE_IS_AFTER',
  DateIsBefore = 'DATE_IS_BEFORE',
  DateIsBetween = 'DATE_IS_BETWEEN',
  DoesNotContain = 'DOES_NOT_CONTAIN',
  DoesNotEqual = 'DOES_NOT_EQUAL',
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  IsBetween = 'IS_BETWEEN',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  StartsWith = 'STARTS_WITH'
}

export type UpdateStudentProfileDefinitionInput = {
  _id: Scalars['String'];
  block_name: Scalars['String'];
  is_freezed: Scalars['Boolean'];
  is_required: Scalars['Boolean'];
  position: Scalars['Int'];
  requires_proof: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  access_role: AccessRoleEnum;
  email_address: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  org_id: Scalars['String'];
};

export type VerificationInfo = {
  __typename?: 'VerificationInfo';
  _id: Scalars['ID'];
  timestamp: Scalars['String'];
  verfier_id: Scalars['String'];
  verifier_name: Scalars['String'];
};
