


export const ResponsiveTable = ({ tableHeadContents, tableDataContents, tableFooterContents }) => {
	return (
		<div className="bg-white border-gray-200 border-2">
			<div className="sm:rounded-lg overflow-x-hidden" style={{ height: '65vh' }}>
				<div className="flex flex-col">
					<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									{tableHeadContents}
								</thead>
								<tbody className="divide-y divide-gray-200">
									{tableDataContents}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{tableFooterContents}
		</div>
	)
}
