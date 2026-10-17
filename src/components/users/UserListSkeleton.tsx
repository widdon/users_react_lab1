/** Заглушка на время загрузки данных. */
export function UserListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Загрузка">
      {Array.from({ length: count }, (_, i) => (
        // Список статичный и никогда не меняется — здесь индекс в качестве key допустим
        <div key={i} className="card border border-base-300 bg-base-100 p-5">
          <div className="flex items-center gap-4">
            <div className="skeleton size-14 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
            <div className="skeleton h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
