import { ObjectId } from "mongodb";


export type BaseCompanyModelType = {
	_id: ObjectId
	name: string;
	logo_url: string;
}

export type CompanyModelType = {
	_id: ObjectId;
	org_id: ObjectId;
	name: string;
	logo_url: string;
}
