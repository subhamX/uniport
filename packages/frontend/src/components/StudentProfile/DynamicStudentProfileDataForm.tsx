import { FieldSchema, StudentProfileDefinition } from "@uniport/common"
import { Form } from "formik"
import { FormDateField } from "../ui/form/FormDateField"
import { FormEmailField } from "../ui/form/FormEmailField"
import { FormFloatField } from "../ui/form/FormFloatField"
import { FormIntegerField } from "../ui/form/FormIntegerField"
import { FormMarkdownField } from "../ui/form/FormMarkdownField"
import { FormMultiSelectField } from "../ui/form/FormMultiSelectField"
import { FormSingleSelectField } from "../ui/form/FormSingleSelectField"
import FormTextField from "../ui/form/FormTextField"

/**
 * Form component to render the form based on the field_defs inside the definitionBlock
 * This component must be placed inside <Formik> <Form>!
 */
export const DynamicStudentProfileDataForm = ({ definitionBlockFieldDefs }: { definitionBlockFieldDefs: FieldSchema[] }) => {
	return (
		<div>
			{definitionBlockFieldDefs.map((field, indx) => {
				if (field.multi_type === 1) {
					// single select
					return <FormSingleSelectField
						key={indx}
						fieldId={field._id}
						fieldLabel={field.field_name}
						isInline={true}
						options={JSON.parse(field.options).map(e => ({ value: e, label: e }))}
					/>
				} else if (field.multi_type === 2) {
					return <FormMultiSelectField
						key={indx}
						fieldId={field._id}
						fieldLabel={field.field_name}
						isInline={true}
						options={JSON.parse(field.options).map(e => ({ value: e, label: e }))}
					/>
					// multi select
				} else {
					// simple text input
					if (field.type === 'integer') {
						return <FormIntegerField
							key={indx}
							fieldId={field._id}
							fieldLabel={field.field_name}
							isInline={true}
						/>
					} else if (field.type === 'float') {
						return <FormFloatField
							key={indx}
							fieldId={field._id}
							fieldLabel={field.field_name}
							isInline={true}
						/>
					} else if (field.type === 'text') {
						return <FormTextField
							key={indx}
							fieldId={field._id}
							fieldLabel={field.field_name}
							isInline={true}
						/>
					} else if (field.type === 'email') {
						return <FormEmailField
							key={indx}
							fieldId={field._id}
							fieldLabel={field.field_name}
							isInline={true}
						/>
					} else if (field.type === 'markdown') {
						return <FormMarkdownField
							key={indx}
							fieldId={field._id}
							fieldLabel={field.field_name}
						/>
					} else if (field.type === 'date') {
						return <FormDateField
							key={indx}
							fieldId={field._id}
							fieldLabel={field.field_name}
							isInline={true}
						/>
					}
				}
			})}
		</div>
	)
}
