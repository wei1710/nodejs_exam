<script>
  import { onMount } from "svelte";
  import { BASE_URL } from "../../stores/store";
  import { fetchGet } from "../../util/api";
  import Navbar from "../../components/Navbar.svelte";
  import { writable } from "svelte/store";

  let users = [];
  let searchQuery = writable(""); // bind search input

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

  const deleteUser = async (email) => {
    try {
      const response = await fetch(`/api/users/${email}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // update users array
      users = users.filter((user) => user.email !== email);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  onMount(fetchUsers);
</script>

<Navbar />
<div>
  <input id="search-bar" type="text" placeholder="Search by email" bind:value={$searchQuery} />
</div>
<table>
  <thead>
    <tr>
      <th>Username</th>
      <th>Email</th>
      <th>Role</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each users.filter(user => user.email.toLowerCase().includes($searchQuery.toLowerCase())) as user}
      <tr>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.is_admin ? "Admin" : "User"}</td>
        <td>
          {#if !user.is_admin}
            <button on:click={() => deleteUser(user.email)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M3 6l3 16.125A2.978 2.978 0 0 0 8.963 24h6.074a2.978 2.978 0 0 0 2.963-1.875L21 6H3zM14 3V2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1H5v2h14V3h-5zM10 2h4v1h-4V2zm1 7h2v10h-2V9zm-4 0h2v10H7V9zm10 0h-2v10h2V9z"
                />
              </svg></button
            >
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  #search-bar {
    margin-top: 5%;
    margin-left: 99%;
    padding: 10px;
    width: 20%;
    box-sizing: border-box;
  }

  table {
    margin-top: 3%;
    width: 97%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #333;
  }

  button {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background-color: darkred;
  }
</style>
