// Tabla genérica y reutilizable para el panel admin.
// Recibe cualquier tipo de datos y una definición de columnas,
// evitando repetir el HTML de tabla en cada módulo (Usuarios, Biblioteca, Foro, etc.).
//
// Uso:
//   const columns = [
//     { key: 'username', label: 'Usuario' },
//     { key: 'status', label: 'Estado', render: (val) => <Badge value={val} /> },
//   ];
//   <AdminTable data={users} columns={columns} />

interface Column<T> {
  key: string;
  label: string;
  // render opcional: permite personalizar el contenido de una celda
  // (badges, botones, íconos, etc.)
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface Props<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
}

export default function AdminTable<T extends { id: number }>({ data, columns }: Props<T>) {
  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.key}>
                  {/* Si la columna tiene render personalizado lo usa,
                      si no muestra el valor como string */}
                  {col.render
                    ? col.render(row[col.key as keyof T], row)
                    : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}