<script>
	import { Route } from "svelte-navigator";
	import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

	export let path;
	export let isAdmin = false;
	export let primary = true;
</script>

<Route {path} let:params let:location let:navigate {primary}>
	<PrivateRouteGuard {isAdmin}>
		<slot {params} {location} {navigate} />
	</PrivateRouteGuard>
</Route>