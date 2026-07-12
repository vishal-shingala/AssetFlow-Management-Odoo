import { STATUS_COLORS } from '../../constants';
import StatusBadge from './StatusBadge';

export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto w-full rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              className="hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap text-text/90">
                  {col.render
                    ? col.render(row[col.key], row, idx)
                    : col.key === 'status'
                    ? <StatusBadge status={row[col.key]} colorKey={STATUS_COLORS[row[col.key]]} />
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-muted text-sm">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
