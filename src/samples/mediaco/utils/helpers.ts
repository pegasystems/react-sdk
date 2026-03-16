/**
 * Fetch work list data from a data page.
 */
export function fetchMyWorkList(
  datapage: string,
  fields: Record<string, string>,
  numberOfRecords: number,
  includeTotalCount: boolean,
  context: string
) {
  return PCore.getDataPageUtils()
    .getDataAsync(
      datapage,
      context,
      {},
      { pageNumber: 1, pageSize: numberOfRecords },
      {
        select: Object.keys(fields).map(key => ({ field: PCore.getAnnotationUtils().getPropertyName(fields[key]) })),
        sortBy: [
          { field: 'pxUrgencyAssign', type: 'DESC' },
          { field: 'pxDeadlineTime', type: 'ASC' },
          { field: 'pxCreateDateTime', type: 'DESC' }
        ]
      },
      { invalidateCache: true, additionalApiParams: { includeTotalCount } }
    )
    .then((response: any) => {
      return {
        ...response,
        data: (Array.isArray(response?.data) ? response.data : []).map((row: any) =>
          Object.keys(fields).reduce(
            (obj, key) => {
              obj[key] = row[PCore.getAnnotationUtils().getPropertyName(fields[key])];
              return obj;
            },
            {} as Record<string, any>
          )
        )
      };
    });
}
