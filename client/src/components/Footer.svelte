<script>
  import { theme } from "../stores/themeStore.js";
</script>

<footer class={$theme}>
  <div class="footer-container">
    <p>&copy; {new Date().getFullYear()} Movie Portal. All rights reserved.</p>
    <p>Powered by Movie Portal Team.</p>
  </div>
</footer>

<style>
  footer {
    background-color: #242424;
    color: #bdfffd;
    padding: 20px 0;
    text-align: center;
    position: relative;
    bottom: 0;
    width: 100%;
  }

  .footer-container {
    display: flex;
    margin-top: 5%;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
</style>