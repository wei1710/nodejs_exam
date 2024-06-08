<script>
	import { useNavigate, useLocation } from "svelte-navigator";
	import { user } from "../stores/store.js";

	export let isAdmin = false;

	const navigate = useNavigate();
	const location = useLocation();

	$: if (!$user) {
		navigate("/", {
			state: { from: $location.pathname },
			replace: true,
		});
	} else if (isAdmin && !$user.isAdmin) {
		navigate("/", {
			replace: true,
		});
	}
</script>

{#if $user && (!isAdmin || (isAdmin && $user.isAdmin))}
	<slot />
{/if}