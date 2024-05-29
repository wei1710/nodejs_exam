<script>
	import { useNavigate, useLocation } from "svelte-navigator";
	import { user } from "../stores/store.js";

	export let isAdmin = false;

	const navigate = useNavigate();
	const location = useLocation();

	$: if (!$user) {
		console.log(`PrivateRouteGuard: user is null, navigate to "/"`);
		navigate("/", {
			state: { from: $location.pathname },
			replace: true,
		});
	} else if (isAdmin && !$user.isAdmin) {
		console.log(`PrivateRouteGuard: user is not admin, navigate to "/"`);
		navigate("/", {
			replace: true,
		});
	}
</script>

{#if $user && (!isAdmin || (isAdmin && $user.isAdmin))}
	<slot />
{/if}