



export const SectionLoading = ({ children }: { children?: any }) => (
	<div className='my-3 text-sm text-left text-blue-600 bg-blue-500 bg-opacity-10 border border-blue-400 flex items-center p-4 rounded-md'>
		{children ? children : 'Loading...'}
	</div>
)
