<script>
  import { onMount } from "svelte";
  import Navbar from "../../components/Navbar.svelte";
  import ThemeStyle from "../../components/Theme/ThemeStyle.svelte";
  import { writable } from "svelte/store";

  let users = [];
  let searchQuery = writable(""); // bind search input
  let editingUser = writable(null); // store user being edited
  let newEmail = writable("");
  let newUsername = writable("");

  //-- *********************************** GET USERS *********************** --//
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

  //-- *********************************** UPDATE USERS *********************** --//
  const updateUser = async () => {
    try {
      const email = $editingUser.email;
      const response = await fetch(`/api/users/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail: $newEmail,
          newUsername: $newUsername,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      editingUser.set(null); // reset editing user
      fetchUsers(); // refresh users list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  //-- *********************************** EDIT USER *********************** --//
  const editUser = (user) => {
    editingUser.set(user);
    newEmail.set(user.email);
    newUsername.set(user.username);
  };

  //-- *********************************** CANCEL EDIT USER *********************** --//
  const cancelEdit = () => {
    editingUser.set(null);
    newEmail.set("");
    newUsername.set("");
  };

  //-- *********************************** DELETE USER *********************** --//
  const deleteUser = async (email) => {
    try {
      const response = await fetch(`/api/users/${email}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  onMount(fetchUsers);
</script>

<Navbar />
<ThemeStyle />

<!-- *********************************** SEARCH BAR *********************** -->
<div>
  <input
    id="search-bar"
    type="text"
    placeholder="Search by email"
    bind:value={$searchQuery}
  />
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
    <!-- *********************************** ALL USERS *********************** -->
    <!-- *********************************** FILTER USER ON SEARCH *********************** -->
    {#each users.filter((user) => user.email.toLowerCase().includes($searchQuery.toLowerCase())) as user}
      <tr>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.is_admin ? "Admin" : "User"}</td>
        <td>

          <!-- *********************************** EDIT USER FORM *********************** -->
          {#if $editingUser && $editingUser.email === user.email}
            <div class="edit-form">
              <input type="text" bind:value={$newUsername} placeholder="Username"/>
              <input type="text" bind:value={$newEmail} placeholder="Email"/>
              <div class="button-container">
                <button class="cancel-button" on:click={cancelEdit}>Cancel</button>
                <button class="save-button" on:click={updateUser}>Save</button>
              </div>
            </div>
          {:else if !user.is_admin}
            <!-- *********************************** EDIT USER BUTTON *********************** -->
            <button class="edit-button" on:click={() => editUser(user)}>Edit</button>
            <!-- *********************************** DELETE USER BUTTON *********************** -->
            <button class="delete-button" on:click={() => deleteUser(user.email)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M3 6l3 16.125A2.978 2.978 0 0 0 8.963 24h6.074a2.978 2.978 0 0 0 2.963-1.875L21 6H3zM14 3V2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1H5v2h14V3h-5zM10 2h4v1h-4V2zm1 7h2v10h-2V9zm-4 0h2v10H7V9zm10 0h-2v10h2V9z"
                />
              </svg>
            </button>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  /* --*********************************** SEARCH BAR *********************** -- */
  #search-bar {
    margin-top: 7%;
    width: 20%;
    margin-left: 99%;
    border: 2px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--background-color);
    color: var(--text-color);
    box-sizing: border-box;
    padding: 10px;
  }

  /* --*********************************** TABLE *********************** -- */
  table {
    margin-top: -3.3%;
    width: 97%;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
  }

  th,
  td {
    padding: 10px;
    border: 2px solid var(--border-color);
  }

  th {
    background-color: var(--table-header-color);
  }

  /* First row */
  th:first-child {
    border-top-left-radius: 10px;
  }

  th:last-child {
    border-top-right-radius: 10px;
  }

  /* Last row */
  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 10px;
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }

  .edit-button,
  .save-button,
  .cancel-button {
    width: 30%;
    padding: 10px;
    background-color: var(--button-color);
    border: none;
    border-radius: 5px;
    color: var(--text-color);
    font-size: 16px;
    cursor: pointer; 
  }

  .edit-button:hover,
  .save-button:hover,
  .cancel-button:hover {
    background-color: var(--button-hover-color);
    color: var(--text-color-mode);
  }

  .delete-button {
    background-color: var(--delete-button-color);
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    }
    
  .delete-button:hover {
    cursor: pointer;
    background-color: var(--delete-button-hover-color);
  }

  /*-- *********************************** EDIT FORM *********************** --*/
  .edit-form {
    display: flex;
    flex-direction: column;
  }

  .edit-form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 2px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 5px;
    gap: 2%;
  }
</style>
