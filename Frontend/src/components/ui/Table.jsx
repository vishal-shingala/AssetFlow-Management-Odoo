import { STATUS_COLORS } from '../../constants';
import StatusBadge from './StatusBadge';

export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3.5 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              className="hover:bg-gray-50/60 transition-colors duration-150 cursor-pointer"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3.5 whitespace-nowrap text-text">
                  {col.render
                    ? col.render(row[col.key], row)
                    : col.key === 'status'
                    ? (
                      <StatusBadge
                        status={row[col.key]}
                        colorKey={STATUS_COLORS[row[col.key]]}
                      />
                    )
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-muted">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
