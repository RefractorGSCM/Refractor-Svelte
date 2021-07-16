// sortAsc sorts an array of objects in ascending order.
// It takes in a numberField which should contain the name of the property you want to sort by as well as the data itself.
// The sorted array returned.
export function sortAsc(numberField: string, data: any): any[] {
	return data.sort((a, b) => a[numberField] - b[numberField])
}
