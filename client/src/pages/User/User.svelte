<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/store";
  import { fetchGet } from "../../util/api";
  import Navbar from "../../components/Navbar.svelte";

  let users = [];

  const fetchUsers = async () => {
    const response = await fetchGet(`${BASE_URL}/api/users`);
    if (response.ok) {
      users = await response.json();
    } else {
      console.error("Failed fetching users!");
    }
  };

  onMount(fetchUsers);
</script>

<Navbar />
<table>
  <thead>
    <tr>
    <th>Username</th>
    <th>Email</th>
  </tr>
  </thead>
  <tbody>
    {#each users as user}
    <tr>
      <td>{user.username}</td>
      <td>{user.email}</td>
    </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }
</style>