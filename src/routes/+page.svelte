<script lang="ts">
	import {
		createTableState,
		DataTable,
		DataTableToolbar,
		DataTableHeader,
		DataTableBody,
		DataTablePagination
	} from '$lib/components/ui/table';

	import type { TableState } from '$lib/components/ui/table';
	type Person = { id: number; name: string; role: string; team: string; salary: number };

	const rows: Person[] = [
		{ id: 1, name: 'Ada', role: 'Engineer', team: 'Core', salary: 160000 },
		{ id: 2, name: 'Lin', role: 'Designer', team: 'Design', salary: 135000 },
		{ id: 3, name: 'Sam', role: 'Engineer', team: 'Core', salary: 145000 },
		{ id: 4, name: 'Ivy', role: 'PM', team: 'Growth', salary: 150000 }
	];

	const columns = [
		{ key: 'name', header: 'Name', sortable: true, width: '2fr' },
		{ key: 'role', header: 'Role', sortable: true, width: '1fr' },
		{ key: 'team', header: 'Team', sortable: true, width: '1fr' },
		{ key: 'salary', header: 'Salary', sortable: true, width: '1fr' }
	];

	let state = createTableState<Person>({
		rows,
		columns,
		pagination: { pageSize: 5 }
	}) as TableState<Person>;
</script>

<!-- <DataTable {state}
toolbar={() => <DataTableToolbar {state}><button type="button" onclick={() => state.clearFilters()}>Clear filters</button></DataTableToolbar>}
header={() => <DataTableHeader {state} />}
body={() => <DataTableBody {state} />}
pagination={() => <DataTablePagination {state} />}
/> -->

<DataTable {state}>
	<DataTableToolbar {state}>
		<button type="button" onclick={() => state.clearFilters()}>Clear filters</button>
	</DataTableToolbar>
	<DataTableHeader {state} />
	<DataTableBody {state} />
	<DataTablePagination {state} />
</DataTable>

<style>
	:global(.dt-tr) {
		grid-template-columns: 2fr 1fr 1fr 1fr;
	}
</style>
