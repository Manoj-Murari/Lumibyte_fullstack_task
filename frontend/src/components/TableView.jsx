export default function TableView({ tableData }) {
  if (!tableData) return null;

  const { headers, rows } = tableData;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}