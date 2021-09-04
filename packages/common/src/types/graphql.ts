export type Maybe<T> = T | null;
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

export type Mutation = {
  __typename?: 'Mutation';
  registerAdmin: User;
  loginExistingUser: User;
  registerWithValidInvite: User;
};


export type MutationRegisterAdminArgs = {
  payload: RegisterAdminInput;
};


export type MutationLoginExistingUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterWithValidInviteArgs = {
  payload?: Maybe<RegisterWithValidInviteInput>;
};

export type NavItem = {
  __typename?: 'NavItem';
  label: Scalars['String'];
  relative_url: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getUserDetails?: Maybe<User>;
  checkAuthStatus: Scalars['String'];
  getNavItems: Array<Maybe<NavItem>>;
  getStudentProfileDefinitions: Array<Maybe<StudentProfileDefinition>>;
};

export type RegisterAdminInput = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email_address: Scalars['String'];
  password: Scalars['String'];
  org_name: Scalars['String'];
};

export type RegisterWithValidInviteInput = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email_address: Scalars['String'];
  password: Scalars['String'];
};

export type StudentProfileDefinition = {
  __typename?: 'StudentProfileDefinition';
  org_id: Scalars['String'];
  attribute_id: Scalars['ID'];
  attribute_type?: Maybe<Scalars['String']>;
  is_array: Scalars['Boolean'];
  label: Scalars['String'];
  is_blocked: Scalars['Boolean'];
  required: Scalars['Boolean'];
  options: Array<Maybe<Scalars['String']>>;
  requiresProof: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  user_id: Scalars['ID'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email_address: Scalars['String'];
  org_id: Scalars['String'];
  access_role: Scalars['String'];
  has_student_profile: Scalars['Boolean'];
};
