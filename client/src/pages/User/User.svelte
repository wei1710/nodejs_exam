<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/store";
  import { fetchGet } from "../../util/api";
  import Navbar from "../../components/Navbar.svelte";

  let users = [];

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      users = data;
    } catch (error) {
      console.error("Error during fetch:", error);
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
    margin-top: 5%;
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #333;
  }
</style>