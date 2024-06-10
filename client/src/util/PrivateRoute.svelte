<script>
	import { Route } from "svelte-navigator";
	import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

	export let path;
	export let isAdmin = false;
</script>

<Route {path} let:params let:location let:navigate>
	<PrivateRouteGuard {isAdmin}>
		<slot {params} {location} {navigate} />
	</PrivateRouteGuard>
</Route>