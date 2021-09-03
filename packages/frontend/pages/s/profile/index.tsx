
// Page to show the rendered profile of the student in view mode
// Any non-blocked field (by university admin) can be edited using a modal

import HeadMeta from "../../../components/views/HeadMeta";
import Layout from "../../../components/views/Layout";

// const formFieldValidators = 



const StudentProfile = () => {
    // fetch from server
    // *Note: The keys of the [studentData] will be same as keys of [studentProfileSchemaMeta]


    return (
        <>
            <HeadMeta title='UniPort | Student Profile' />
            <Layout>
                <div className='p-10'>
                    <div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default StudentProfile;