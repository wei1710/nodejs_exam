<script>
	import { Route } from "svelte-navigator";
	import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

	export let path;
	export let isAdmin = false;
</script>

<Route {path}>
	<PrivateRouteGuard {isAdmin}>
		<slot />
	</PrivateRouteGuard>
</Route>